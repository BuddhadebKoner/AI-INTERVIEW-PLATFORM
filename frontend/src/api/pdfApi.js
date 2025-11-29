import axios from 'axios';

// PDF service runs on separate port (Python FastAPI)
const PDF_SERVICE_URL =
  import.meta.env.VITE_PDF_SERVICE_URL || 'http://localhost:8000';

/**
 * Upload PDF file and get details
 * @param {File} file - PDF file to upload
 * @returns {Promise} API response with PDF details
 */
export const uploadPDF = async file => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${PDF_SERVICE_URL}/upload-pdf`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

/**
 * Test PDF service connection
 * @returns {Promise} API response
 */
export const testConnection = async () => {
  try {
    const response = await axios.get(`${PDF_SERVICE_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};
