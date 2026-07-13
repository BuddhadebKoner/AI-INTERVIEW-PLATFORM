import { AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { interviewApi } from '../../api/interviewApi';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { EmptyState } from './ProfileShared';
import { formatDate, formatDuration, getInterviewScore } from './profileHelpers';

const ReportDetailPage = ({ interviews }) => {
  const { id } = useParams();
  const existingInterview = useMemo(
    () => interviews.find(interview => interview._id === id),
    [id, interviews],
  );
  const [interview, setInterview] = useState(existingInterview || null);
  const [loading, setLoading] = useState(!existingInterview);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingInterview) {
      setInterview(existingInterview);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchInterview = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await interviewApi.getInterviewById(id);
        setInterview(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [existingInterview, id]);

  if (loading) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <EmptyState
        icon={AlertCircle}
        title='Report not found'
        description={error || 'This interview report could not be loaded.'}
        action={
          <Button asChild variant='outline'>
            <Link to='/profile/reports'>Back to reports</Link>
          </Button>
        }
      />
    );
  }

  if (interview.status !== 'completed') {
    return (
      <EmptyState
        icon={Clock}
        title='Report is not ready'
        description='Only completed interviews have report pages.'
        action={
          <Button asChild variant='gradient'>
            <Link to={`/interview/${interview._id}`}>Continue Interview</Link>
          </Button>
        }
      />
    );
  }

  const score = getInterviewScore(interview);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <Button asChild variant='link' className='mb-2 h-auto px-0 text-slate-600'>
            <Link to='/profile/reports'>Back to reports</Link>
          </Button>
          <h2 className='text-2xl font-bold text-slate-950'>
            {interview.interviewType || 'Interview'} Report
          </h2>
          <p className='mt-1 text-sm text-slate-600'>
            Completed {formatDate(interview.completedAt || interview.updatedAt)}
          </p>
        </div>
        <div className='rounded-3xl bg-slate-950 px-6 py-5 text-center text-white'>
          <p className='text-4xl font-bold'>{score === null ? '--' : `${score}%`}</p>
          <p className='mt-1 text-sm text-white/70'>Overall score</p>
        </div>
      </div>

      <section className='grid gap-4 md:grid-cols-3'>
        {[
          { label: 'Difficulty', value: interview.complexity || 'beginner' },
          { label: 'Duration', value: formatDuration(interview.duration) },
          { label: 'Questions', value: interview.questions?.length || 0 },
        ].map(item => (
          <Card key={item.label} className='bg-white'>
            <CardContent className='p-5'>
              <p className='text-sm text-slate-500'>{item.label}</p>
              <p className='mt-1 text-2xl font-bold capitalize text-slate-950'>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className='bg-white'>
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
          <CardDescription>Saved interview feedback from the completed session.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='leading-7 text-slate-700'>
            {interview.feedback || 'No summary feedback was saved for this interview.'}
          </p>
        </CardContent>
      </Card>

      <Card className='bg-white'>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>Questions, answers, and per-question scores when available.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {interview.questions?.length ? (
            interview.questions.map(question => (
              <div key={question._id || question.questionNumber} className='rounded-3xl border border-slate-200 p-5'>
                <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                  <div>
                    <p className='text-sm font-medium text-indigo-600'>
                      Question {question.questionNumber}
                    </p>
                    <h3 className='mt-1 font-semibold text-slate-950'>
                      {question.question}
                    </h3>
                  </div>
                  {typeof question.score === 'number' && (
                    <Badge className='w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700'>
                      {question.score}/10
                    </Badge>
                  )}
                </div>
                <div className='space-y-3 text-sm leading-6 text-slate-700'>
                  <p>
                    <span className='font-semibold text-slate-950'>Your answer:</span>{' '}
                    {question.userAnswer || 'No answer saved.'}
                  </p>
                  {question.expectedAnswer && (
                    <p>
                      <span className='font-semibold text-slate-950'>Expected answer:</span>{' '}
                      {question.expectedAnswer}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className='text-sm text-slate-600'>No question details were saved for this interview.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDetailPage;
