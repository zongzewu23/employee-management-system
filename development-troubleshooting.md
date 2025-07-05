# Development Environment Troubleshooting Guide

## Quick Start Commands

### Start Development Environment
```powershell
.\start.ps1 dev
```

### Clean and Restart
```powershell
.\start.ps1 clean
.\start.ps1 dev
```

## Common Issues and Solutions

### 1. Backend Container Won't Start

#### Issue: "Unable to access jarfile" Error
**Cause**: Using wrong Dockerfile or configuration conflict
**Solution**: 
```powershell
# Clean everything and rebuild
.\start.ps1 clean
.\start.ps1 dev
```

#### Issue: Backend Takes Long Time to Start
**Cause**: Maven downloading dependencies
**Expected**: Backend may take 1-2 minutes on first run
**Solution**: Wait patiently, check logs:
```powershell
docker-compose -f docker-compose.dev.yml logs backend
```

### 2. Database Connection Issues

#### Issue: "Connection refused" to Database
**Solution**: 
```powershell
# Check if database is running
docker ps | grep postgres

# If not running, restart
docker-compose -f docker-compose.dev.yml restart postgres
```

#### Issue: Database Password Error
**Solution**: Check your `.env` file:
```powershell
# Make sure .env file has:
POSTGRES_PASSWORD=your_password_here
SPRING_DATASOURCE_PASSWORD=your_password_here
```

### 3. Frontend Issues

#### Issue: Frontend Not Loading
**Solution**: 
```powershell
# Check frontend container logs
docker-compose -f docker-compose.dev.yml logs frontend-dev

# Restart frontend only
docker-compose -f docker-compose.dev.yml restart frontend-dev
```

#### Issue: API Calls Failing
**Cause**: Backend not started or network issues
**Solution**: 
```powershell
# Test backend directly
curl http://localhost:8080/api/departments

# Check if backend is running
docker-compose -f docker-compose.dev.yml logs backend
```

### 4. Port Conflicts

#### Issue: "Port already in use"
**Solution**: 
```powershell
# Find what's using the port
netstat -ano | findstr :8080
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Kill the process or change ports in docker-compose.dev.yml
```

### 5. Development Workflow Issues

#### Issue: Code Changes Not Reflected
**Backend**: Spring Boot DevTools will automatically restart the application
**Frontend**: React development server has hot reload enabled
**Solution**: 
```powershell
# If changes not reflected, restart the specific service
docker-compose -f docker-compose.dev.yml restart backend
docker-compose -f docker-compose.dev.yml restart frontend-dev
```

## Container Status Monitoring

### Check All Containers
```powershell
docker ps
```

### Check Specific Container Logs
```powershell
# Backend logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Frontend logs
docker-compose -f docker-compose.dev.yml logs -f frontend-dev

# Database logs
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Monitor Container Resource Usage
```powershell
docker stats
```

## Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/*
- **Backend API Documentation**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:5432
- **Backend Debug Port**: localhost:5005

## Environment Variables

Make sure your `.env` file contains:
```
POSTGRES_PASSWORD=your_password_here
SPRING_DATASOURCE_PASSWORD=your_password_here
```

## Debugging Tips

### 1. Remote Debugging Backend
The backend exposes port 5005 for remote debugging:
- Connect your IDE to localhost:5005
- Set breakpoints in your Java code
- Debug step by step

### 2. Check Spring Boot Actuator Endpoints
```powershell
# Health check
curl http://localhost:8080/actuator/health

# Environment info
curl http://localhost:8080/actuator/env

# Metrics
curl http://localhost:8080/actuator/metrics
```

### 3. Database Connection Test
```powershell
# Connect to database directly
docker exec -it employee-db-dev psql -U postgres -d employee_db

# List tables
\dt

# Exit
\q
```

## Performance Optimization

### 1. Speed Up Container Startup
```powershell
# Remove unused Docker images
docker system prune -f

# Remove unused volumes
docker volume prune -f
```

### 2. Monitor Resource Usage
```powershell
# Check memory usage
docker stats --no-stream

# Check disk usage
docker system df
```

## Clean Environment

### Complete Clean
```powershell
# Stop all containers
docker-compose -f docker-compose.dev.yml down -v

# Remove all unused Docker resources
docker system prune -a -f

# Remove volumes
docker volume prune -f
```

### Selective Clean
```powershell
# Just restart backend
docker-compose -f docker-compose.dev.yml restart backend

# Rebuild specific service
docker-compose -f docker-compose.dev.yml up --build backend
```

## Getting Help

### Check Container Health
```powershell
# Inspect container
docker inspect employee-backend-dev

# Check container processes
docker exec -it employee-backend-dev ps aux

# Access container shell
docker exec -it employee-backend-dev /bin/bash
```

### Maven Commands in Container
```powershell
# Run Maven commands in container
docker exec -it employee-backend-dev ./mvnw clean compile
docker exec -it employee-backend-dev ./mvnw test
docker exec -it employee-backend-dev ./mvnw spring-boot:run
```

## Success Indicators

### Backend Started Successfully
You should see logs like:
```
Started EmployeeManagementSystemApplication in 45.678 seconds
Tomcat started on port(s): 8080 (http)
```

### Frontend Started Successfully
You should see logs like:
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

### Database Started Successfully
You should see logs like:
```
database system is ready to accept connections
```

## Emergency Reset

If nothing works, use the nuclear option:
```powershell
# Stop everything
docker stop $(docker ps -aq)

# Remove everything
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Remove all volumes
docker volume rm $(docker volume ls -q)

# Start fresh
.\start.ps1 dev
```

**Warning**: This will remove ALL Docker containers, images, and volumes on your system! 