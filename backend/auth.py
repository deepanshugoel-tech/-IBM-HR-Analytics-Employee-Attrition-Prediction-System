"""Server-side accounts: register / login / logout / me.

Accounts live in a real database (DATABASE_URL, or a local SQLite file as fallback),
and the browser only keeps an HttpOnly session cookie. This replaces the old
localStorage login, where accounts existed only inside each visitor's own browser.
"""
import os
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Integer, String, create_engine, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import declarative_base, sessionmaker

import security

try:  # lets you keep local settings in backend/.env (ignored if python-dotenv is missing)
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
except ImportError:
    pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ------------------------------------------------------------------ settings
SECRET_KEY = os.getenv("SECRET_KEY", "").strip()
if len(SECRET_KEY) < 32:
    SECRET_KEY = secrets.token_urlsafe(48)
    print("WARNING: SECRET_KEY not set (or shorter than 32 chars). Using a temporary key - "
          "users will be logged out on every restart. Set SECRET_KEY in your hosting settings.")

COOKIE_NAME = "hr_session"
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").strip().lower() in ("1", "true", "yes")
SESSION_HOURS = int(os.getenv("SESSION_HOURS", "12"))
HR_INVITE_CODE = os.getenv("HR_INVITE_CODE", "").strip()


def _database_url() -> str:
    url = os.getenv("DATABASE_URL", "").strip()
    if url:
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://"):]
        if url.startswith("postgresql://"):
            url = "postgresql+psycopg2://" + url[len("postgresql://"):]
        if url.startswith("mysql://"):
            url = "mysql+pymysql://" + url[len("mysql://"):]
        return url
    folder = os.path.join(BASE_DIR, "instance")
    os.makedirs(folder, exist_ok=True)
    return "sqlite:///" + os.path.join(folder, "hr_users.db")


DATABASE_URL = _database_url()
IS_SQLITE = DATABASE_URL.startswith("sqlite")
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if IS_SQLITE else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
Base = declarative_base()


class User(Base):
    __tablename__ = "app_users"
    id = Column(Integer, primary_key=True)
    name = Column(String(80), nullable=False)
    email = Column(String(254), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # "HR" or "Employee"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ActionReview(Base):
    """HR Action Center: employees an HR user has marked as reviewed (shared by all HR users)."""
    __tablename__ = "action_reviews"
    employee_number = Column(Integer, primary_key=True, autoincrement=False)
    reviewed_by_name = Column(String(80), nullable=False)
    reviewed_at = Column(DateTime, nullable=False)


def init_auth():
    """Create tables and (optionally) a bootstrap HR account from env variables."""
    Base.metadata.create_all(engine)

    email = os.getenv("BOOTSTRAP_HR_EMAIL", "").strip().lower()
    password = os.getenv("BOOTSTRAP_HR_PASSWORD", "")
    name = os.getenv("BOOTSTRAP_HR_NAME", "HR Admin").strip() or "HR Admin"
    if email and len(password) >= 8 and security.valid_email(email):
        with SessionLocal() as db:
            if not db.scalar(select(User).where(User.email == email)):
                db.add(User(name=name[:80], email=email,
                            password_hash=security.hash_password(password), role="HR"))
                db.commit()
                print(f"Bootstrap HR account created for {email}")
    if IS_SQLITE:
        print("NOTE: using local SQLite for accounts. On free hosting its disk may be wiped on "
              "redeploy - set DATABASE_URL to a hosted database for permanent accounts.")


# -------------------------------------------------------------- dependencies
def current_user(request: Request) -> User:
    token = request.cookies.get(COOKIE_NAME)
    user_id = security.read_token(token, SECRET_KEY) if token else None
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not logged in")
    with SessionLocal() as db:
        user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    return user


def require_hr(user: User = Depends(current_user)) -> User:
    if user.role != "HR":
        raise HTTPException(status_code=403, detail="HR access only")
    return user


# ------------------------------------------------------------------- routes
router = APIRouter(prefix="/auth", tags=["auth"])
limiter = security.RateLimiter()


class RegisterIn(BaseModel):
    name: str
    email: str
    password: str
    role: str = "Employee"
    invite_code: str = ""


class LoginIn(BaseModel):
    email: str
    password: str


def _ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _public(user: User) -> dict:
    return {"name": user.name, "email": user.email, "role": user.role}


@router.post("/register")
def register(data: RegisterIn, request: Request):
    ip_key = f"reg|{_ip(request)}"
    if limiter.blocked(ip_key, 10, 3600):
        raise HTTPException(status_code=429, detail="Too many sign-ups from this network. Try later.")

    name = data.name.strip()
    email = data.email.strip().lower()
    if not (2 <= len(name) <= 80):
        raise HTTPException(status_code=400, detail="Name must be 2-80 characters.")
    if not security.valid_email(email):
        raise HTTPException(status_code=400, detail="Enter a valid email address.")
    if not (8 <= len(data.password) <= 128):
        raise HTTPException(status_code=400, detail="Password must be 8-128 characters.")
    if data.password.lower() == email:
        raise HTTPException(status_code=400, detail="Password cannot be the same as email.")
    if data.role not in ("HR", "Employee"):
        raise HTTPException(status_code=400, detail="Select a valid role.")

    if data.role == "HR":
        if not HR_INVITE_CODE:
            raise HTTPException(status_code=403, detail="HR registration is disabled on this server.")
        import hmac
        if not hmac.compare_digest(data.invite_code.strip(), HR_INVITE_CODE):
            limiter.add(ip_key, 3600)
            raise HTTPException(status_code=403, detail="Invalid HR invite code.")

    limiter.add(ip_key, 3600)
    with SessionLocal() as db:
        if db.scalar(select(User).where(User.email == email)):
            raise HTTPException(status_code=409, detail="This email is already registered. Please login.")
        db.add(User(name=name, email=email,
                    password_hash=security.hash_password(data.password), role=data.role))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=409, detail="This email is already registered. Please login.")
    return {"success": True}


@router.post("/login")
def login(data: LoginIn, request: Request, response: Response):
    email = data.email.strip().lower()
    email_key, ip_key = f"login-email|{email}", f"login-ip|{_ip(request)}"
    window = 15 * 60
    if limiter.blocked(email_key, 5, window) or limiter.blocked(ip_key, 30, window):
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")

    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email))

    # Always run one hash verification so timing does not reveal whether the email exists.
    ok = security.verify_password(data.password, user.password_hash if user else security.DUMMY_HASH)
    if not user or not ok:
        limiter.add(email_key, window)
        limiter.add(ip_key, window)
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    limiter.clear(email_key)
    token = security.create_token(user.id, SECRET_KEY, SESSION_HOURS)
    response.set_cookie(
        COOKIE_NAME, token,
        max_age=SESSION_HOURS * 3600, httponly=True,
        secure=COOKIE_SECURE, samesite="lax", path="/",
    )
    return {"success": True, "user": _public(user)}


@router.get("/me")
def me(user: User = Depends(current_user)):
    return _public(user)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(COOKIE_NAME, path="/", secure=COOKIE_SECURE, httponly=True, samesite="lax")
    return {"success": True}


# ------------------------------------------------- HR Action Center reviews
reviews_router = APIRouter(prefix="/action-reviews", tags=["action-center"])


class ReviewIn(BaseModel):
    employee_numbers: list[int]


@reviews_router.get("")
def list_reviews(user: User = Depends(require_hr)):
    with SessionLocal() as db:
        rows = db.scalars(select(ActionReview)).all()
    return {
        "success": True,
        "reviews": {
            str(r.employee_number): {
                "reviewed": True,
                "reviewedAt": r.reviewed_at.isoformat() + "Z",
                "reviewedBy": r.reviewed_by_name,
            }
            for r in rows
        },
    }


@reviews_router.post("")
def add_reviews(data: ReviewIn, user: User = Depends(require_hr)):
    ids = sorted(set(data.employee_numbers))
    if not ids or len(ids) > 2000 or any(i < 1 or i > 1_000_000 for i in ids):
        raise HTTPException(status_code=400, detail="Invalid employee list.")
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    with SessionLocal() as db:
        existing = set(db.scalars(
            select(ActionReview.employee_number).where(ActionReview.employee_number.in_(ids))
        ).all())
        for i in ids:
            if i not in existing:
                db.add(ActionReview(employee_number=i, reviewed_by_name=user.name, reviewed_at=now))
        try:
            db.commit()
        except IntegrityError:  # another HR user marked the same employee at the same moment
            db.rollback()
    return {"success": True, "saved": len(ids) - len(existing)}
