import axios, { AxiosResponse } from 'axios';
import { ApiResponseVoid } from '../types/api';

// create an instance of axios
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
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
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        const isDeleteRequest = response.config.method?.toLowerCase() === 'delete';
        const hasEmptyData = response.data === null || response.data === undefined || response.data === '';

        if (isDeleteRequest && hasEmptyData) {
            const standardResponse: ApiResponseVoid = {
                success: true,
                message: 'Operation completed successfully',
                data: {},
                timeStamp: new Date().toISOString()
            };

            return {
                ...response,
                data: standardResponse
            };
        }

        return response.data;
    },
    (error) => {
        console.error('API Error:', error);

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        if (error.config?.method?.toLowerCase() === 'delete') {
            console.error('DELETE request failed:', {
                url: error.config.url,
                status: error.response?.status,
                data: error.response?.data
            });
        }

        return Promise.reject(error);
    }
);

export default api;