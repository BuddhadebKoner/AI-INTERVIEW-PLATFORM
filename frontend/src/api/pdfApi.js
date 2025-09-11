import api from './axios';

/**
 * Upload PDF file and get details
 * @param {File} file - PDF file to upload
 * @returns {Promise} API response with PDF details
 */
export const uploadPDF = async file => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

/**
 * Test API connection
 * @returns {Promise} API response
 */
export const testConnection = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};
