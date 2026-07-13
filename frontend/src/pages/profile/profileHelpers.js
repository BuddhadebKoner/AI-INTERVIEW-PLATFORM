export const statusStyles = {
  initiated: 'border-blue-200 bg-blue-50 text-blue-700',
  'in-progress': 'border-amber-200 bg-amber-50 text-amber-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-slate-200 bg-slate-100 text-slate-600',
};

export const formatDate = value => {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not recorded';

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDuration = minutes => {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatStatus = status => {
  if (!status) return 'Unknown';
  return status
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const getInterviewScore = interview => {
  if (typeof interview?.score === 'number') return interview.score;

  const scoredQuestions = interview?.questions?.filter(
    question => typeof question.score === 'number',
  );

  if (!scoredQuestions?.length) return null;

  const average = scoredQuestions.reduce(
    (total, question) => total + question.score,
    0,
  ) / scoredQuestions.length;

  return Math.round(average * 10);
};

export const getProfileCompletion = profile => {
  if (!profile) return 15;

  return Math.min(
    100,
    25 +
      (profile.summary ? 15 : 0) +
      (profile.skills?.length ? 20 : 0) +
      (profile.experience?.length ? 20 : 0) +
      (profile.education?.length ? 10 : 0) +
      (profile.email ? 5 : 0) +
      (profile.phone ? 5 : 0),
  );
};

export const getDisplayName = (profile, user) =>
  profile?.name || user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Candidate';

export const getStatusClassName = status =>
  statusStyles[status] || statusStyles.cancelled;

