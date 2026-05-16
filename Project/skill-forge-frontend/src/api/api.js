import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillforge-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling and dead-end prevention
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Session Expired
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        localStorage.removeItem('skillforge-token');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }

    // 2. Resource Not Found (Prevents hanging on broken links)
    else if (error.response?.status === 404) {
      console.warn('API Resource not found:', error.config.url);
      // We don't always redirect on 404 as the component might handle it locally
    }

    // 3. Server Down / Connection Error
    else if (!error.response) {
      toast.error('Unable to connect to the server. Please check your internet or try again later.');
    }

    // 4. Permission Denied
    else if (error.response?.status === 403) {
      toast.error(error.response.data?.message || 'Access denied.');
    }

    return Promise.reject(error);
  }
);

export default api;
