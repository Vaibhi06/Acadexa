@echo off
setlocal enabledelayedexpansion
title Acadexa Portal - Startup

echo ================================================
echo    ACADEXA PORTAL - LAUNCHING ALL SERVERS
echo ================================================
echo.

REM ── Kill anything already on ports 5000 / 5173 ──────────────────────────────
echo [1/4] Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 " ^| findstr "LISTENING" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 " ^| findstr "LISTENING" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo    Done.
echo.

REM ── MySQL / XAMPP check ──────────────────────────────────────────────────────
echo [2/4] Checking MySQL (XAMPP)...
netstat -ano | findstr ":3306 " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    MySQL is already running.  OK!
) else (
    echo.
    echo    !! MySQL is NOT running !!
    echo    Opening XAMPP Control Panel — please click START next to MySQL.
    if exist "C:\xampp\xampp-control.exe" (
        start "" "C:\xampp\xampp-control.exe"
    ) else (
        echo    XAMPP not found at C:\xampp — please start MySQL manually.
    )
    echo.
    echo    Once MySQL is green in XAMPP, press any key to continue...
    pause >nul
)
echo.

REM ── Start Backend ────────────────────────────────────────────────────────────
echo [3/4] Starting Backend (port 5000)...
cd /d "%~dp0server"
start "BACKEND - Acadexa" cmd /k "title BACKEND && color 0A && echo === Backend Server === && npm run dev"
echo    Waiting 6 seconds for backend to initialise...
timeout /t 6 /nobreak >nul

REM Quick health-check
powershell -Command "try { $r = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -TimeoutSec 3; Write-Host '   Backend is UP!' } catch { Write-Host '   Backend still starting (this is normal)...' }"
echo.

REM ── Start Frontend ───────────────────────────────────────────────────────────
echo [4/4] Starting Frontend (port 5173)...
cd /d "%~dp0client"
start "FRONTEND - Acadexa" cmd /k "title FRONTEND && color 0B && echo === Frontend Server === && npm run dev"
echo    Waiting 5 seconds for frontend to initialise...
timeout /t 5 /nobreak >nul
echo.

REM ── Open browser ────────────────────────────────────────────────────────────
echo ================================================
echo    ALL SERVERS STARTED!
echo    Backend  : http://localhost:5000
echo    Frontend : http://localhost:5173
echo ================================================
echo.
echo    Opening browser...
start http://localhost:5173
echo.
echo    Keep the two coloured terminal windows open.
echo    Green  = Backend   (port 5000)
echo    Cyan   = Frontend  (port 5173)
echo.
pause
