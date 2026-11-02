@echo off
title HR Analytics - Local Server
cd /d "%~dp0backend"
echo Installing requirements (first time takes a few minutes)...
python -m pip install -r requirements.txt
echo.
echo Server starting... browser will open at http://127.0.0.1:8000
start "" http://127.0.0.1:8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000
pause
