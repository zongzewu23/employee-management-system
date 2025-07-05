// API Connection Test Utility
// This file can be used to test the API connection from the browser console

import api from './api';

export const testAPIConnection = async (): Promise<void> => {
  console.log('🧪 Testing API Connection...');
  
  try {
    // Test basic connectivity
    console.log('1. Testing basic API connectivity...');
    const response = await fetch(api.defaults.baseURL + '/departments');
    console.log('✅ Basic fetch test:', response.status, response.statusText);
    
    // Test with axios (should handle CORS properly)
    console.log('2. Testing axios request...');
    const axiosResponse = await api.get('/departments');
    console.log('✅ Axios test successful:', axiosResponse);
    
    return Promise.resolve();
  } catch (error: any) {
    console.error('❌ API Connection Test Failed:', error);
    
    // Provide helpful debugging information
    console.group('🔍 Debugging Information');
    console.log('API Base URL:', api.defaults.baseURL);
    console.log('Current Location:', window.location.href);
    console.log('Error Details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    console.groupEnd();
    
    return Promise.reject(error);
  }
};

// Test authentication endpoint
export const testAuthEndpoint = async (): Promise<void> => {
  console.log('🔐 Testing Authentication Endpoint...');
  
  try {
    // Test with dummy credentials to see if endpoint is reachable
    const response = await api.post('/auth/login', {
      username: 'test',
      password: 'test'
    });
    
    console.log('✅ Auth endpoint is reachable (even if credentials are wrong)', response);
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 400) {
      console.log('✅ Auth endpoint is reachable (returned expected error for invalid credentials)');
    } else {
      console.error('❌ Auth endpoint test failed:', error);
      throw error;
    }
  }
};

// Run all tests
export const runAllTests = async (): Promise<void> => {
  console.log('🚀 Running API Tests...');
  
  try {
    await testAPIConnection();
    await testAuthEndpoint();
    console.log('✅ All API tests passed!');
  } catch (error) {
    console.error('❌ API tests failed:', error);
  }
};

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).testAPI = {
    testConnection: testAPIConnection,
    testAuth: testAuthEndpoint,
    runAll: runAllTests
  };
  
  console.log('🛠️  API Test utilities available in console:');
  console.log('  - testAPI.testConnection()');
  console.log('  - testAPI.testAuth()');
  console.log('  - testAPI.runAll()');
} 