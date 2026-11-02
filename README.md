# -IBM-HR-Analytics-Employee-Attrition-Prediction-System
This system is a web-based decision-support platform that helps HR teams predict which employees are likely to leave the organization, and why. It uses the IBM HR Analytics Employee Attrition dataset to train a machine learning model that flags high-risk employees early, so HR can step in with retention actions before talent is lost.

🛠** Tech Stack**
Layer	Technology
Frontend	HTML, CSS, JavaScript, Chart.js
Backend	Python, FastAPI, Uvicorn
Machine Learning	scikit-learn (Random Forest), Pandas, NumPy, Joblib
Explainability	SHAP
Database	SQLAlchemy with SQLite (local) / PostgreSQL or MySQL (hosted)
Auth	PyJWT, PBKDF2 password hashing
BI / Analytics	MySQL queries and Power BI report (see project report)
Deployment	Docker, Render (Blueprint)

📁 **Project Structure**
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

Author
Deepanshu Goel Final Year Project: AI-Powered HR Analytics & Employee Attrition Prediction System
