import { ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { EmptyState, InterviewMeta } from './ProfileShared';
import { formatDate, getInterviewScore } from './profileHelpers';

const ReportsPage = ({ interviews }) => {
  const completedInterviews = interviews.filter(
    interview => interview.status === 'completed',
  );

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-slate-950'>Interview Reports</h2>
        <p className='mt-1 text-sm text-slate-600'>Completed interviews with saved scores and feedback.</p>
      </div>

      {completedInterviews.length ? (
        <div className='grid gap-4 lg:grid-cols-2'>
          {completedInterviews.map(interview => {
            const score = getInterviewScore(interview);

            return (
              <Card key={interview._id} className='bg-white'>
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <Badge className='mb-3 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700'>
                        Completed
                      </Badge>
                      <h3 className='text-xl font-semibold text-slate-950'>
                        {interview.interviewType || 'General Interview'}
                      </h3>
                      <p className='mt-2 text-sm text-slate-500'>
                        Completed {formatDate(interview.completedAt || interview.updatedAt)}
                      </p>
                    </div>
                    <div className='rounded-2xl bg-slate-950 px-4 py-3 text-center text-white'>
                      <p className='text-2xl font-bold'>{score === null ? '--' : score}</p>
                      <p className='text-xs text-white/70'>score</p>
                    </div>
                  </div>
                  <p className='mt-4 line-clamp-2 text-sm leading-6 text-slate-600'>
                    {interview.feedback || 'Detailed feedback is available after the interview analysis is saved.'}
                  </p>
                  <div className='mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between'>
                    <InterviewMeta interview={interview} />
                    <Button asChild variant='outline' size='sm'>
                      <Link to={`/profile/reports/${interview._id}`}>
                        Open
                        <ChevronRight className='h-4 w-4' />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title='No reports yet'
          description='Reports appear here after an interview is completed and saved.'
          action={
            <Button asChild variant='gradient'>
              <Link to='/form'>Start Interview</Link>
            </Button>
          }
        />
      )}
    </div>
  );
};

export default ReportsPage;
