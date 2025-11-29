import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { interviewApi } from '../api/interviewApi';

const InterviewPage = () => {
  const { id: interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) {
        console.error('Interview ID not provided');
        setError('Interview ID not provided');
        setLoading(false);
        return;
      }

      try {
        const response = await interviewApi.getInterviewById(interviewId);
       console.log('Fetched interview data:', response);

        setInterview(response.data);
      } catch (err) {
        console.error('Error fetching interview:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.message || 'Failed to load interview');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  if (loading) {
    return <div>Loading interview data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Interview Page - Check Console for Data</h1>
      <p>Interview ID: {interview?._id}</p>
      <p>Interview Type: {interview?.interviewType}</p>
      <p>Total Questions: {interview?.questions?.length}</p>
    </div>
  );
};

export default InterviewPage;
