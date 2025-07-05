@echo off
echo Employee Management System - Safe Production Startup
echo.

echo Checking for existing volumes...
docker volume ls | findstr ems_postgres_data > nul
if %errorlevel% == 0 (
    echo.
    echo WARNING: Existing database volume found!
    echo This may cause authentication issues if the volume was created with different settings.
    echo.
    echo Options:
    echo 1. Try to start with existing data ^(may fail^)
    echo 2. Reset and delete all data ^(recommended for first setup^)
    echo.
    set /p choice="Enter your choice (1 or 2): "
    
    if "!choice!"=="2" (
        echo Resetting database...
        docker-compose -f docker-compose.prod.yml down -v
        echo Database reset complete.
        echo.
    )
)

echo Starting production environment...
docker-compose -f docker-compose.prod.yml up --build

echo.
echo Production environment started!
echo Access the application at: http://localhost
echo. 