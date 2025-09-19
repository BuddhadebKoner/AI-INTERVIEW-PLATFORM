import { useUser } from '@clerk/clerk-react';
import {
  Award,
  Calendar,
  Clock,
  Edit3,
  Mail,
  TrendingUp,
  Upload,
  User,
} from 'lucide-react';
import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ResumeForm from '../components/ResumeForm';

const Profile = () => {
  const { user } = useUser();
  const [resumeData, setResumeData] = useState(null);
  const [showResumeUpload, setShowResumeUpload] = useState(false);

  const handleUploadSuccess = data => {
    setResumeData(data);
    setShowResumeUpload(false);
  };

  const handleUpdateProfile = formData => {
    console.log('Profile Update Data:', formData);
    // Here you would typically save to database
    alert('Profile updated successfully! (Check console for data)');
  };

  const stats = [
    {
      icon: <Award className='h-6 w-6' />,
      label: 'Interviews Completed',
      value: '0',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: <TrendingUp className='h-6 w-6' />,
      label: 'Average Score',
      value: 'N/A',
      color: 'from-green-600 to-green-700',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      label: 'Practice Time',
      value: '0 min',
      color: 'from-purple-600 to-purple-700',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-3xl font-bold text-slate-900 lg:text-4xl'>
            My Profile
          </h1>
          <p className='text-xl text-slate-600'>
            Track your interview progress and manage your account
          </p>
        </div>

        {/* Profile Card */}
        <div className='mb-8 rounded-2xl bg-white p-8 shadow-xl'>
          <div className='flex flex-col items-center gap-8 md:flex-row'>
            <div className='flex-shrink-0'>
              <img
                src={user?.imageUrl}
                alt={user?.fullName}
                className='border-gradient-to-r h-24 w-24 rounded-full border-4 from-blue-600 to-purple-600'
              />
            </div>

            <div className='flex-1 text-center md:text-left'>
              <h2 className='mb-2 text-2xl font-bold text-slate-900'>
                {user?.fullName || 'User'}
              </h2>

              <div className='space-y-2'>
                <div className='flex items-center justify-center gap-2 text-slate-600 md:justify-start'>
                  <Mail className='h-4 w-4' />
                  <span>{user?.primaryEmailAddress?.emailAddress}</span>
                </div>

                <div className='flex items-center justify-center gap-2 text-slate-600 md:justify-start'>
                  <Calendar className='h-4 w-4' />
                  <span>
                    Member since{' '}
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex-shrink-0'>
              <div className='rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>0</div>
                  <div className='text-sm opacity-90'>Interviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='mb-8 grid gap-6 md:grid-cols-3'>
          {stats.map((stat, index) => (
            <div key={index} className='rounded-xl bg-white p-6 shadow-sm'>
              <div className='flex items-center gap-4'>
                <div
                  className={`bg-gradient-to-r ${stat.color} flex h-12 w-12 items-center justify-center rounded-xl text-white`}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className='text-2xl font-bold text-slate-900'>
                    {stat.value}
                  </div>
                  <div className='text-sm text-slate-600'>{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className='mb-8 rounded-2xl bg-white p-8 shadow-xl'>
          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-xl font-semibold text-slate-900'>
              Resume & Profile Information
            </h3>
            <button
              onClick={() => setShowResumeUpload(!showResumeUpload)}
              className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'
            >
              <Upload className='h-4 w-4' />
              {showResumeUpload ? 'Hide Upload' : 'Upload Resume'}
            </button>
          </div>

          {showResumeUpload && !resumeData && (
            <div className='mb-6'>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {resumeData ? (
            <div>
              <div className='mb-4 flex items-center gap-2 text-green-600'>
                <Award className='h-5 w-5' />
                <span className='font-medium'>
                  Resume data extracted successfully
                </span>
              </div>
              <ResumeForm
                resumeData={resumeData}
                onSave={handleUpdateProfile}
                isProfile={true}
              />
            </div>
          ) : (
            !showResumeUpload && (
              <div className='py-12 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-between rounded-full bg-slate-100'>
                  <Edit3 className='mx-auto h-8 w-8 text-slate-400' />
                </div>
                <h4 className='mb-2 text-lg font-semibold text-slate-900'>
                  Complete your profile
                </h4>
                <p className='mb-6 text-slate-600'>
                  Upload your resume to auto-fill your profile information or
                  fill manually
                </p>
                <button
                  onClick={() => setShowResumeUpload(true)}
                  className='inline-block rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'
                >
                  Get Started
                </button>
              </div>
            )
          )}
        </div>

        {/* Interview Activity */}
        <div className='mb-8 rounded-2xl bg-white p-8 shadow-xl'>
          <h3 className='mb-6 text-xl font-semibold text-slate-900'>
            Interview Activity
          </h3>

          <div className='py-12 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
              <User className='h-8 w-8 text-slate-400' />
            </div>
            <h4 className='mb-2 text-lg font-semibold text-slate-900'>
              No interviews yet
            </h4>
            <p className='mb-6 text-slate-600'>
              Start your first AI interview to see your progress here
            </p>
            <a
              href='/form'
              className='inline-block rounded-xl bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'
            >
              Start Interview
            </a>
          </div>
        </div>

        {/* Account Settings */}
        <div className='mt-8 rounded-2xl bg-white p-8 shadow-xl'>
          <h3 className='mb-6 text-xl font-semibold text-slate-900'>
            Account Settings
          </h3>

          <div className='space-y-4'>
            <div className='flex items-center justify-between rounded-xl border border-slate-200 p-4'>
              <div>
                <h4 className='font-semibold text-slate-900'>
                  Email Notifications
                </h4>
                <p className='text-sm text-slate-600'>
                  Receive updates about your interviews
                </p>
              </div>
              <label className='relative inline-flex cursor-pointer items-center'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='peer sr-only'
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>

            <div className='flex items-center justify-between rounded-xl border border-slate-200 p-4'>
              <div>
                <h4 className='font-semibold text-slate-900'>
                  Performance Analytics
                </h4>
                <p className='text-sm text-slate-600'>
                  Track detailed interview metrics
                </p>
              </div>
              <label className='relative inline-flex cursor-pointer items-center'>
                <input
                  type='checkbox'
                  defaultChecked
                  className='peer sr-only'
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
