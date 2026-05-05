import axios from 'axios';

const api = axios.create({
  baseURL: 'https://khanwebbackend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return process.env.NEXT_PUBLIC_TECH_EXA_ADMIN_TOKEN;
};

// Set up request interceptor to add auth header
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Set up response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
