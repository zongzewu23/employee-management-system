@echo off
title Docker Resource Cleanup Tool
color 0A

echo ========================================
echo    DOCKER RESOURCE CLEANUP TOOL
echo ========================================
echo.

echo [INFO] Current Docker resource usage:
echo ----------------------------------------
docker system df
echo.

echo [STEP 1] Stopping EMS services...
docker-compose down
if %errorlevel% equ 0 (
    echo [SUCCESS] EMS services stopped
) else (
    echo [WARNING] No docker-compose.yml found or services already stopped
)
echo.

echo [STEP 2] Removing stopped containers...
docker container prune -f
echo [SUCCESS] Stopped containers removed
echo.

echo [STEP 3] Removing dangling images...
docker image prune -f
echo [SUCCESS] Dangling images removed
echo.

echo [STEP 4] Removing unused networks...
docker network prune -f
echo [SUCCESS] Unused networks removed
echo.

echo [STEP 5] Volume cleanup (optional)
echo WARNING: This will remove anonymous volumes (e.g., frontend node_modules cache)
echo PostgreSQL data volume will be preserved.
echo.
set /p CLEANUP_VOLUMES="Do you want to remove unused volumes? [y/N]: "
if /i "%CLEANUP_VOLUMES%"=="y" (
    echo [INFO] Removing unused volumes...
    docker volume prune -f
    echo [SUCCESS] Unused volumes removed
) else (
    echo [INFO] Volumes preserved
)
echo.

echo ========================================
echo              CLEANUP COMPLETE
echo ========================================
echo.

echo [RESULT] Updated resource usage:
echo ----------------------------------------
docker system df
echo.

echo [INFO] Remaining containers:
docker ps -a
echo.

echo [INFO] Available images:
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo.

echo ========================================
echo Script execution completed successfully!
echo Press any key to exit...
echo ========================================
pause >nul