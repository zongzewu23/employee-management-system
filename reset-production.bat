@echo off
echo Resetting Employee Management System - Production Environment
echo.
echo WARNING: This will delete all data in the database!
echo.
pause

echo Stopping all containers...
docker-compose -f docker-compose.prod.yml down

echo Removing volumes (this deletes all data)...
docker-compose -f docker-compose.prod.yml down -v

echo Removing any orphaned containers...
docker container prune -f

echo Starting fresh production environment...
docker-compose -f docker-compose.prod.yml up --build

echo.
echo Production environment reset and started!
echo Access the application at: http://localhost
echo. 