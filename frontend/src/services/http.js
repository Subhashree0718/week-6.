import axios from 'axios';
import { config } from '../config/env';
import { storage } from '../utils/storage';

const http = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response) => {
    // Backend returns { success, message, data }
    // Return just the data field
    return response.data.data !== undefined ? response.data.data : response.data;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        storage.clear();
        window.location.href = '/login';
      }
      
      // Return error with validation details if available
      const message = error.response.data?.message || 'An error occurred';
      const validationErrors = error.response.data?.errors || [];
      
      // Create a custom error with validation details
      const customError = new Error(message);
      customError.validationErrors = validationErrors;
      customError.statusCode = error.response.status;
      
      return Promise.reject(customError);
    }
    
    // Network error
    return Promise.reject(new Error('Network error. Please check your connection.'));
  }
);

export default http;
