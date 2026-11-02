# 🧠 AI-Powered HR Analytics & Employee Attrition Prediction System

![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-Random%20Forest-F7931E?logo=scikitlearn&logoColor=white)
![SHAP](https://img.shields.io/badge/Explainable%20AI-SHAP-purple)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/Use-Academic%20Project-lightgrey)

A web-based decision-support system that helps HR teams **predict which employees are likely to leave**, understand **why**, and take **retention action** early. It combines a Random Forest model trained on the IBM HR Analytics dataset with an interactive dashboard, SHAP explanations, and a secure HR login system.

> 🎓 Final Year Major Project

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Dataset](#-dataset)
- [Getting Started (Local)](#-getting-started-local)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Security](#-security)
- [Deployment](#-deployment)
- [Limitations & Future Scope](#-limitations--future-scope)
- [Disclaimer](#-disclaimer)

---

## 🎯 Problem Statement

Employee attrition is expensive: recruitment cost, lost productivity, and knowledge drain. Most HR teams act only **after** an employee resigns. This project shifts HR from **reactive to proactive** by turning employee data into early-warning predictions with clear reasons behind each one.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📊 **HR Dashboard** | KPIs (total employees, attrition count, attrition rate, average income) with interactive Chart.js visualizations |
| 🤖 **Attrition Prediction** | Random Forest model predicts attrition probability for any employee profile |
| 🚦 **Risk Levels** | Employees are classified as **Low** (< 35%), **Medium** (35% to < 60%) or **High** (≥ 60%) risk |
| 🔎 **Employee Search** | Search and open individual employee detail pages |
| ⚠️ **High-Risk Employees** | Top 20 shown by default with a **View All** option for the complete list |
| ⚡ **HR Action Center** | Retention queue with risk factors (overtime, low satisfaction, no recent promotion, etc.) and a **Mark reviewed** status stored in the database |
| 🧩 **Explainable AI** | SHAP-based explanations show which factors push a prediction up or down |
| 🔐 **Secure Auth** | Server-side accounts, hashed passwords, HttpOnly session cookies, role-based access (HR / Employee) |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript, Chart.js |
| **Backend** | Python, FastAPI, Uvicorn |
| **Machine Learning** | scikit-learn (Random Forest), Pandas, NumPy, Joblib |
| **Explainability** | SHAP |
| **Database** | SQLAlchemy with SQLite (local) / PostgreSQL or MySQL (hosted) |
| **Auth** | PyJWT, PBKDF2 password hashing |
| **BI / Analytics** | MySQL queries and Power BI report (see project report) |
| **Deployment** | Docker, Render (Blueprint) |

---

## 🏗 System Architecture

```
IBM HR Dataset ──► Data Cleaning & Encoding ──► Random Forest Training
                                                        │
                                                        ▼
                                            employee_attrition_model.pkl
                                                        │
Browser (HTML/CSS/JS) ◄──── REST API (FastAPI) ◄────────┘
        │                        │
        │                        ├── SHAP explanations
        │                        ├── Auth + sessions (database)
        └── HR Action Center ───►└── Review status (database)
```

The frontend is served by the same FastAPI app, so there is **one URL, no CORS setup** needed.

---

## 📁 Project Structure

```
hr-analytics-deploy/
├── backend/
│   ├── main.py                      # FastAPI app, prediction & analytics APIs
│   ├── auth.py                      # Register / login / session / HR reviews
│   ├── security.py                  # Password hashing, rate limiting helpers
│   ├── employee_attrition_model.pkl # Trained Random Forest model
│   ├── employee_names.csv           # Fictional demo names mapped by EmployeeNumber
│   └── requirements.txt
├── frontend/
│   ├── index.html                   # Main dashboard
│   ├── login.html
│   ├── register.html
│   ├── employee.html                # Individual employee view
│   ├── style.css
│   ├── script.js
│   └── auth.js
├── data/
│   └── IBM-HR-Employee-Attrition.csv
├── Dockerfile
├── render.yaml                      # Render Blueprint config
├── RUN_LOCAL.bat                    # One-click local start (Windows)
├── .env.example                     # Sample environment variables
├── README_DEPLOY.md                 # Detailed deployment notes
└── README.md
```

---

## 📂 Dataset

- **Source:** IBM HR Analytics Employee Attrition & Performance dataset
- **Size:** 1,470 employees, 35 features
- **Attrition cases:** 237 employees (16.1%)
- **Sample features:** Age, Department, JobRole, MonthlyIncome, OverTime, JobSatisfaction, WorkLifeBalance, YearsAtCompany, YearsSinceLastPromotion, and more

---

## 🚀 Getting Started (Local)

### Prerequisites
- Python 3.10+ (project Dockerfile uses 3.13)
- pip

### Option 1: One-click (Windows)
1. Copy `.env.example` to `backend/.env` and fill in values.
2. Double-click **`RUN_LOCAL.bat`**.
3. Your browser opens at `http://127.0.0.1:8000`.

### Option 2: Manual

```bash
# 1. Clone the repository
git clone https://github.com/deepanshugoel-tech/-IBM-HR-Analytics-Employee-Attrition-Prediction-System.git
cd -IBM-HR-Analytics-Employee-Attrition-Prediction-System

# 2. Install dependencies
cd backend
pip install -r requirements.txt

# 3. Set environment variables (see table below)
#    Windows PowerShell:
$env:HR_INVITE_CODE="choose-a-secret-code"
#    Mac / Linux:
export HR_INVITE_CODE=choose-a-secret-code

# 4. Run the server
python -m uvicorn main:app --reload
```

Open **http://127.0.0.1:8000**, click **Create Account**, choose role **HR**, enter your invite code, then log in.

> ⚠️ Open the app through the FastAPI URL above. Do **not** use VS Code Live Server.

### Option 3: Docker

```bash
docker build -t hr-analytics .
docker run -p 8000:8000 --env-file backend/.env hr-analytics
```

---

## 🔧 Environment Variables

Copy `.env.example` to `backend/.env` for local runs. **Never commit the real `.env` file.**

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | ✅ | Long random string (32+ chars) used to sign sessions |
| `HR_INVITE_CODE` | ✅ | Secret code needed to register an HR account |
| `COOKIE_SECURE` | ✅ | `false` locally, `true` on the deployed HTTPS site |
| `DATABASE_URL` | Recommended | Hosted Postgres/MySQL URL so accounts never disappear |
| `BOOTSTRAP_HR_EMAIL` / `BOOTSTRAP_HR_PASSWORD` / `BOOTSTRAP_HR_NAME` | Optional | Auto-creates an HR admin on every start (password 8+ chars) |
| `ENABLE_DOCS` | Optional | `true` to expose FastAPI `/docs` (off by default) |
| `ALLOWED_ORIGINS` | Optional | Only if the frontend is hosted on a different domain |

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login (sets HttpOnly cookie) |
| GET | `/auth/me` | Logged in | Current user |
| POST | `/auth/logout` | Logged in | End session |
| GET | `/dashboard-summary` | HR | KPIs and chart data |
| GET | `/high-risk-employees` | HR | High-risk employee list |
| GET | `/employees/search` | HR | Search employees |
| GET | `/hr-action-center` | HR | Retention queue with risk factors |
| POST | `/predict` | Logged in | Predict attrition for an employee profile |
| POST | `/explain` | HR | SHAP explanation for a prediction |

Enable `ENABLE_DOCS=true` to browse the interactive Swagger docs at `/docs`.

---

## 🔒 Security

- Accounts stored in the **server database**, not browser localStorage
- Passwords hashed with **PBKDF2**
- **HttpOnly session cookie**, valid for 12 hours
- **Invite code** required for the HR role
- HR data APIs restricted to HR users
- Login **brute-force protection** (5 wrong attempts leads to a 15 minute lock)
- Security headers (X-Frame-Options, nosniff, HSTS on HTTPS), CORS closed by default, docs disabled by default

---

## ☁️ Deployment

Deployed using **Docker on Render** with a free hosted PostgreSQL database (e.g., Neon).

1. Create a free Postgres database on [neon.tech](https://neon.tech) and copy the `DATABASE_URL`.
2. Push this repository to GitHub (**without** `.env`).
3. On [Render](https://render.com): **New → Blueprint** and select the repo.
4. Set `DATABASE_URL` and `HR_INVITE_CODE` in the Render dashboard (the rest is handled by `render.yaml`).
5. Open `https://<your-app>.onrender.com`.

> 💡 `shap` and `scikit-learn` are memory-heavy. If the free 512 MB plan runs out of memory, use the `starter` plan or Hugging Face Spaces (Docker, set `PORT=7860`).

See [`README_DEPLOY.md`](README_DEPLOY.md) for more details.

---

## ⚠️ Limitations & Future Scope

**Current limitations**
- The IBM dataset is a sample dataset; employee names are fictional demo labels.
- Prediction history is stored in the browser.
- Rate limiting is in-memory (single server process).
- No password reset or email verification yet.

**Future scope**
- Integration with live HRMS data
- Advanced models (XGBoost, LightGBM) and hyperparameter tuning
- Automated email alerts for high-risk employees
- Password reset, email verification, and Redis-based rate limiting
- Role-based dashboards for managers and executives

---

## 📄 Disclaimer

This project is built for **academic and educational purposes**. Predictions are statistical estimates based on a public sample dataset and should support, not replace, human HR judgment. Employee names in the demo are fictional.

---

## 👤 Author

**Deepanshu Goel** ([@deepanshugoel-tech](https://github.com/deepanshugoel-tech))
Final Year Project: AI-Powered HR Analytics & Employee Attrition Prediction System

⭐ If you found this project useful, consider giving it a star!
