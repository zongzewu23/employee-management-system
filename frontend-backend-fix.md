# Frontend-Backend Connection Fix Guide

## Issue Summary
The frontend was unable to connect to the backend because the API configuration was using relative URLs (`/api`) which were designed for nginx proxy setup, but in development mode, the React app runs on port 3000 and needs to directly access the backend on port 8080.

## Root Cause
- **Development Setup**: React app runs on port 3000, backend on port 8080
- **API Configuration**: Frontend was using relative URL `/api` which resolves to `http://localhost:3000/api`
- **Expected URL**: Frontend should connect to `http://localhost:8080/api`

## Solution Implemented

### 1. Environment-Aware API Configuration
Updated `frontend/src/utils/api.ts` to detect the environment and use the appropriate base URL:

```typescript
// Environment-aware API base URL configuration
const getBaseURL = () => {
  // Check if we're in development mode with React development server
  if (process.env.NODE_ENV === 'development' && window.location.port === '3000') {
    // Development mode: React app on port 3000, backend on port 8080
    return 'http://localhost:8080/api';
  }
  // Production mode: nginx proxy setup
  return '/api';
};
```

### 2. Enhanced Debugging
Added comprehensive logging to help debug API issues:
- API configuration logging
- Request/response logging
- Error logging with detailed information

### 3. API Test Utilities
Created `frontend/src/utils/apiTest.ts` with test functions available in browser console:
- `testAPI.testConnection()` - Test basic API connectivity
- `testAPI.testAuth()` - Test authentication endpoint
- `testAPI.runAll()` - Run all tests

## Testing Instructions

### Step 1: Restart Development Environment
```powershell
# Clean and restart
.\start.ps1 clean
.\start.ps1 dev
```

### Step 2: Check Console Logs
Open browser console at `http://localhost:3000` and look for:
```
🔧 Development mode detected: Using direct backend URL
🌐 API Configuration: { baseURL: "http://localhost:8080/api", ... }
```

### Step 3: Test API Connection
In browser console, run:
```javascript
// Test basic connectivity
testAPI.testConnection()

// Test authentication endpoint
testAPI.testAuth()

// Run all tests
testAPI.runAll()
```

### Step 4: Test Authentication
1. Go to `http://localhost:3000`
2. Try logging in with valid credentials
3. Check browser console for API requests and responses
4. Look for successful authentication

### Step 5: Test Employee Management
1. After successful login, test all features:
   - View departments
   - Create/edit/delete departments
   - View employees
   - Create/edit/delete employees

## Expected Console Output

### Successful API Configuration:
```
🔧 Development mode detected: Using direct backend URL
🌐 API Configuration: {
  baseURL: "http://localhost:8080/api",
  environment: "development",
  port: "3000",
  host: "localhost:3000"
}
```

### Successful API Request:
```
🔄 API Request: POST /auth/login {
  baseURL: "http://localhost:8080/api",
  fullURL: "http://localhost:8080/api/auth/login",
  headers: {...}
}
✅ API Response: 200 {
  url: "/auth/login",
  data: { success: true, data: {...} }
}
```

### Successful Authentication:
```
✅ Login successful
✅ Token stored in localStorage
✅ User data loaded
```

## Troubleshooting

### Issue: Still getting 404 errors
**Check:**
1. Backend container is running: `docker ps`
2. Backend logs: `docker-compose -f docker-compose.dev.yml logs backend`
3. API base URL in console: Should be `http://localhost:8080/api`

### Issue: CORS errors
**Solution:**
```powershell
# Backend CORS is configured to allow localhost:3000
# Check backend logs for CORS configuration message
docker-compose -f docker-compose.dev.yml logs backend | grep -i cors
```

### Issue: Network connectivity
**Test:**
```powershell
# Test backend directly
curl http://localhost:8080/api/departments

# Test from browser console
fetch('http://localhost:8080/api/departments')
```

### Issue: Authentication failing
**Debug:**
1. Check browser console for API requests
2. Check browser network tab for request/response details
3. Use test utilities: `testAPI.testAuth()`

## Environment Modes

### Development Mode (Current)
- **Frontend**: React dev server on port 3000
- **Backend**: Spring Boot on port 8080
- **API Calls**: Direct to `http://localhost:8080/api`
- **CORS**: Enabled for localhost:3000

### Production Mode (nginx proxy)
- **Frontend**: nginx on port 80
- **Backend**: Spring Boot on port 8080 (internal)
- **API Calls**: Proxy through nginx `/api`
- **CORS**: Handled by nginx

## Verification Checklist

### ✅ API Configuration
- [ ] Console shows "Development mode detected"
- [ ] Base URL is `http://localhost:8080/api`
- [ ] Environment is "development"
- [ ] Port is "3000"

### ✅ API Connectivity
- [ ] `testAPI.testConnection()` passes
- [ ] `testAPI.testAuth()` passes
- [ ] Backend responds to requests

### ✅ Authentication
- [ ] Login form submits successfully
- [ ] Token is stored in localStorage
- [ ] User data is loaded
- [ ] Redirected to dashboard after login

### ✅ Employee Management
- [ ] Departments list loads
- [ ] Can create/edit/delete departments
- [ ] Employees list loads
- [ ] Can create/edit/delete employees
- [ ] All CRUD operations work

## Success Indicators

### Browser Console:
```
✅ API Configuration loaded
✅ API tests passed
✅ Authentication successful
✅ User data loaded
```

### Network Tab:
```
✅ POST http://localhost:8080/api/auth/login - 200 OK
✅ GET http://localhost:8080/api/departments - 200 OK
✅ GET http://localhost:8080/api/employees - 200 OK
```

### Application Behavior:
```
✅ Login form works
✅ Dashboard loads after login
✅ All features accessible
✅ No console errors
```

## Important Notes

1. **Environment Detection**: The fix automatically detects development vs production mode
2. **No Configuration Needed**: Works out of the box with existing setup
3. **Debugging Enhanced**: Comprehensive logging for troubleshooting
4. **Test Utilities**: Built-in tools for testing API connectivity
5. **Backward Compatible**: Still works with nginx proxy in production

## Next Steps After Fix

1. **Test thoroughly** using the instructions above
2. **Monitor console logs** for any issues
3. **Use test utilities** if problems occur
4. **Check network tab** for failed requests
5. **Verify all features** work end-to-end

The fix should resolve the 404 errors and enable full frontend-backend communication in development mode while maintaining compatibility with the nginx proxy setup for production. 