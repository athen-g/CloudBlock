@echo off
setlocal
cd /d "%~dp0"
if exist ".venv\Scripts\python.exe" goto ready
where py >nul 2>nul
if errorlevel 1 goto python
py -3 -m venv .venv
goto install
:python
python -m venv .venv
:install
if not exist ".venv\Scripts\python.exe" (
 echo Install Python 3.10 or later, then try again.
 pause
 exit /b 1
)
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
 echo Dependency installation failed. Check your internet connection.
 pause
 exit /b 1
)
:ready
echo Open http://127.0.0.1:8765 in your browser after the server starts.
echo Press Ctrl+C here to stop the application.
".venv\Scripts\python.exe" app.py
pause
