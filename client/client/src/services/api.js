import axios from 'axios';

// Get base URL from environment or fallback to '/api'
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to all requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors (e.g. 401 token expiration)
api.interceptors.response.use(
  (response) => {
    // If the response shape has success/data envelope, unpack it for ease of use
    if (response.data && response.data.success !== undefined) {
      return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
  },
  (error) => {
    // If response returns 401 Unauthorized and we have a local token, clear it
    if (error.response && error.response.status === 401) {
      const isMeRequest = error.config.url.endsWith('/auth/me');
      // If it's a verification request, we let AuthContext handle the redirect.
      // For other request failures, clear state or let the context know.
      if (!isMeRequest) {
        localStorage.removeItem('token');
        // Optional: reload window to reset state or redirect to login
        // window.location.href = '/login';
      }
    }
    
    // Normalize error message for easier rendering on pages
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.errors || 
      'An error occurred. Please check your connection and try again.';
      
    const normalizedError = new Error(errorMessage);
    normalizedError.status = error.response?.status;
    normalizedError.response = error.response;
    
    return Promise.reject(normalizedError);
  }
);

export default api;
