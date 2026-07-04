import {
  AlertCircle,
  ArrowRight,
  FileText,
  Loader2,
  Settings,
  Upload,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewApi } from '../api/interviewApi';
import { userApi } from '../api/userApi';
import FileUpload from '../components/FileUpload';
import ResumeForm from '../components/ResumeForm';
import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const InterviewForm = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // 'existing' or 'new'
  const [showUpload, setShowUpload] = useState(false);
  const [showInterviewConfig, setShowInterviewConfig] = useState(false);

  // Interview configuration
  const [interviewConfig, setInterviewConfig] = useState({
    interviewType: 'Full Stack',
    language: 'english',
    region: 'india',
    complexity: 'beginner',
  });

  const interviewTypes = [
    'Full Stack',
    'Frontend',
    'Backend',
    'DevOps',
    'Data Science',
    'Mobile Development',
    'UI/UX Design',
    'Quality Assurance',
    'Cloud Engineering',
    'Cybersecurity',
  ];

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
      // If user not found, they need to create profile first
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
    setShowUpload(false);
    setSelectedOption('new');
  };

  const handleUseExistingProfile = () => {
    setSelectedOption('existing');
    setResumeData({ resume_data: userProfile });
  };

  const handleUploadNewResume = () => {
    setSelectedOption('new');
    setShowUpload(true);
  };

  const handleProceedToInterview = async formData => {
    try {
      setLoading(true);
      // Save/update profile before proceeding
      const response = await userApi.saveProfile(formData);
      if (response.success) {
        setUserProfile(response.data);
        // Show interview configuration step
        setShowInterviewConfig(true);
        setResumeData(null);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create interview session
      const response = await interviewApi.createInterview(interviewConfig);

      if (response.success) {
        // Navigate to interview page with interview ID as path parameter
        navigate(`/interview/${response.data._id}`);
      }
    } catch (err) {
      console.error('Error creating interview:', err);
      setError(err.message || 'Failed to start interview. Please try again.');
      setLoading(false);
    }
  };

  // Show loading state
  if (loading && !userProfile && !resumeData && !showInterviewConfig) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Loader2 className='mx-auto h-12 w-12 animate-spin text-blue-600' />
          <p className='mt-4 text-lg text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show Interview Configuration
  if (showInterviewConfig && userProfile) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900 lg:text-4xl'>
              Configure Your Interview
            </h1>
            <p className='text-xl text-gray-600'>
              Select your interview preferences
            </p>
          </div>

          <div className='mx-auto max-w-3xl'>
            <Card className='shadow-xl'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-blue-100 p-2'>
                    <Settings className='h-6 w-6 text-blue-600' />
                  </div>
                  <div>
                    <CardTitle>Interview Settings</CardTitle>
                    <CardDescription>
                      Customize your AI interview experience
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Interview Type */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Interview Type
                  </label>
                  <select
                    value={interviewConfig.interviewType}
                    onChange={e =>
                      setInterviewConfig({
                        ...interviewConfig,
                        interviewType: e.target.value,
                      })
                    }
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                  >
                    {interviewTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Language
                  </label>
                  <select
                    value={interviewConfig.language}
                    onChange={e =>
                      setInterviewConfig({
                        ...interviewConfig,
                        language: e.target.value,
                      })
                    }
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                  >
                    <option value='english'>English</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Region
                  </label>
                  <select
                    value={interviewConfig.region}
                    onChange={e =>
                      setInterviewConfig({
                        ...interviewConfig,
                        region: e.target.value,
                      })
                    }
                    className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                  >
                    <option value='india'>India</option>
                  </select>
                </div>

                {/* Complexity */}
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Difficulty Level
                  </label>
                  <div className='grid grid-cols-3 gap-4'>
                    {['beginner', 'intermediate', 'pro'].map(level => (
                      <button
                        key={level}
                        onClick={() =>
                          setInterviewConfig({
                            ...interviewConfig,
                            complexity: level,
                          })
                        }
                        className={`rounded-lg border-2 px-4 py-3 font-medium transition-all ${
                          interviewConfig.complexity === level
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Summary */}
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                  <h4 className='mb-2 font-semibold text-gray-900'>
                    Your Profile
                  </h4>
                  <p className='text-sm text-gray-600'>{userProfile.name}</p>
                  {userProfile.skills && userProfile.skills.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-1'>
                      {userProfile.skills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                        >
                          {skill}
                        </span>
                      ))}
                      {userProfile.skills.length > 5 && (
                        <span className='rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600'>
                          +{userProfile.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <Alert className='border-red-200 bg-red-50 text-red-800'>
                    <AlertCircle className='h-4 w-4' />
                    <p className='ml-2 font-medium'>{error}</p>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className='flex gap-4 pt-4'>
                  <Button
                    onClick={() => {
                      setShowInterviewConfig(false);
                      setSelectedOption(null);
                    }}
                    variant='outline'
                    className='flex-1'
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleStartInterview}
                    disabled={loading}
                    className='flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                  >
                    {loading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Starting...
                      </>
                    ) : (
                      <>
                        Start Interview
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900 lg:text-4xl'>
            Interview Preparation
          </h1>
          <p className='text-xl text-gray-600'>
            Choose how you want to proceed with your interview
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mx-auto mb-6 max-w-4xl'>
            <Alert className='border-red-200 bg-red-50 text-red-800'>
              <AlertCircle className='h-4 w-4' />
              <p className='ml-2 font-medium'>{error}</p>
            </Alert>
          </div>
        )}

        <div className='mx-auto max-w-4xl'>
          {!selectedOption && !resumeData ? (
            // Option Selection Screen
            <div className='space-y-6'>
              {userProfile ? (
                // User has existing profile - show both options
                <>
                  <div className='grid gap-6 md:grid-cols-2'>
                    {/* Use Existing Profile */}
                    <button
                      onClick={handleUseExistingProfile}
                      className='group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
                    >
                      <div className='absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 transition-transform duration-300 group-hover:scale-150'></div>
                      <div className='relative'>
                        <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500'>
                          <User className='h-10 w-10 text-white' />
                        </div>
                        <h3 className='mb-3 text-xl font-bold text-gray-900'>
                          Use Existing Profile
                        </h3>
                        <p className='mb-4 text-gray-600'>
                          Continue with your saved profile information
                        </p>
                        <div className='rounded-lg bg-gray-50 p-4 text-left'>
                          <p className='mb-2 text-sm font-semibold text-gray-700'>
                            Your Profile:
                          </p>
                          <p className='text-sm text-gray-600'>
                            {userProfile.name}
                          </p>
                          {userProfile.skills &&
                            userProfile.skills.length > 0 && (
                              <p className='mt-1 text-xs text-gray-500'>
                                {userProfile.skills.slice(0, 3).join(', ')}
                                {userProfile.skills.length > 3 && '...'}
                              </p>
                            )}
                        </div>
                        <div className='mt-6'>
                          <span className='inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800'>
                            ✓ Profile Complete
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Upload New Resume */}
                    <button
                      onClick={handleUploadNewResume}
                      className='group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
                    >
                      <div className='absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 opacity-10 transition-transform duration-300 group-hover:scale-150'></div>
                      <div className='relative'>
                        <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500'>
                          <Upload className='h-10 w-10 text-white' />
                        </div>
                        <h3 className='mb-3 text-xl font-bold text-gray-900'>
                          Upload New Resume
                        </h3>
                        <p className='mb-4 text-gray-600'>
                          Upload a fresh resume to update your profile and start
                          interview
                        </p>
                        <div className='rounded-lg bg-gray-50 p-4'>
                          <ul className='space-y-2 text-left text-sm text-gray-600'>
                            <li className='flex items-center gap-2'>
                              <FileText className='h-4 w-4 text-green-600' />
                              Auto-extract information
                            </li>
                            <li className='flex items-center gap-2'>
                              <FileText className='h-4 w-4 text-green-600' />
                              Update your profile
                            </li>
                            <li className='flex items-center gap-2'>
                              <FileText className='h-4 w-4 text-green-600' />
                              Review before proceeding
                            </li>
                          </ul>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className='text-center'>
                    <p className='text-sm text-gray-500'>
                      You can update your profile anytime from the Profile page
                    </p>
                  </div>
                </>
              ) : (
                // User has no profile - must upload resume first
                <div className='rounded-2xl bg-white p-8 shadow-xl'>
                  <div className='mx-auto max-w-2xl text-center'>
                    <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500'>
                      <AlertCircle className='h-12 w-12 text-white' />
                    </div>
                    <h3 className='mb-4 text-2xl font-bold text-gray-900'>
                      Profile Required
                    </h3>
                    <p className='mb-8 text-lg text-gray-600'>
                      You need to create your profile first before starting an
                      interview. Please upload your resume to get started.
                    </p>
                    <Button
                      onClick={handleUploadNewResume}
                      className='bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg hover:from-blue-700 hover:to-purple-700'
                    >
                      <Upload className='mr-2 h-5 w-5' />
                      Upload Resume Now
                    </Button>
                    <p className='mt-6 text-sm text-gray-500'>
                      Or you can create your profile manually from the{' '}
                      <a
                        href='/profile'
                        className='font-medium text-blue-600 hover:underline'
                      >
                        Profile page
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : showUpload && !resumeData ? (
            // Show Upload Component
            <div className='rounded-2xl bg-white p-8 shadow-xl'>
              <div className='mb-6'>
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setSelectedOption(null);
                  }}
                  className='text-sm text-gray-600 hover:text-gray-900'
                >
                  ← Back to options
                </button>
              </div>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          ) : resumeData ? (
            // Show Resume Form for review/edit
            <div className='rounded-2xl bg-white p-8 shadow-xl'>
              <div className='mb-6'>
                <button
                  onClick={() => {
                    setResumeData(null);
                    setSelectedOption(null);
                    setShowUpload(false);
                  }}
                  className='text-sm text-gray-600 hover:text-gray-900'
                >
                  ← Back to options
                </button>
              </div>
              <div className='mb-6'>
                <Alert className='border-blue-200 bg-blue-50 text-blue-800'>
                  <FileText className='h-4 w-4' />
                  <p className='ml-2 font-medium'>
                    Review your information and click "Proceed to Interview" to
                    continue
                  </p>
                </Alert>
              </div>
              <ResumeForm
                resumeData={resumeData}
                onSave={handleProceedToInterview}
                isProfile={false}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InterviewForm;
