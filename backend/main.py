import os
import joblib
import pandas as pd
import shap

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from auth import router as auth_router, reviews_router, init_auth, current_user, require_hr, COOKIE_SECURE

# ============================================================
# FASTAPI APP
# ============================================================

ENABLE_DOCS = os.getenv("ENABLE_DOCS", "false").strip().lower() in ("1", "true", "yes")

app = FastAPI(
    title="HR Analytics & Employee Attrition Prediction API",
    description="AI-powered Employee Attrition Prediction System",
    version="1.1.0",
    docs_url="/docs" if ENABLE_DOCS else None,
    redoc_url=None,
    openapi_url="/openapi.json" if ENABLE_DOCS else None,
)

# Create user tables (and optional bootstrap HR account).
init_auth()
app.include_router(auth_router)
app.include_router(reviews_router)


# ============================================================
# CORS (frontend is served from this same app, so CORS is normally
# not needed. Set ALLOWED_ORIGINS only if you host the frontend elsewhere.)
# ============================================================

_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
if _origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )


# ============================================================
# SECURITY HEADERS
# ============================================================

@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "same-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    if COOKIE_SECURE:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    if request.url.path.endswith((".html", "/")) or request.url.path.startswith(("/auth", "/action", "/hr-", "/dash", "/high", "/employees", "/predict", "/explain")):
        response.headers["Cache-Control"] = "no-store"
    return response


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "employee_attrition_model.pkl"
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "..",
    "data",
    "IBM-HR-Employee-Attrition.csv"
)

FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")


# ============================================================
# LOAD MODEL
# ============================================================

try:
    model = joblib.load(MODEL_PATH)
    MODEL_LOADED = True
    print("Model loaded successfully.")

except Exception as e:
    model = None
    MODEL_LOADED = False
    print("Model loading failed:", str(e))


# ============================================================
# LOAD DATASET
# ============================================================

try:
    df = pd.read_csv(DATASET_PATH)
    DATASET_LOADED = True
    print("Dataset loaded successfully.")
    print("Dataset shape:", df.shape)

except Exception as e:
    df = pd.DataFrame()
    DATASET_LOADED = False
    print("Dataset loading failed:", str(e))


# ============================================================
# FICTIONAL DEMO EMPLOYEE NAME MAPPING
# IBM sample data does not contain real employee names.
# These labels are generated only for project demonstration.
# ============================================================

NAME_MAP_PATH = os.path.join(BASE_DIR, "employee_names.csv")
EMPLOYEE_NAME_MAP = {}

try:
    if os.path.exists(NAME_MAP_PATH):
        _names_df = pd.read_csv(NAME_MAP_PATH, dtype={"EmployeeNumber": str})
        EMPLOYEE_NAME_MAP = dict(zip(
            _names_df["EmployeeNumber"].astype(str).str.replace(r"\.0$", "", regex=True),
            _names_df["EmployeeName"].astype(str)
        ))
        print(f"Loaded {len(EMPLOYEE_NAME_MAP)} fictional demo employee names.")
    else:
        print("Employee name map not found; Employee IDs will be displayed.")
except Exception as e:
    EMPLOYEE_NAME_MAP = {}
    print("Employee name map loading failed:", str(e))


# ============================================================
# SHAP EXPLAINER (created once, reused for every request)
# ============================================================

explainer = None

try:
    if model is not None:
        explainer = shap.TreeExplainer(model)
        print("SHAP explainer ready.")

except Exception as e:
    explainer = None
    print("SHAP explainer creation failed:", str(e))


# ============================================================
# PYDANTIC MODEL
# ============================================================

class EmployeeData(BaseModel):
    Age: int
    MonthlyIncome: float
    YearsAtCompany: int
    JobSatisfaction: int
    OverTime: str
    JobLevel: int


# ============================================================
# HELPERS
# ============================================================

def get_yes_index():
    """Index of the 'Attrition = Yes' class inside model.classes_."""

    classes = list(model.classes_)

    if 1 in classes:
        return classes.index(1)

    if "Yes" in classes:
        return classes.index("Yes")

    return 1


def get_risk_level(risk_percentage):

    if risk_percentage < 35:
        return "Low"

    if risk_percentage < 60:
        return "Medium"

    return "High"


# ============================================================
# CREATE MODEL INPUT
# ============================================================

def create_employee_data(employee):

    return {
        "Age": employee.Age,
        "BusinessTravel": "Travel_Rarely",
        "DailyRate": 800,
        "Department": "Research & Development",
        "DistanceFromHome": 5,
        "Education": 3,
        "EducationField": "Life Sciences",
        "EmployeeCount": 1,
        "EmployeeNumber": 9999,
        "EnvironmentSatisfaction": 3,
        "Gender": "Male",
        "HourlyRate": 65,
        "JobInvolvement": 3,
        "JobLevel": employee.JobLevel,
        "JobRole": "Research Scientist",
        "JobSatisfaction": employee.JobSatisfaction,
        "MaritalStatus": "Single",
        "MonthlyIncome": employee.MonthlyIncome,
        "MonthlyRate": 14000,
        "NumCompaniesWorked": 2,
        "Over18": "Y",
        "OverTime": employee.OverTime,
        "PercentSalaryHike": 15,
        "PerformanceRating": 3,
        "RelationshipSatisfaction": 3,
        "StandardHours": 80,
        "StockOptionLevel": 0,
        "TotalWorkingYears": max(
            employee.YearsAtCompany + 2,
            employee.YearsAtCompany
        ),
        "TrainingTimesLastYear": 3,
        "WorkLifeBalance": 3,
        "YearsAtCompany": employee.YearsAtCompany,
        "YearsInCurrentRole": min(
            employee.YearsAtCompany,
            5
        ),
        "YearsSinceLastPromotion": min(
            employee.YearsAtCompany,
            3
        ),
        "YearsWithCurrManager": min(
            employee.YearsAtCompany,
            5
        )
    }


# ============================================================
# PREPARE MODEL INPUT
# ============================================================

def prepare_model_input(input_df):

    # FIX: drop_first=True removed.
    # With a single row, drop_first=True deletes the only category of
    # every text column (OverTime, MaritalStatus, JobRole ...), so all
    # of them became 0 and OverTime had no effect on the prediction.
    # reindex() below already removes the extra / baseline columns.
    input_df = pd.get_dummies(input_df)

    # Match exactly with model training features
    if hasattr(model, "feature_names_in_"):

        input_df = input_df.reindex(
            columns=model.feature_names_in_,
            fill_value=0
        )

    return input_df.astype(float)


# ============================================================
# ROOT
# ============================================================

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/home.html")


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "model_loaded": MODEL_LOADED,
        "dataset_loaded": DATASET_LOADED
    }


# ============================================================
# DASHBOARD SUMMARY
# ============================================================

@app.get("/dashboard-summary", dependencies=[Depends(require_hr)])
def dashboard_summary():

    if df.empty:

        return {
            "success": False,
            "error": "Dataset not loaded"
        }

    total_employees = len(df)

    employees_left = int(
        (df["Attrition"] == "Yes").sum()
    )

    employees_stayed = int(
        (df["Attrition"] == "No").sum()
    )

    attrition_rate = round(
        (employees_left / total_employees) * 100,
        2
    )

    average_income = round(
        float(df["MonthlyIncome"].mean()),
        2
    )

    # Department-wise attrition
    department_attrition = (
        df.groupby("Department")["Attrition"]
        .apply(
            lambda x: int((x == "Yes").sum())
        )
        .to_dict()
    )

    # Attrition distribution
    attrition_distribution = (
        df["Attrition"]
        .value_counts()
        .to_dict()
    )

    # Job role distribution
    job_role_distribution = (
        df["JobRole"]
        .value_counts()
        .to_dict()
    )

    # Gender distribution
    gender_distribution = (
        df["Gender"]
        .value_counts()
        .to_dict()
    )

    # Age groups
    age_groups = pd.cut(
        df["Age"],
        bins=[0, 25, 35, 45, 55, 100],
        labels=[
            "18-25",
            "26-35",
            "36-45",
            "46-55",
            "56+"
        ]
    )

    age_distribution = (
        age_groups
        .value_counts()
        .sort_index()
        .to_dict()
    )

    # Job satisfaction
    satisfaction_distribution = (
        df["JobSatisfaction"]
        .value_counts()
        .sort_index()
        .to_dict()
    )

    # Overtime attrition
    overtime_attrition = (
        df.groupby("OverTime")["Attrition"]
        .apply(
            lambda x: int((x == "Yes").sum())
        )
        .to_dict()
    )

    # Overtime distribution
    overtime_distribution = (
        df["OverTime"]
        .value_counts()
        .to_dict()
    )

    return {

        "success": True,

        "total_employees": total_employees,

        "employees_left": employees_left,

        "employees_stayed": employees_stayed,

        "attrition_rate": attrition_rate,

        "average_monthly_income": average_income,

        "department_attrition": department_attrition,

        "attrition_distribution": attrition_distribution,

        "job_role_distribution": job_role_distribution,

        "gender_distribution": gender_distribution,

        "age_distribution": age_distribution,

        "satisfaction_distribution": satisfaction_distribution,

        "overtime_attrition": overtime_attrition,

        "overtime_distribution": overtime_distribution
    }


# ============================================================
# HIGH-RISK EMPLOYEES
# ============================================================

@app.get("/high-risk-employees", dependencies=[Depends(require_hr)])
def get_high_risk_employees():

    try:

        if df.empty:

            return {
                "success": False,
                "total_high_risk": 0,
                "employees": [],
                "error": "Dataset not loaded"
            }

        # ----------------------------------------------------
        # STEP 1: Remove target column
        # ----------------------------------------------------

        model_data = df.drop(
            columns=["Attrition"],
            errors="ignore"
        ).copy()

        # ----------------------------------------------------
        # STEP 2: Prepare model input
        # ----------------------------------------------------

        model_input = prepare_model_input(
            model_data
        )

        # ----------------------------------------------------
        # STEP 3: Predictions
        # ----------------------------------------------------

        predictions = model.predict(
            model_input
        )

        probabilities = model.predict_proba(
            model_input
        )

        # ----------------------------------------------------
        # STEP 4: Find Attrition = Yes probability
        # ----------------------------------------------------

        yes_index = get_yes_index()

        # ----------------------------------------------------
        # STEP 5: Build high-risk employees
        # ----------------------------------------------------

        high_risk_employees = []

        for index, (_, row) in enumerate(
            df.iterrows()
        ):

            prediction = predictions[index]

            risk_percentage = round(
                float(
                    probabilities[index][yes_index]
                ) * 100,
                2
            )

            risk_level = get_risk_level(
                risk_percentage
            )

            # Only high-risk employees

            if risk_level == "High":

                high_risk_employees.append({

                    "employee_number": int(
                        row["EmployeeNumber"]
                    ),

                    "age": int(
                        row["Age"]
                    ),

                    "monthly_income": float(
                        row["MonthlyIncome"]
                    ),

                    "overtime": str(
                        row["OverTime"]
                    ),

                    "risk_percentage": risk_percentage,

                    "risk_level": risk_level,

                    "prediction": (
                        "Yes"
                        if prediction == 1
                        or str(prediction).lower() == "yes"
                        else "No"
                    )

                })

        # ----------------------------------------------------
        # STEP 6: Highest risk first
        # ----------------------------------------------------

        high_risk_employees.sort(
            key=lambda x: x["risk_percentage"],
            reverse=True
        )

        # ----------------------------------------------------
        # STEP 7: Response
        # ----------------------------------------------------

        return {

            "success": True,

            "total_high_risk": len(
                high_risk_employees
            ),

            "employees": high_risk_employees

        }

    except Exception as e:

        print(
            "High Risk Error:",
            str(e)
        )

        return {

            "success": False,

            "total_high_risk": 0,

            "employees": [],

            "error": "Internal server error. Please try again."

        }


# ============================================================
# EMPLOYEE SEARCH
# ============================================================

@app.get("/employees/search", dependencies=[Depends(require_hr)])
def search_employees(
    department: str = "",
    job_role: str = "",
    gender: str = "",
    overtime: str = "",
    attrition: str = ""
):

    try:

        if df.empty:

            return {
                "success": False,
                "total": 0,
                "employees": [],
                "error": "Dataset not loaded"
            }

        filtered_df = df.copy()

        # Department
        if department and department.lower() != "all":

            filtered_df = filtered_df[
                filtered_df["Department"]
                .astype(str)
                .str.lower()
                == department.lower()
            ]

        # Job Role
        if job_role and job_role.lower() != "all":

            filtered_df = filtered_df[
                filtered_df["JobRole"]
                .astype(str)
                .str.lower()
                == job_role.lower()
            ]

        # Gender
        if gender and gender.lower() != "all":

            filtered_df = filtered_df[
                filtered_df["Gender"]
                .astype(str)
                .str.lower()
                == gender.lower()
            ]

        # Overtime
        if overtime and overtime.lower() != "all":

            filtered_df = filtered_df[
                filtered_df["OverTime"]
                .astype(str)
                .str.lower()
                == overtime.lower()
            ]

        # Attrition
        if attrition and attrition.lower() != "all":

            filtered_df = filtered_df[
                filtered_df["Attrition"]
                .astype(str)
                .str.lower()
                == attrition.lower()
            ]

        # Create response
        employees = []

        for _, row in filtered_df.iterrows():

            employees.append({

                "employee_number": int(
                    row["EmployeeNumber"]
                ),

                "age": int(
                    row["Age"]
                ),

                "department": str(
                    row["Department"]
                ),

                "job_role": str(
                    row["JobRole"]
                ),

                "gender": str(
                    row["Gender"]
                ),

                "overtime": str(
                    row["OverTime"]
                ),

                "monthly_income": int(
                    row["MonthlyIncome"]
                ),

                "attrition": str(
                    row["Attrition"]
                )
            })

        return {

            "success": True,

            "total": len(employees),

            "employees": employees
        }

    except Exception as e:

        print(
            "Employee Search Error:",
            str(e)
        )

        return {

            "success": False,

            "total": 0,

            "employees": [],

            "error": "Internal server error. Please try again."
        }


# ============================================================
# HR ACTION CENTER - RISK QUEUE & RETENTION RECOMMENDATIONS
# ============================================================

@app.get("/hr-action-center", dependencies=[Depends(require_hr)])
def hr_action_center():
    """Return model-scored employee retention actions for the HR dashboard.

    Names are fictional demo labels mapped by EmployeeNumber because the
    source IBM HR dataset contains no employee names.
    """
    try:
        if df.empty:
            return {"success": False, "employees": [], "error": "Dataset not loaded"}
        if model is None:
            return {"success": False, "employees": [], "error": "ML model not loaded"}

        model_data = df.drop(columns=["Attrition"], errors="ignore").copy()
        model_input = prepare_model_input(model_data)
        predictions = model.predict(model_input)
        probabilities = model.predict_proba(model_input)
        yes_index = get_yes_index()

        employees = []
        for index, (_, row) in enumerate(df.iterrows()):
            risk_percentage = round(float(probabilities[index][yes_index]) * 100, 2)
            risk_level = get_risk_level(risk_percentage)
            prediction_value = predictions[index]
            predicted_attrition = (
                "Yes" if prediction_value == 1 or str(prediction_value).strip().lower() == "yes" else "No"
            )

            factors = []
            if str(row.get("OverTime", "No")).strip().lower() == "yes":
                factors.append("Overtime: Yes")
            if int(row.get("JobSatisfaction", 3)) <= 2:
                factors.append("Low job satisfaction")
            if int(row.get("WorkLifeBalance", 3)) <= 2:
                factors.append("Work-life balance needs review")
            if int(row.get("EnvironmentSatisfaction", 3)) <= 2:
                factors.append("Low environment satisfaction")
            if int(row.get("YearsSinceLastPromotion", 0)) >= 3:
                factors.append("No recent promotion")
            if int(row.get("YearsAtCompany", 0)) <= 1:
                factors.append("Early tenure - onboarding support")
            if not factors:
                factors.append("No rule-based warning identified")

            if risk_level == "High":
                recommendation = "Arrange a confidential HR check-in; review workload, engagement and career concerns."
                priority = "Urgent"
                action_type = "Retention meeting"
            elif risk_level == "Medium":
                recommendation = "Schedule an engagement discussion and review development opportunities."
                priority = "Attention"
                action_type = "Engagement review"
            else:
                recommendation = "Continue routine engagement and periodic wellbeing check-ins."
                priority = "Monitor"
                action_type = "Routine monitoring"

            emp_id = str(int(row["EmployeeNumber"]))
            employees.append({
                "employee_number": int(row["EmployeeNumber"]),
                "employee_name": EMPLOYEE_NAME_MAP.get(emp_id, f"Employee #{emp_id}"),
                "name_is_demo": emp_id in EMPLOYEE_NAME_MAP,
                "department": str(row.get("Department", "-")),
                "job_role": str(row.get("JobRole", "-")),
                "age": int(row.get("Age", 0)),
                "risk_percentage": risk_percentage,
                "risk_level": risk_level,
                "predicted_attrition": predicted_attrition,
                "factors": factors,
                "recommendation": recommendation,
                "priority": priority,
                "action_type": action_type,
                "overtime": str(row.get("OverTime", "-")),
                "job_satisfaction": int(row.get("JobSatisfaction", 0)),
                "work_life_balance": int(row.get("WorkLifeBalance", 0))
            })

        employees.sort(key=lambda item: item["risk_percentage"], reverse=True)
        counts = {level: sum(e["risk_level"] == level for e in employees) for level in ["High", "Medium", "Low"]}
        return {
            "success": True,
            "total": len(employees),
            "high_risk_count": counts["High"],
            "medium_risk_count": counts["Medium"],
            "low_risk_count": counts["Low"],
            "employees": employees,
            "name_source": "Fictional demo labels mapped to EmployeeNumber; not real IBM employee names.",
            "note": "Risk scores are model estimates, not certainty or proof of intent to leave. HR must review each case fairly and confidentially."
        }
    except Exception as e:
        print("HR Action Center Error:", str(e))
        return {"success": False, "employees": [], "error": "Internal server error. Please try again."}


# ============================================================
# EMPLOYEE ATTRITION PREDICTION
# ============================================================

@app.post("/predict", dependencies=[Depends(current_user)])
def predict_employee(employee: EmployeeData):

    try:

        # Create employee input
        employee_dict = create_employee_data(employee)

        input_df = pd.DataFrame([employee_dict])

        # Prepare model input
        model_input = prepare_model_input(input_df)

        # Prediction
        prediction = model.predict(model_input)[0]

        # Probability
        probabilities = model.predict_proba(model_input)[0]

        # ---------------------------------------------
        # IMPORTANT:
        # Find probability of Attrition = Yes
        # using model.classes_
        # ---------------------------------------------

        yes_index = get_yes_index()

        risk_percentage = round(
            float(probabilities[yes_index]) * 100,
            2
        )

        # ---------------------------------------------
        # Prediction result
        # ---------------------------------------------

        if prediction == 1 or str(prediction).lower() == "yes":
            prediction_result = "Yes"
        else:
            prediction_result = "No"

        # ---------------------------------------------
        # Risk level
        # ---------------------------------------------

        risk_level = get_risk_level(risk_percentage)

        # ---------------------------------------------
        # Message
        # ---------------------------------------------

        if prediction_result == "Yes":

            message = (
                "Employee is predicted to leave."
            )

        else:

            message = (
                "Employee is predicted to stay."
            )

        return {

            "success": True,

            "prediction": prediction_result,

            "risk_percentage": risk_percentage,

            "risk_level": risk_level,

            "message": message

        }

    except Exception as e:

        print(
            "Prediction Error:",
            str(e)
        )

        return {

            "success": False,

            "error": "Internal server error. Please try again."

        }


# ============================================================
# SHAP EXPLANATION
# ============================================================

@app.post("/explain", dependencies=[Depends(require_hr)])
def explain_employee(employee: EmployeeData):

    try:

        # Create input
        employee_dict = create_employee_data(
            employee
        )

        input_df = pd.DataFrame(
            [employee_dict]
        )

        # Prepare model input
        model_input = prepare_model_input(
            input_df
        )

        # SHAP Tree Explainer (created once at startup)
        current_explainer = explainer or shap.TreeExplainer(
            model
        )

        shap_values = current_explainer.shap_values(
            model_input
        )

        yes_index = get_yes_index()

        # ---------------------------------------------
        # FIX: handle every SHAP output format
        #
        # Old shap  : list of arrays -> shap_values[class][row]
        # New shap  : ndarray (rows, features, classes)
        # Binary    : ndarray (rows, features)
        #
        # The old code did values[:, 1][0], which returned a single
        # number instead of one value per feature, so /explain failed
        # and the frontend showed "no SHAP factors".
        # ---------------------------------------------

        if isinstance(shap_values, list):

            values = shap_values[yes_index][0]

        else:

            values = shap_values[0]

            if values.ndim > 1:

                values = values[:, yes_index]

        # Create feature importance table
        feature_names = model_input.columns

        explanation = []

        for feature, value in zip(
            feature_names,
            values
        ):

            explanation.append({

                "feature": feature,

                "impact": round(
                    float(value),
                    4
                )
            })

        # Sort by absolute impact
        explanation.sort(
            key=lambda x: abs(
                x["impact"]
            ),
            reverse=True
        )

        return {

            "success": True,

            "explanation": explanation[:10]
        }

    except Exception as e:

        print(
            "SHAP Error:",
            str(e)
        )

        return {

            "success": False,

            "error": "Internal server error. Please try again."
        }


# ============================================================
# FRONTEND (served from the same origin -> cookies just work)
# Must stay LAST so it never shadows the API routes above.
# ============================================================

app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
