import api from '../api/axios';

export const authService = {
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  async googleLogin(idToken) {
    const response = await api.post('/api/auth/google', { token: idToken });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password, confirmPassword) {
    const response = await api.post('/api/auth/reset-password', {
      token,
      password,
      confirm_password: confirmPassword
    });
    return response.data;
  }
};
