import api from './axios';

// User API endpoints
export const userApi = {
  // Save or create user profile
  saveProfile: async resumeData => {
    try {
      const response = await api.post('/user/profile', resumeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateProfile: async updates => {
    try {
      const response = await api.put('/user/profile', updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete user profile
  deleteProfile: async () => {
    try {
      const response = await api.delete('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userApi;
