@echo off
echo Starting Employee Management System - Production Environment
echo.

echo Stopping any existing containers...
docker-compose -f docker-compose.prod.yml down

echo Building and starting production environment...
echo This may take a few minutes with health checks...
docker-compose -f docker-compose.prod.yml up --build

echo.
echo Production environment started!
echo Access the application at: http://localhost
echo. 