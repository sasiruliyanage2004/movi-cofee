@echo off
title Kaduwela Coffee Shop - Development Server
color 0F

echo ========================================================
echo    [SHOP NAME] - Kaduwela, Sri Lanka
echo    Premium Specialty Coffee & Cafe Web Application
echo ========================================================
echo.

:: Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b
)

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing packages...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b
    )
)

echo [INFO] Starting Next.js Development Server...
echo [INFO] Website will be available at: http://localhost:3000
echo.

:: Automatically open browser after 2 seconds in the background
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Start the Next.js development server
call npm run dev

pause
