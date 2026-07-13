import {
  BarChart3,
  Calendar,
  ChevronRight,
  FileText,
  LayoutDashboard,
  PlayCircle,
  RefreshCw,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { formatDate, getInterviewScore } from './profileHelpers';

const navItems = [
  { label: 'Overview', to: '/profile', end: true, icon: LayoutDashboard },
  { label: 'Interviews', to: '/profile/interviews', icon: Calendar },
  { label: 'Reports', to: '/profile/reports', icon: BarChart3 },
  { label: 'Account', to: '/profile/account', icon: UserIcon },
];

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  Icon;

  return (
  <Card className='bg-white'>
    <CardContent className='py-12 text-center'>
      <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500'>
        <Icon className='h-7 w-7' />
      </div>
      <h3 className='text-lg font-semibold text-slate-950'>{title}</h3>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600'>
        {description}
      </p>
      {action && <div className='mt-6'>{action}</div>}
    </CardContent>
  </Card>
  );
};

export const ProfileNav = ({ mobile = false }) => {
  const className = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-slate-950 text-white shadow-lg shadow-slate-300/70'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    } ${mobile ? 'shrink-0 border border-slate-200 bg-white' : ''}`;

  return (
    <nav className={mobile ? 'flex gap-2 overflow-x-auto pb-1' : 'space-y-1'}>
      {navItems.map(({ label, to, end, icon: Icon }) => {
        Icon;

        return (
        <NavLink key={label} to={to} end={end} className={className}>
          <Icon className='h-4 w-4' />
          {label}
        </NavLink>
        );
      })}
    </nav>
  );
};

export const ProfileShellHeader = ({ displayName, user }) => (
  <div className='flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-lg shadow-slate-200/60 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5'>
    <div>
      <p className='text-sm font-medium text-slate-500'>Dashboard</p>
      <h1 className='text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl'>
        Welcome back, {displayName.split(' ')[0]}
      </h1>
    </div>
    <div className='flex items-center gap-3'>
      <Button asChild variant='gradient'>
        <Link to='/form'>
          Start Interview
          <ChevronRight className='h-4 w-4' />
        </Link>
      </Button>
      <Avatar className='h-11 w-11 border border-slate-200'>
        <AvatarImage src={user?.imageUrl} alt={displayName} />
        <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
  </div>
);

export const InterviewMeta = ({ interview }) => (
  <div className='flex flex-wrap gap-2 text-sm text-slate-600'>
    <span className='rounded-full bg-slate-100 px-3 py-1'>
      {interview.interviewType || 'General Interview'}
    </span>
    <span className='rounded-full bg-slate-100 px-3 py-1 capitalize'>
      {interview.complexity || 'beginner'}
    </span>
    <span className='rounded-full bg-slate-100 px-3 py-1'>
      {interview.questions?.length || 0} questions
    </span>
    <span className='rounded-full bg-slate-100 px-3 py-1'>
      {formatDate(interview.createdAt)}
    </span>
  </div>
);

export const InterviewActions = ({ interview, onDelete }) => {
  const score = getInterviewScore(interview);
  const isCompleted = interview.status === 'completed';
  const canContinue = !isCompleted && interview.status !== 'cancelled';

  return (
    <div className='flex flex-wrap gap-2'>
      {canContinue && (
        <Button asChild variant='gradient' size='sm'>
          <Link to={`/interview/${interview._id}`}>
            <PlayCircle className='h-4 w-4' />
            {interview.status === 'in-progress' ? 'Continue' : 'Start'}
          </Link>
        </Button>
      )}
      {isCompleted && (
        <Button asChild variant='outline' size='sm'>
          <Link to={`/profile/reports/${interview._id}`}>
            <FileText className='h-4 w-4' />
            {score === null ? 'View Report' : `View Report (${score}%)`}
          </Link>
        </Button>
      )}
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() => onDelete(interview._id)}
        className='text-red-600 hover:text-red-700'
      >
        <Trash2 className='h-4 w-4' />
        Delete
      </Button>
    </div>
  );
};

export const RefreshButton = ({ onRefresh, refreshing }) => (
  <Button variant='outline' onClick={onRefresh} disabled={refreshing}>
    {refreshing ? (
      <RefreshCw className='h-4 w-4 animate-spin' />
    ) : (
      <RefreshCw className='h-4 w-4' />
    )}
    Refresh
  </Button>
);



