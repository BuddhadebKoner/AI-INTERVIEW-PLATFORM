import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  EmptyState,
  InterviewActions,
  InterviewMeta,
  RefreshButton,
} from './ProfileShared';
import { formatStatus, getStatusClassName } from './profileHelpers';

const InterviewsPage = ({ interviews, onDelete, onRefresh, refreshing }) => (
  <div className='space-y-6'>
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h2 className='text-2xl font-bold text-slate-950'>Interviews</h2>
        <p className='mt-1 text-sm text-slate-600'>All interview sessions saved for your account.</p>
      </div>
      <div className='flex flex-wrap gap-2'>
        <RefreshButton onRefresh={onRefresh} refreshing={refreshing} />
        <Button asChild variant='gradient'>
          <Link to='/form'>Start Interview</Link>
        </Button>
      </div>
    </div>

    {interviews.length ? (
      <div className='space-y-4'>
        {interviews.map(interview => (
          <Card key={interview._id} className='bg-white'>
            <CardContent className='p-5'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='space-y-3'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <h3 className='text-lg font-semibold text-slate-950'>
                      {interview.interviewType || 'General Interview'}
                    </h3>
                    <Badge className={`rounded-full border px-3 py-1 ${getStatusClassName(interview.status)}`}>
                      {formatStatus(interview.status)}
                    </Badge>
                  </div>
                  <InterviewMeta interview={interview} />
                </div>
                <InterviewActions interview={interview} onDelete={onDelete} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <EmptyState
        icon={Calendar}
        title='No interviews yet'
        description='Start an interview to create your first saved session.'
        action={
          <Button asChild variant='gradient'>
            <Link to='/form'>Start Interview</Link>
          </Button>
        }
      />
    )}
  </div>
);

export default InterviewsPage;


