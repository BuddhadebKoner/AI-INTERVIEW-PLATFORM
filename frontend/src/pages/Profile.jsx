import { useUser } from '@clerk/clerk-react';
import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  Edit3,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  Upload,
  User as UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { userApi } from '../api/userApi';
import FileUpload from '../components/FileUpload';
import ResumeForm from '../components/ResumeForm';
import { Alert } from '../components/ui/alert';

const Profile = () => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getProfile();
      if (response.success) {
        setUserProfile(response.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      // If user not found, it's okay - they haven't created a profile yet
      if (err.needsProfileCreation) {
        setUserProfile(null);
      } else {
        setError(err.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = data => {
    setResumeData(data);
    setShowResumeUpload(false);
    setIsEditing(true);
  };

  const handleUpdateProfile = async formData => {
    try {
      setLoading(true);
      const response = await userApi.saveProfile(formData);
      if (response.success) {
        setUserProfile(response.data);
        setResumeData(null);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (userProfile) {
      setResumeData({ resume_data: userProfile });
      setIsEditing(true);
    }
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

  // Show loading state
  if (loading && !userProfile) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50'>
        <div className='text-center'>
          <Loader2 className='mx-auto h-12 w-12 animate-spin text-blue-600' />
          <p className='mt-4 text-lg text-slate-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

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

        {/* Error Message */}
        {error && (
          <Alert className='mb-6 border-red-200 bg-red-50 text-red-800'>
            <p className='font-medium'>✗ {error}</p>
          </Alert>
        )}

        {/* Profile Card */}
        <div className='mb-8 rounded-2xl bg-white p-8 shadow-xl'>
          <div className='flex flex-col items-center gap-8 md:flex-row'>
            <div className='flex-shrink-0'>
              <img
                src={user?.imageUrl}
                alt={userProfile?.name || user?.fullName}
                className='h-24 w-24 rounded-full border-4 border-gradient-to-r from-blue-600 to-purple-600 object-cover'
              />
            </div>

            <div className='flex-1 text-center md:text-left'>
              <h2 className='mb-2 text-2xl font-bold text-slate-900'>
                {userProfile?.name || user?.fullName || 'User'}
              </h2>

              <div className='space-y-2'>
                {(userProfile?.email || user?.primaryEmailAddress?.emailAddress) && (
                  <div className='flex items-center justify-center gap-2 text-slate-600 md:justify-start'>
                    <Mail className='h-4 w-4' />
                    <span>
                      {userProfile?.email || user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                )}

                {userProfile?.phone && (
                  <div className='flex items-center justify-center gap-2 text-slate-600 md:justify-start'>
                    <Phone className='h-4 w-4' />
                    <span>{userProfile.phone}</span>
                  </div>
                )}

                {userProfile?.location && (
                  <div className='flex items-center justify-center gap-2 text-slate-600 md:justify-start'>
                    <MapPin className='h-4 w-4' />
                    <span>{userProfile.location}</span>
                  </div>
                )}

                <div className='flex items-center justify-center gap-2 text-slate-600 md:justify-start'>
                  <Calendar className='h-4 w-4' />
                  <span>
                    Member since{' '}
                    {new Date(userProfile?.createdAt || user?.createdAt).toLocaleDateString()}
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

        {/* Resume & Profile Information */}
        <div className='mb-8 rounded-2xl bg-white p-8 shadow-xl'>
          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-xl font-semibold text-slate-900'>
              Resume & Profile Information
            </h3>
            <div className='flex gap-2'>
              {userProfile && !isEditing && (
                <button
                  onClick={handleEditProfile}
                  className='flex items-center gap-2 rounded-xl border-2 border-blue-600 px-4 py-2 text-blue-600 transition-all duration-300 hover:bg-blue-50'
                >
                  <Edit3 className='h-4 w-4' />
                  Edit Profile
                </button>
              )}
              {!isEditing && (
                <button
                  onClick={() => setShowResumeUpload(!showResumeUpload)}
                  className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'
                >
                  <Upload className='h-4 w-4' />
                  {showResumeUpload ? 'Hide Upload' : 'Upload Resume'}
                </button>
              )}
            </div>
          </div>

          {showResumeUpload && !resumeData && !isEditing && (
            <div className='mb-6'>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {(resumeData || isEditing) ? (
            <div>
              {resumeData && (
                <div className='mb-4 flex items-center gap-2 text-green-600'>
                  <Award className='h-5 w-5' />
                  <span className='font-medium'>
                    Resume data extracted successfully
                  </span>
                </div>
              )}
              <ResumeForm
                resumeData={resumeData}
                onSave={handleUpdateProfile}
                isProfile={true}
              />
            </div>
          ) : userProfile ? (
            // Display existing profile data
            <div className='space-y-6'>
              {/* Professional Summary */}
              {userProfile.summary && (
                <div className='rounded-xl border border-slate-200 bg-slate-50 p-6'>
                  <h4 className='mb-3 font-semibold text-slate-900'>
                    Professional Summary
                  </h4>
                  <p className='text-slate-700'>{userProfile.summary}</p>
                </div>
              )}

              {/* Skills */}
              {userProfile.skills && userProfile.skills.length > 0 && (
                <div>
                  <h4 className='mb-3 font-semibold text-slate-900'>Skills</h4>
                  <div className='flex flex-wrap gap-2'>
                    {userProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className='rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {userProfile.experience && userProfile.experience.length > 0 && (
                <div>
                  <h4 className='mb-4 flex items-center gap-2 font-semibold text-slate-900'>
                    <Briefcase className='h-5 w-5' />
                    Work Experience
                  </h4>
                  <div className='space-y-4'>
                    {userProfile.experience.map((exp, index) => (
                      <div
                        key={index}
                        className='rounded-xl border border-slate-200 p-5'
                      >
                        <div className='mb-2 flex items-start justify-between'>
                          <div>
                            <h5 className='font-semibold text-slate-900'>
                              {exp.position}
                            </h5>
                            <p className='text-slate-600'>{exp.company}</p>
                          </div>
                          {exp.duration && (
                            <span className='rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600'>
                              {exp.duration}
                            </span>
                          )}
                        </div>
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <ul className='mt-3 space-y-1'>
                            {exp.responsibilities.map((resp, idx) => (
                              <li key={idx} className='text-sm text-slate-600'>
                                • {resp}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {userProfile.education && userProfile.education.length > 0 && (
                <div>
                  <h4 className='mb-4 flex items-center gap-2 font-semibold text-slate-900'>
                    <GraduationCap className='h-5 w-5' />
                    Education
                  </h4>
                  <div className='space-y-4'>
                    {userProfile.education.map((edu, index) => (
                      <div
                        key={index}
                        className='rounded-xl border border-slate-200 p-5'
                      >
                        <div className='flex items-start justify-between'>
                          <div>
                            <h5 className='font-semibold text-slate-900'>
                              {edu.degree}
                            </h5>
                            <p className='text-slate-600'>{edu.institution}</p>
                          </div>
                          {edu.year && (
                            <span className='rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600'>
                              {edu.year}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            !showResumeUpload && (
              <div className='py-12 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
                  <Edit3 className='h-8 w-8 text-slate-400' />
                </div>
                <h4 className='mb-2 text-lg font-semibold text-slate-900'>
                  Complete your profile
                </h4>
                <p className='mb-6 text-slate-600'>
                  Upload your resume to auto-fill your profile information
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
              <UserIcon className='h-8 w-8 text-slate-400' />
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
