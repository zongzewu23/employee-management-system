import axios from 'axios';

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

// create an instance of axios
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error)=> {
    return Promise.reject(error);
  }
);

// response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error)=> {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;