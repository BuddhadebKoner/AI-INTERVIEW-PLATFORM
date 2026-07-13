import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { interviewApi } from '../api/interviewApi';
import { userApi } from '../api/userApi';
import { Alert } from '../components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent } from '../components/ui/card';
import AccountPage from './profile/AccountPage';
import InterviewsPage from './profile/InterviewsPage';
import OverviewPage from './profile/OverviewPage';
import { ProfileNav, ProfileShellHeader } from './profile/ProfileShared';
import ReportDetailPage from './profile/ReportDetailPage';
import ReportsPage from './profile/ReportsPage';
import { getDisplayName } from './profile/profileHelpers';

const Profile = () => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [profileResult, interviewsResult] = await Promise.allSettled([
      userApi.getProfile(),
      interviewApi.getUserInterviews(),
    ]);

    const errors = [];

    if (profileResult.status === 'fulfilled' && profileResult.value.success) {
      setUserProfile(profileResult.value.data);
    } else if (profileResult.status === 'rejected') {
      if (profileResult.reason?.needsProfileCreation) {
        setUserProfile(null);
      } else {
        errors.push(profileResult.reason?.message || 'Failed to load profile.');
      }
    }

    if (interviewsResult.status === 'fulfilled' && interviewsResult.value.success) {
      setInterviews(interviewsResult.value.data || []);
    } else if (interviewsResult.status === 'rejected') {
      errors.push(interviewsResult.reason?.message || 'Failed to load interviews.');
    }

    setError(errors.length ? errors.join(' ') : null);
    setLoading(false);
  }, []);

  const refreshInterviews = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await interviewApi.getUserInterviews();
      if (response.success) {
        setInterviews(response.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh interviews.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDeleteInterview = useCallback(async id => {
    if (!window.confirm('Delete this interview? This cannot be undone.')) return;

    try {
      await interviewApi.deleteInterview(id);
      setInterviews(current => current.filter(interview => interview._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete interview.');
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const displayName = getDisplayName(userProfile, user);
  const role = userProfile?.experience?.[0]?.position || 'Interview Candidate';

  if (loading) {
    return (
      <div className='flex min-h-[70vh] items-center justify-center px-4'>
        <Card className='w-full max-w-sm bg-white/90'>
          <CardContent className='p-8 text-center'>
            <Loader2 className='mx-auto h-10 w-10 animate-spin text-indigo-600' />
            <p className='mt-4 font-medium text-slate-700'>Loading profile dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]'>
        <aside className='hidden lg:block'>
          <Card className='sticky top-28 bg-white/85'>
            <CardContent className='p-4'>
              <div className='mb-4 flex items-center gap-3 px-2 py-3'>
                <Avatar className='h-11 w-11 border border-slate-200'>
                  <AvatarImage src={user?.imageUrl} alt={displayName} />
                  <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <p className='truncate font-semibold text-slate-950'>{displayName}</p>
                  <p className='truncate text-sm text-slate-500'>{role}</p>
                </div>
              </div>
              <ProfileNav />
            </CardContent>
          </Card>
        </aside>

        <main className='space-y-6'>
          <ProfileShellHeader displayName={displayName} user={user} />
          <div className='lg:hidden'>
            <ProfileNav mobile />
          </div>

          {error && (
            <Alert className='border-red-200 bg-red-50 text-red-800'>
              <p className='font-medium'>{error}</p>
            </Alert>
          )}

          <Routes>
            <Route
              index
              element={<OverviewPage userProfile={userProfile} user={user} interviews={interviews} />}
            />
            <Route path='overview' element={<Navigate to='/profile' replace />} />
            <Route
              path='interviews'
              element={
                <InterviewsPage
                  interviews={interviews}
                  onDelete={handleDeleteInterview}
                  onRefresh={refreshInterviews}
                  refreshing={refreshing}
                />
              }
            />
            <Route path='reports' element={<ReportsPage interviews={interviews} />} />
            <Route path='reports/:id' element={<ReportDetailPage interviews={interviews} />} />
            <Route
              path='account'
              element={
                <AccountPage
                  userProfile={userProfile}
                  onProfileSaved={setUserProfile}
                />
              }
            />
            <Route path='*' element={<Navigate to='/profile' replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Profile;
