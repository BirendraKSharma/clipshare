@echo off
REM ClipShare Native Host Installer for Windows
REM This script installs the native messaging host for ClipShare extension

echo.
echo ============================================
echo   ClipShare Native Host Installer
echo ============================================
echo.

REM Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/5] Python detected
echo.

REM Install dependencies
echo [2/5] Installing Python dependencies...
python -m pip install --upgrade pip
python -m pip install pyperclip
echo.

REM Get script directory
set SCRIPT_DIR=%~dp0
set HOST_PATH=%SCRIPT_DIR%clipshare_host.bat

REM Get extension ID from user
echo [3/5] Extension ID Setup
echo.
echo Please install the ClipShare extension in Chrome first.
echo Then go to chrome://extensions/, enable Developer Mode,
echo and copy the Extension ID.
echo.
set /p EXTENSION_ID="Enter your ClipShare Extension ID: "

if "%EXTENSION_ID%"=="" (
    echo ERROR: Extension ID cannot be empty
    pause
    exit /b 1
)

echo.
echo [4/5] Creating native messaging host manifest...

REM Create manifest with actual paths
set MANIFEST_FILE=%SCRIPT_DIR%com.clipshare.host.json
(
echo {
echo   "name": "com.clipshare.host",
echo   "description": "ClipShare native messaging host",
echo   "path": "%HOST_PATH:\=\\%",
echo   "type": "stdio",
echo   "allowed_origins": [
echo     "chrome-extension://%EXTENSION_ID%/"
echo   ]
echo }
) > "%MANIFEST_FILE%"

echo.
echo [5/5] Registering native messaging host with Chrome...

REM Register with Chrome
set REG_KEY=HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\com.clipshare.host
reg add "%REG_KEY%" /ve /t REG_SZ /d "%MANIFEST_FILE%" /f

if errorlevel 1 (
    echo ERROR: Failed to register native messaging host
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Installation Complete!
echo ============================================
echo.
echo The ClipShare native host has been installed.
echo You can now use the extension to start the server.
echo.
echo Files installed:
echo   - Python host: %HOST_PATH%
echo   - Manifest: %MANIFEST_FILE%
echo.
pause
