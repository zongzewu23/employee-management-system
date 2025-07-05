@echo off
echo Testing Health Checks - Production Environment
echo.

echo Testing PostgreSQL Health...
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U postgres -d employee_db
echo.

echo Testing Backend Health...
curl -f http://localhost:8080/api/auth/health || echo "Backend not ready"
echo.

echo Testing Nginx Health...
curl -f http://localhost/api/auth/health || echo "Nginx proxy not ready"
echo.

echo Testing Frontend...
curl -f http://localhost || echo "Frontend not ready"
echo.

echo Health check complete! 