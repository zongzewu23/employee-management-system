# Employee Management System - Production Setup

## Quick Start

### 1. Start Production Environment

**IMPORTANT**: If you're having authentication issues or this is your first setup:

```bash
# Safe startup (checks for existing volumes)
start-production-safe.bat

# Or reset everything (deletes all data)
reset-production.bat
```

**For normal startup**:
```bash
# Using the batch script (Windows)
start-production.bat

# Or manually
docker-compose -f docker-compose.prod.yml up --build
```

**Note**: First startup may take 2-3 minutes due to health checks ensuring proper service initialization.

### 2. Access Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Direct Backend**: http://localhost:8080 (for debugging)

## Architecture

```
User → nginx (port 80) → React frontend (static files)
                     → /api/* requests → backend (port 8080)
```

## Services

- **nginx**: Serves React app + API proxy on port 80
- **backend**: Spring Boot API on port 8080
- **postgres**: Database on port 5432

## Testing

### Quick Health Check
```bash
# Use the test script
test-health.bat

# Test JWT secret configuration
test-jwt-secret.bat

# Or manually test each service:
```

### 1. Frontend Test
```bash
curl http://localhost
```
Should return React app HTML.

### 2. API Proxy Test
```bash
curl http://localhost/api/auth/health
```
Should return backend health status.

### 3. Direct Backend Test
```bash
curl http://localhost:8080/api/auth/health
```
Should return same as above.

### 4. React Router Test
- Navigate to http://localhost/dashboard
- Refresh page
- Should still show dashboard (not 404)

## Default Credentials

- **Database**: postgres/password123
- **JWT Secret**: 80-character secure key (256+ bits for HMAC-SHA algorithms)

## Security Notes

**JWT Secret**: The production setup uses a secure 80-character JWT secret that meets RFC 7518 requirements:
- **Minimum**: 256 bits (32 characters) for HMAC-SHA algorithms
- **Production**: 80 characters (640 bits) for enhanced security
- **Generate New**: Use `generate-jwt-secret.bat` to create unique secrets

## Files Created

- `docker-compose.prod.yml` - Production services with health checks
- `frontend/Dockerfile.prod` - Frontend build + nginx
- `frontend/nginx.conf` - Nginx configuration
- `start-production.bat` - Quick start script
- `start-production-safe.bat` - Safe startup with volume checking
- `reset-production.bat` - Reset script (deletes all data)
- `test-health.bat` - Health check testing script
- `test-postgres-connection.bat` - Database connection testing script
- `debug-production.bat` - Comprehensive debugging script
- `generate-jwt-secret.bat` - Secure JWT secret generator
- `test-jwt-secret.bat` - JWT secret validation and testing script

## Troubleshooting

### Common Issues

**Database Authentication Errors**: If you see `password authentication failed`:
1. **Root Cause**: PostgreSQL 15 defaults to `scram-sha-256` authentication, but existing volumes may have wrong settings
2. **Quick Fix**: Run `reset-production.bat` to delete existing volumes and start fresh
3. **Safe Fix**: Run `start-production-safe.bat` which checks for volume conflicts
4. **Manual Fix**: Stop containers, run `docker-compose -f docker-compose.prod.yml down -v`, then restart

**Backend Container Restarting**: This usually means database authentication is failing. Use the reset script.

**JWT Secret Too Short Error**: If you see "specified key byte array is 72 bits which is not secure enough":
1. **Cause**: JWT secret must be at least 256 bits (32 characters) for HMAC-SHA algorithms
2. **Fix**: The production setup uses an 80-character secure key by default
3. **Generate New**: Run `generate-jwt-secret.bat` to create a new secure secret

**Slow Startup**: Health checks ensure proper initialization. First startup takes 2-3 minutes.

### Comprehensive Debugging
```bash
# Full diagnostic report
debug-production.bat

# Test database connection specifically
test-postgres-connection.bat
```

### Container Logs
```bash
docker-compose -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs postgres
```

### Reset Everything
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up --build
```

### Port Conflicts
If port 80 is in use, modify `docker-compose.prod.yml`:
```yaml
nginx:
  ports:
    - "8000:80"  # Use port 8000 instead
```

## Login Credentials

Use the same credentials as development:
- Register a new account, or
- Use any existing account from your development setup

The database will be fresh on first run. 