import axios from 'axios';

// API endpoints configuration
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  USER: {
    SAVE_PROFILE: '/user/profile',
    GET_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    DELETE_PROFILE: '/user/profile',
    LOGOUT: '/user/logout',
  },
  INTERVIEW: {
    CREATE: '/interview',
    GET_ALL: '/interview',
    GET_BY_ID: '/interview/:id',
    UPDATE: '/interview/:id',
    DELETE: '/interview/:id',
  },
  PDF: {
    UPLOAD: '/pdf/upload',
  },
};

// Global token refresh function reference
let getTokenFunction = null;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the token refresh function
export const setTokenRefreshFunction = getToken => {
  getTokenFunction = getToken;
};

// Function to set auth token (will be called from components)
export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.defaults.headers.common['x-clerk-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['x-clerk-auth-token'];
  }
};

// Request interceptor - Get fresh token before each request
api.interceptors.request.use(
  async config => {
    // Skip authentication for public endpoints
    if (config.skipAuth) {
      delete config.skipAuth; // Remove the flag from config
      return config;
    }

    // Get fresh token before each request to avoid expiry issues
    if (getTokenFunction) {
      try {
        const freshToken = await getTokenFunction();
        if (freshToken) {
          config.headers['Authorization'] = `Bearer ${freshToken}`;
          config.headers['x-clerk-auth-token'] = freshToken;
        }
      } catch (error) {
        console.error('Error getting fresh token:', error);
        // Don't fail the request if token fetch fails for public endpoints
      }
    }

    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async error => {
    const originalRequest = error.config;

    console.error('API Error:', error.response?.status, error.response?.data);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to get a fresh token and retry the request
      if (getTokenFunction) {
        try {
          const freshToken = await getTokenFunction();
          if (freshToken) {
            originalRequest.headers['Authorization'] = `Bearer ${freshToken}`;
            originalRequest.headers['x-clerk-auth-token'] = freshToken;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }

      // If refresh fails, you might want to trigger a logout or redirect
    }

    return Promise.reject(error);
  },
);

export default api;
