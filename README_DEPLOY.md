# QUICK START (kuch edit nahi karna)

**Local:** `RUN_LOCAL.bat` par double-click karo. Browser khulega -> Create Account -> Role **HR** -> Invite Code: **HR2026** -> Login.
(Settings `backend/.env` me pehle se bhari hain. Live Server use mat karna.)

**Deploy:** neon.tech se free `DATABASE_URL` lo -> repo GitHub par daalo -> Render me "Blueprint" se deploy -> Render me sirf ye env set karo:
`DATABASE_URL` (Neon wala) aur `HR_INVITE_CODE` (apna code). Baaki render.yaml sambhal leta hai.

---

# HR Analytics – Deploy Ready (secure login)

## Pehle problem kya thi?
Purane login me accounts **browser ke localStorage** me save hote the. Isliye
- browser data clear / alag browser / `127.0.0.1` vs `localhost` / alag device = account gayab, dobara register.
- Deploy ke baad har visitor ka apna alag "database" hota (aapka account kisi aur ko nahi dikhta).
- Password plain text me tha aur koi bhi "HR" role khud select kar sakta tha.

## Ab kya badla?
- Accounts **server ke database** me (`app_users` table), password **PBKDF2 hash** ke saath.
- Login par **HttpOnly session cookie** (JavaScript se chori nahi hoti), 12 ghante valid.
- **HR role ke liye invite code** (`HR_INVITE_CODE`). Employee role open hai.
- Saare HR data APIs (`/dashboard-summary`, `/high-risk-employees`, `/employees/search`, `/hr-action-center`, `/explain`) sirf **HR login** par; `/predict` kisi bhi logged-in user par.
- Login brute-force limit (5 galat try = 15 min lock), security headers, CORS band, `/docs` band, error messages me internal details nahi.
- Frontend backend ke saath **same URL** se serve hota hai (`127.0.0.1:8000` hardcode hata diya).
- `.env`, `__pycache__`, Documentation, Power BI, sample-training files package se hata diye.

## Local me chalana (pehle test kar lo)
```
cd backend
pip install -r requirements.txt
# Windows PowerShell:  $env:HR_INVITE_CODE="mycode123"
# Mac/Linux:           export HR_INVITE_CODE=mycode123
python -m uvicorn main:app --reload
```
Browser: http://127.0.0.1:8000  (Live Server use **mat** karo, ab zaroorat nahi.)
Register -> HR (invite code: mycode123) -> Login. Browser band karke dobara kholo, login bana rahega.

## Deploy (Render + free hosted database)
1. **Database (zaroori):** neon.tech par free Postgres banao, `DATABASE_URL` copy karo.
   (Iske bina SQLite free hosting par redeploy/restart me delete ho sakta hai = wahi "dobara register" problem.)
2. Is folder ko GitHub repo me daalo (`.env` upload mat karna).
3. Render -> New -> **Blueprint** (ya Web Service, Runtime = Docker) -> repo select.
4. Environment variables:

| Name | Value |
|---|---|
| `DATABASE_URL` | Neon wala URL |
| `HR_INVITE_CODE` | apna secret code |
| `SECRET_KEY` | auto (render.yaml) ya 32+ random chars |
| `COOKIE_SECURE` | `true` |
| `BOOTSTRAP_HR_EMAIL` / `BOOTSTRAP_HR_PASSWORD` | optional: HR admin har start par auto-ban jata hai (password 8+ chars) |

5. Deploy ke baad `https://<app>.onrender.com` kholo.

**Memory note:** `shap` + scikit-learn bhari hain. Render free (512 MB) par "out of memory" aaye to plan `starter` karo,
ya Hugging Face Spaces (Docker, free, 16 GB RAM) use karo — `Dockerfile` waise hi chalega, bas port 7860 set karo (`PORT=7860`).

## Dhyan rakhne wali baatein
- Dataset IBM ka sample hai; employee names fictional hain (HR_ACTION_CENTER_SETUP.txt wala notice lagu).
- Action Center ka "Mark reviewed" status ab database me hai (saare HR users ko same dikhta hai). Purane browser wale statuses pehli baar load par apne-aap database me chale jate hain.
- Prediction history abhi bhi browser me save hoti hai.
- Rate-limit memory me hai (ek server process ke liye). Real production me Redis/WAF better hai.
- Password reset / email verification nahi hai; chaho to baad me add kar sakte hain.
