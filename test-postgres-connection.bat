@echo off
echo Testing PostgreSQL Connection
echo.

echo Waiting for PostgreSQL to be ready...
ping -n 11 127.0.0.1 > nul

echo Testing connection with psql...
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres -d employee_db -c "SELECT 1 as test_connection;"

echo.
echo Testing connection details...
echo Expected: username=postgres, password=password123, database=employee_db
echo.

echo Testing from outside container...
set PGPASSWORD=password123
docker run --rm --network ems_default -e PGPASSWORD=password123 postgres:15 psql -h postgres -U postgres -d employee_db -c "SELECT 1 as test_connection;"

echo.
echo Connection test complete! 