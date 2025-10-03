@echo off
REM ClipShare Native Host Uninstaller for Windows

echo.
echo ============================================
echo   ClipShare Native Host Uninstaller
echo ============================================
echo.

echo Removing registry entry...
reg delete "HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\com.clipshare.host" /f

echo.
echo Uninstallation complete!
echo.
echo Note: This script does not delete the files.
echo You can manually delete the clipshare folder if needed.
echo.
pause
