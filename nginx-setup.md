# Nginx Setup Guide for Employee Management System

## Overview
This guide configures nginx as a reverse proxy for your Employee Management System, serving the React frontend and proxying API requests to the Spring Boot backend.

## Files Created/Modified

### New Files:
- `frontend/nginx.conf` - Main nginx configuration
- `frontend/Dockerfile.dev` - Development Dockerfile with hot reload
- `docker-compose.dev.yml` - Development setup with hot reload

### Modified Files:
- `frontend/Dockerfile` - Updated to use nginx multi-stage build
- `docker-compose.yml` - Updated for nginx proxy setup
- `frontend/src/utils/api.ts` - Updated API base URL for nginx proxy

## Setup Instructions

### Step 1: Prepare Environment
```powershell
# Create .env file if it doesn't exist
echo "POSTGRES_PASSWORD=your_password_here" > .env
echo "SPRING_DATASOURCE_PASSWORD=your_password_here" >> .env
```

### Step 2: Build and Run with Nginx (Production Mode)
```powershell
# Stop any existing containers
docker-compose down -v

# Build and start with nginx
docker-compose up --build
```

### Step 3: Test the Setup
```powershell
# Test frontend accessibility
curl http://localhost

# Test API proxy
curl http://localhost/api/departments
```

## Development vs Production Modes

### Development Mode (Hot Reload)
Use this for active development with live reload:
```powershell
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Frontend will be available at:
# - http://localhost:3000 (React dev server)
# - Backend available at: http://localhost:8080
```

### Production Mode (Nginx)
Use this to test nginx configuration:
```powershell
# Start production-like environment
docker-compose up --build

# Frontend will be available at:
# - http://localhost (nginx serving React build)
# - API available at: http://localhost/api/*
```

## Testing Commands

### 1. Basic Connectivity Tests
```powershell
# Test frontend is accessible
curl http://localhost
# Expected: HTML content of React app

# Test API proxy
curl http://localhost/api/departments
# Expected: JSON response from backend API
```

### 2. API Proxy Tests
```powershell
# Test departments endpoint (may require authentication)
curl -X GET http://localhost/api/departments

# Test with verbose output to see headers
curl -v http://localhost/api/departments
```

### 3. CORS Tests
```powershell
# Test preflight request
curl -X OPTIONS http://localhost/api/departments ^
  -H "Origin: http://localhost" ^
  -H "Access-Control-Request-Method: GET" ^
  -H "Access-Control-Request-Headers: Content-Type"
```

### 4. Static Asset Tests
```powershell
# Test static assets caching
curl -I http://localhost/static/css/main.css
# Expected: Cache-Control headers present
```

## Verification Checklist

### ✅ Frontend Verification
- [ ] React app loads at `http://localhost`
- [ ] All pages are accessible (no 404 errors)
- [ ] React Router works (refresh on any route works)
- [ ] Static assets load correctly
- [ ] No console errors in browser

### ✅ API Proxy Verification
- [ ] API calls work from frontend
- [ ] `/api/departments` endpoint responds
- [ ] Authentication flows work
- [ ] CORS errors are resolved
- [ ] API responses are correct

### ✅ Performance Verification
- [ ] Static assets are cached
- [ ] Gzip compression is working
- [ ] Response times are acceptable
- [ ] No memory leaks in containers

## Container Management

### View Container Status
```powershell
# Check container status
docker ps

# View logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs postgres
```

### Restart Specific Service
```powershell
# Restart frontend only
docker-compose restart frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Clean Rebuild
```powershell
# Stop and remove everything
docker-compose down -v --remove-orphans

# Remove unused images
docker system prune -f

# Rebuild everything
docker-compose up --build
```

## Troubleshooting Guide

### Problem: Frontend shows "502 Bad Gateway"
**Solution:**
```powershell
# Check if backend is running
docker-compose logs backend

# Check if backend is accessible
curl http://localhost/api/departments
```

### Problem: API calls return 404
**Solution:**
```powershell
# Verify nginx configuration
docker exec employee-frontend nginx -t

# Check if backend is accessible from nginx
docker exec employee-frontend curl http://backend:8080/api/departments
```

### Problem: CORS errors still occur
**Solution:**
```powershell
# Verify CORS headers are present
curl -v http://localhost/api/departments

# Check nginx configuration
docker exec employee-frontend cat /etc/nginx/conf.d/default.conf
```

### Problem: Static assets not loading
**Solution:**
```powershell
# Check if React build exists
docker exec employee-frontend ls -la /usr/share/nginx/html/

# Verify nginx is serving static files
curl -I http://localhost/static/js/main.js
```

### Problem: React Router not working (404 on refresh)
**Solution:**
```powershell
# Check nginx configuration for try_files
docker exec employee-frontend grep -n "try_files" /etc/nginx/conf.d/default.conf
```

## Performance Optimization

### Monitor Resource Usage
```powershell
# Check container resource usage
docker stats

# Check nginx access logs
docker-compose logs frontend | grep -E "(GET|POST|PUT|DELETE)"
```

### Optimize for Production
```powershell
# Enable production optimizations in React
echo "GENERATE_SOURCEMAP=false" >> frontend/.env
echo "REACT_APP_ENV=production" >> frontend/.env
```

## Development Workflow

### Making Frontend Changes
1. For development with hot reload:
   ```powershell
   docker-compose -f docker-compose.dev.yml up
   ```

2. For testing nginx configuration:
   ```powershell
   docker-compose up --build frontend
   ```

### Making Backend Changes
```powershell
# Backend changes require restart
docker-compose restart backend
```

### Making Nginx Changes
```powershell
# Nginx changes require frontend rebuild
docker-compose up --build frontend
```

## Security Considerations

### Current Security Headers
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`

### Additional Security (for production)
Consider adding:
- Rate limiting
- SSL/TLS termination
- Request size limits
- IP whitelisting

## Next Steps

1. **Test the setup thoroughly** using the commands above
2. **Monitor logs** for any errors during startup
3. **Verify frontend functionality** by testing all pages
4. **Test API integration** by performing CRUD operations
5. **Consider production optimizations** when ready to deploy

## Support

If you encounter issues:
1. Check container logs: `docker-compose logs [service_name]`
2. Verify container status: `docker ps`
3. Test individual components: Use the testing commands above
4. Check nginx configuration: `docker exec employee-frontend nginx -t` 