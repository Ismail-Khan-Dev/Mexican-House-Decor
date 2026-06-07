@echo off
REM Mexican Home Decor Backend - Setup Script (Windows)
REM This script sets up the backend environment and verifies all dependencies

echo.
echo 🚀 Mexican Home Decor Backend Setup
echo ====================================
echo.

REM Check Node.js
echo 📋 Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% installed
echo.

REM Check npm
echo 📋 Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% installed
echo.

REM Create .env file if it doesn't exist
echo 📝 Setting up environment variables...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from .env.example
    echo ⚠️  IMPORTANT: Update JWT_SECRET in .env (must be 32+ characters)
) else (
    echo ℹ️  .env file already exists
)
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully
echo.

REM Create logs directory
echo 📁 Creating logs directory...
if not exist logs mkdir logs
echo ✅ Logs directory ready
echo.

REM Configuration Check
echo 🔐 Configuration Check
echo =====================
findstr /M "your_super_secret" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  WARNING: JWT_SECRET needs to be updated!
    echo    Please change the JWT_SECRET in .env to a random 32+ character string
)

findstr /M "localhost" .env >nul
if %ERRORLEVEL% EQU 0 (
    echo ℹ️  Using local MongoDB - make sure it's running
)
echo.

REM Ready to start
echo ✅ Setup Complete!
echo.
echo 🎯 Next Steps:
echo 1. Update .env file with your settings
echo 2. Ensure MongoDB is running
echo 3. Seed database: node src\seed.js
echo 4. Start server: npm run dev
echo.
echo 📚 Documentation: See README.md and API_DOCUMENTATION.md
echo.
pause
