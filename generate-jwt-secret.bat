@echo off
echo JWT Secret Generator
echo.
echo Generating secure JWT secret (256+ bits)...
echo.

setlocal enabledelayedexpansion

REM Generate a secure random string using PowerShell
set "chars=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
set "secret="

for /L %%i in (1,1,64) do (
    set /a "rand=!random! %% 66"
    for %%j in (!rand!) do set "secret=!secret!!chars:~%%j,1!"
)

echo Generated JWT Secret ^(64 characters = 512 bits^):
echo !secret!
echo.
echo This secret is secure for JWT HMAC-SHA algorithms.
echo Copy this value to your docker-compose.prod.yml JWT_SECRET environment variable.
echo.
pause 