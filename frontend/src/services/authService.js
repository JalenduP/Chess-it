// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Verify OTP for registration
  verifyOTP: async (email, otp) => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Forgot password - request OTP
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify reset password OTP
  verifyResetOTP: async (email, otp) => {
    const response = await axiosInstance.post('/auth/verify-reset-otp', { email, otp });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      resetToken,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await axiosInstance.post('/auth/resend-otp', { email });
    return response.data;
  },

  // Check email availability
  checkEmail: async (email) => {
    const response = await axiosInstance.get(`/auth/check-email/${email}`);
    return response.data;
  },

  // Check username availability
  checkUsername: async (username) => {
    const response = await axiosInstance.get(`/auth/check-username/${username}`);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get user profile
  getUserProfile: async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    const response = await axiosInstance.put('/user/profile', userData);
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default authService;