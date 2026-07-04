import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { interviewApi } from '../api/interviewApi';
import VoiceInterview from '../components/VoiceInterview';

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
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='mx-auto mb-4 h-12 w-12 animate-spin' />
          <p className='text-lg'>Loading interview data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='rounded-lg bg-red-50 p-8 text-center'>
          <p className='text-lg font-semibold text-red-600'>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6 text-center'>
          <h1 className='mb-2 text-3xl font-bold'>Voice Interview Session</h1>
          <p className='text-gray-600'>
            Interview Type: {interview?.interviewType} | Language:{' '}
            {interview?.language} | Complexity: {interview?.complexity}
          </p>
        </div>

        <VoiceInterview interview={interview} />
      </div>
    </div>
  );
};

export default InterviewPage;
