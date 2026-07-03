import api from './api';

const authService = {
  /**
   * Registers a new patient account
   * POST /api/auth/signup
   */
  signup: async (userData) => {
    return api.post('/auth/signup', userData);
  },

  /**
   * Log in user
   * POST /api/auth/login
   */
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  /**
   * Verifies existing token and gets user details
   * GET /api/auth/me
   */
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },

  /**
   * Invalidate server token session
   * POST /api/auth/logout
   */
  logout: async () => {
    return api.post('/auth/logout');
  },

  /**
   * Trigger forgot password email
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset user password with token from email link
   * POST /api/auth/reset-password/:token
   */
  resetPassword: async (token, passwords) => {
    return api.post(`/auth/reset-password/${token}`, passwords);
  }
};

export default authService;
