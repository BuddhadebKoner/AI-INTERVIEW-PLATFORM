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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading interview data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Voice Interview Session</h1>
          <p className="text-gray-600">
            Interview Type: {interview?.interviewType} | Language: {interview?.language} |
            Complexity: {interview?.complexity}
          </p>
        </div>

        <VoiceInterview interview={interview} />
      </div>
    </div>
  );
};

export default InterviewPage;
