"""Pure-Python security helpers (no web framework imports) so they are easy to test."""
import hashlib
import hmac
import re
import secrets
import time
from datetime import datetime, timedelta, timezone

import jwt  # PyJWT

PBKDF2_ITERATIONS = 600_000
EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")


# ---------------------------------------------------------------- passwords
def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        scheme, iterations, salt_hex, digest_hex = stored.split("$")
        if scheme != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(iterations)
        )
        return hmac.compare_digest(digest.hex(), digest_hex)
    except Exception:
        return False


# A fixed hash used to burn the same CPU time when the e-mail does not exist
# (prevents telling attackers which e-mails are registered via response time).
DUMMY_HASH = hash_password("dummy-password-for-timing")


# ------------------------------------------------------------------- tokens
def create_token(user_id: int, secret: str, hours: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": str(user_id), "iat": now, "exp": now + timedelta(hours=hours)}
    return jwt.encode(payload, secret, algorithm="HS256")


def read_token(token: str, secret: str):
    """Return the user id inside a valid token, or None."""
    try:
        data = jwt.decode(token, secret, algorithms=["HS256"], options={"require": ["exp", "sub"]})
        return int(data["sub"])
    except Exception:
        return None


# ------------------------------------------------------------ rate limiting
class RateLimiter:
    """Small in-memory sliding-window limiter (per process)."""

    def __init__(self):
        self._hits = {}

    def _prune(self, key, window):
        now = time.time()
        hits = [t for t in self._hits.get(key, []) if now - t < window]
        if hits:
            self._hits[key] = hits
        else:
            self._hits.pop(key, None)
        return hits

    def blocked(self, key: str, limit: int, window: int) -> bool:
        return len(self._prune(key, window)) >= limit

    def add(self, key: str, window: int):
        self._prune(key, window)
        self._hits.setdefault(key, []).append(time.time())

    def clear(self, key: str):
        self._hits.pop(key, None)


def valid_email(email: str) -> bool:
    return len(email) <= 254 and bool(EMAIL_RE.match(email))
