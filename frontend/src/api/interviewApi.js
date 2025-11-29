import api from './axios';

// Interview API endpoints
export const interviewApi = {
   // Create new interview session
   createInterview: async interviewData => {
      try {
         const response = await api.post('/interview', interviewData);
         return response.data;
      } catch (error) {
         throw error.response?.data || error;
      }
   },

   // Get all interviews for logged-in user
   getUserInterviews: async () => {
      try {
         const response = await api.get('/interview');
         return response.data;
      } catch (error) {
         throw error.response?.data || error;
      }
   },

   // Get single interview by ID
   getInterviewById: async id => {
      try {
         const response = await api.get(`/interview/${id}`);
         return response.data;
      } catch (error) {
         throw error.response?.data || error;
      }
   },

   // Update interview status/results
   updateInterview: async (id, updates) => {
      try {
         const response = await api.patch(`/interview/${id}`, updates);
         return response.data;
      } catch (error) {
         throw error.response?.data || error;
      }
   },

   // Delete interview
   deleteInterview: async id => {
      try {
         const response = await api.delete(`/interview/${id}`);
         return response.data;
      } catch (error) {
         throw error.response?.data || error;
      }
   },
};

export default interviewApi;
