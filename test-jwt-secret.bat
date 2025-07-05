@echo off
echo Testing JWT Secret Configuration
echo.

echo Checking JWT secret length...
docker-compose -f docker-compose.prod.yml exec backend printenv JWT_SECRET > temp_secret.txt
for /f %%i in ('powershell -command "Get-Content temp_secret.txt | Measure-Object -Character | Select-Object -ExpandProperty Characters"') do set secret_length=%%i
del temp_secret.txt

echo JWT Secret Length: %secret_length% characters (%secret_length%*8 bits)
echo.

if %secret_length% GEQ 32 (
    echo ✅ JWT Secret is secure (≥256 bits required)
) else (
    echo ❌ JWT Secret is too short (need ≥32 characters)
    echo Run generate-jwt-secret.bat to create a secure secret
    goto end
)

echo.
echo Testing JWT functionality...
echo Attempting to validate a token...

curl -X POST http://localhost:8080/api/auth/validate ^
  -H "Content-Type: application/json" ^
  -d "{\"token\":\"dummy-token\"}" ^
  -w "HTTP Status: %%{http_code}\n" ^
  -o temp_response.txt

echo.
echo Response:
type temp_response.txt
del temp_response.txt

echo.
echo JWT Secret test complete!

:end
pause 