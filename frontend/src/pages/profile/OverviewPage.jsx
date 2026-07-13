import {
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { InterviewMeta } from './ProfileShared';
import {
  formatDate,
  formatDuration,
  formatStatus,
  getDisplayName,
  getStatusClassName,
  getInterviewScore,
  getProfileCompletion,
} from './profileHelpers';

const OverviewPage = ({ userProfile, user, interviews }) => {
  const displayName = getDisplayName(userProfile, user);
  const email = userProfile?.email || user?.primaryEmailAddress?.emailAddress;
  const role = userProfile?.experience?.[0]?.position || 'Interview Candidate';
  const company = userProfile?.experience?.[0]?.company || 'Open to opportunities';
  const completion = getProfileCompletion(userProfile);
  const completedInterviews = interviews.filter(
    interview => interview.status === 'completed',
  );
  const scoredInterviews = completedInterviews
    .map(getInterviewScore)
    .filter(score => typeof score === 'number');
  const averageScore = scoredInterviews.length
    ? Math.round(
        scoredInterviews.reduce((total, score) => total + score, 0) /
          scoredInterviews.length,
      )
    : null;
  const totalPracticeTime = completedInterviews.reduce(
    (total, interview) => total + (interview.duration || 0),
    0,
  );
  const recentInterviews = interviews.slice(0, 3);

  const stats = [
    {
      icon: CheckCircle2,
      label: 'Completed Interviews',
      value: completedInterviews.length,
      detail: `${interviews.length} total sessions`,
    },
    {
      icon: BarChart3,
      label: 'Average Score',
      value: averageScore === null ? 'N/A' : `${averageScore}%`,
      detail: scoredInterviews.length ? 'Based on completed reports' : 'Complete an interview to score',
    },
    {
      icon: Target,
      label: 'Profile Readiness',
      value: `${completion}%`,
      detail: 'Resume and account completeness',
    },
    {
      icon: Clock,
      label: 'Practice Time',
      value: formatDuration(totalPracticeTime),
      detail: 'Saved completed duration',
    },
  ];

  return (
    <div className='space-y-6'>
      <Card className='overflow-hidden bg-white'>
        <div className='relative min-h-56 overflow-hidden bg-slate-950 p-6 text-white sm:p-8'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_26%),radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.22),transparent_24%)]' />
          <div className='relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
            <div className='flex flex-col gap-5 sm:flex-row sm:items-end'>
              <Avatar className='h-24 w-24 border-4 border-white/20 shadow-2xl'>
                <AvatarImage src={user?.imageUrl} alt={displayName} />
                <AvatarFallback className='bg-white text-3xl text-slate-950'>
                  {displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge className='mb-3 rounded-full border-white/10 bg-white/10 px-3 py-1 text-white'>
                  <Sparkles className='mr-1 h-3.5 w-3.5' />
                  {completion}% complete
                </Badge>
                <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                  {displayName}
                </h2>
                <p className='mt-2 text-white/70'>
                  {role} at {company}
                </p>
              </div>
            </div>
            <div className='w-full max-w-sm rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl'>
              <div className='mb-3 flex items-center justify-between text-sm'>
                <span className='text-white/70'>Profile completion</span>
                <span className='font-semibold'>{completion}%</span>
              </div>
              <Progress value={completion} className='bg-white/15 [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 [&>div]:to-blue-400' />
            </div>
          </div>
        </div>

        <CardContent className='grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8'>
          {[
            { icon: Mail, label: email || 'No email added' },
            { icon: Phone, label: userProfile?.phone || 'Phone not added' },
            { icon: MapPin, label: userProfile?.location || 'Location not added' },
            { icon: Calendar, label: `Joined ${formatDate(userProfile?.createdAt || user?.createdAt)}` },
          ].map(({ icon: Icon, label }) => {
            Icon;

            return (
            <div key={label} className='flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
              <Icon className='h-4 w-4 text-slate-950' />
              <span className='truncate'>{label}</span>
            </div>
            );
          })}
        </CardContent>
      </Card>

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {stats.map(({ icon: Icon, label, value, detail }) => {
          Icon;

          return (
          <Card key={label} className='bg-white/90'>
            <CardContent className='p-6'>
              <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-white shadow-lg shadow-indigo-200'>
                <Icon className='h-5 w-5' />
              </div>
              <p className='text-sm text-slate-500'>{label}</p>
              <p className='mt-1 text-3xl font-bold text-slate-950'>{value}</p>
              <p className='mt-2 text-sm text-slate-500'>{detail}</p>
            </CardContent>
          </Card>
          );
        })}
      </section>

      <section className='grid gap-6 xl:grid-cols-[0.9fr_1.1fr]'>
        <Card className='bg-white'>
          <CardHeader className='gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle>Next Practice</CardTitle>
              <CardDescription>Start a new session from your current profile.</CardDescription>
            </div>
            <Button asChild variant='gradient'>
              <Link to='/form'>
                Start
                <ChevronRight className='h-4 w-4' />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
              <div className='flex items-start gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white'>
                  <Briefcase className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='font-semibold text-slate-950'>AI mock interview session</h3>
                  <p className='mt-1 text-sm leading-6 text-slate-600'>
                    Resume-aware questions, voice practice, and saved reports after completion.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-white'>
          <CardHeader className='gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Your latest interview sessions.</CardDescription>
            </div>
            <Button asChild variant='outline'>
              <Link to='/profile/interviews'>View all</Link>
            </Button>
          </CardHeader>
          <CardContent className='space-y-3'>
            {recentInterviews.length ? (
              recentInterviews.map(interview => (
                <Link
                  key={interview._id}
                  to={
                    interview.status === 'completed'
                      ? `/profile/reports/${interview._id}`
                      : `/interview/${interview._id}`
                  }
                  className='block rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50'
                >
                  <div className='mb-3 flex items-center justify-between gap-4'>
                    <p className='font-semibold text-slate-950'>
                      {interview.interviewType || 'General Interview'}
                    </p>
                    <Badge className={`rounded-full border px-3 py-1 ${getStatusClassName(interview.status)}`}>
                      {formatStatus(interview.status)}
                    </Badge>
                  </div>
                  <InterviewMeta interview={interview} />
                </Link>
              ))
            ) : (
              <div className='rounded-3xl border border-dashed border-slate-300 p-8 text-center'>
                <FileText className='mx-auto h-10 w-10 text-slate-400' />
                <h4 className='mt-4 font-semibold text-slate-950'>No interviews yet</h4>
                <p className='mt-2 text-sm text-slate-600'>Start your first AI interview to build your history.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default OverviewPage;


