@echo off
echo Employee Management System - Production Debug
echo.

echo ===== ENVIRONMENT VARIABLES =====
echo Checking backend environment variables...
docker-compose -f docker-compose.prod.yml exec backend printenv | findstr SPRING_DATASOURCE
echo.

echo ===== SERVICE STATUS =====
echo Checking service status...
docker-compose -f docker-compose.prod.yml ps
echo.

echo ===== POSTGRES HEALTH =====
echo Testing PostgreSQL connection...
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U postgres -d employee_db
echo.

echo ===== BACKEND LOGS (LAST 50 LINES) =====
echo Backend startup logs...
docker-compose -f docker-compose.prod.yml logs --tail=50 backend
echo.

echo ===== POSTGRES LOGS (LAST 20 LINES) =====
echo PostgreSQL logs...
docker-compose -f docker-compose.prod.yml logs --tail=20 postgres
echo.

echo ===== NETWORK TEST =====
echo Testing network connectivity...
docker-compose -f docker-compose.prod.yml exec backend ping -c 3 postgres
echo.

echo ===== PASSWORD VERIFICATION =====
echo Verifying database password...
echo Expected password: password123
echo Postgres container password: 
docker-compose -f docker-compose.prod.yml exec postgres printenv POSTGRES_PASSWORD
echo Backend datasource password:
docker-compose -f docker-compose.prod.yml exec backend printenv SPRING_DATASOURCE_PASSWORD
echo.

echo Debug complete! Check the output above for any mismatches. 