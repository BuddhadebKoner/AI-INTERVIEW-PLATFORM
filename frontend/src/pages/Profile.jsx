import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit3,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  User as UserIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { userApi } from '../api/userApi';
import FileUpload from '../components/FileUpload';
import ResumeForm from '../components/ResumeForm';
import { Alert } from '../components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Interviews', icon: Calendar },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Profile', icon: UserIcon },
  { label: 'Settings', icon: Settings },
];

const Profile = () => {
  motion;

  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const displayName = userProfile?.name || user?.fullName || 'Candidate';
  const email = userProfile?.email || user?.primaryEmailAddress?.emailAddress;
  const role = userProfile?.experience?.[0]?.position || 'Interview Candidate';
  const company = userProfile?.experience?.[0]?.company || 'Open to opportunities';
  const skillCount = userProfile?.skills?.length || 0;
  const completion = Math.min(
    100,
    35 +
      (userProfile?.summary ? 15 : 0) +
      (skillCount > 0 ? 20 : 0) +
      (userProfile?.experience?.length ? 15 : 0) +
      (userProfile?.education?.length ? 15 : 0),
  );

  const memberSince = useMemo(() => {
    const value = userProfile?.createdAt || user?.createdAt;
    return value ? new Date(value).toLocaleDateString() : 'Recently';
  }, [userProfile?.createdAt, user?.createdAt]);

  const stats = [
    { icon: CheckCircle2, label: 'Completed Interviews', value: '0', detail: 'Ready for first session' },
    { icon: TrendingUp, label: 'Average Score', value: 'N/A', detail: 'Score appears after review' },
    { icon: Target, label: 'Confidence', value: `${completion}%`, detail: 'Profile readiness' },
    { icon: Clock, label: 'Total Practice Time', value: '0 min', detail: 'Practice history' },
  ];

  const skillProgress = [
    { label: 'Communication', value: completion },
    { label: 'Technical Depth', value: skillCount ? Math.min(92, 48 + skillCount * 6) : 42 },
    { label: 'Resume Fit', value: userProfile ? 78 : 28 },
  ];

  if (loading && !userProfile) {
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
              <nav className='space-y-1'>
                {navItems.map(({ label, icon: Icon }) => {
                  Icon;

                  return (
                    <button
                      key={label}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                        label === 'Overview'
                          ? 'bg-slate-950 text-white shadow-lg shadow-slate-300/70'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <Icon className='h-4 w-4' />
                      {label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <main className='space-y-6'>
          <div className='flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-lg shadow-slate-200/60 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5'>
            <div>
              <p className='text-sm font-medium text-slate-500'>Dashboard</p>
              <h1 className='text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl'>
                Welcome back, {displayName.split(' ')[0]}
              </h1>
            </div>
            <div className='flex items-center gap-2 sm:gap-3'>
              <div className='hidden h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-500 shadow-sm md:flex'>
                <Search className='h-4 w-4' />
                Search interviews
              </div>
              <Button variant='outline' size='icon' aria-label='Notifications'>
                <Bell className='h-4 w-4' />
              </Button>
              <Avatar className='h-11 w-11 border border-slate-200'>
                <AvatarImage src={user?.imageUrl} alt={displayName} />
                <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {error && (
            <Alert className='border-red-200 bg-red-50 text-red-800'>
              <p className='font-medium'>{error}</p>
            </Alert>
          )}

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
                      <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>{displayName}</h2>
                      <p className='mt-2 text-white/70'>{role} at {company}</p>
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
                  { icon: Calendar, label: `Member since ${memberSince}` },
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
          </motion.section>

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

          <section className='grid gap-6 xl:grid-cols-[1.15fr_0.85fr]'>
            <Card className='bg-white'>
              <CardHeader className='flex-row items-center justify-between space-y-0'>
                <div>
                  <CardTitle>Upcoming Interview</CardTitle>
                  <CardDescription>Start a new AI practice round when ready.</CardDescription>
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
                        Resume-aware questions, voice practice, and instant feedback after completion.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white'>
              <CardHeader>
                <CardTitle>Skill Progress</CardTitle>
                <CardDescription>Readiness signals based on your profile.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-5'>
                {skillProgress.map(item => (
                  <div key={item.label}>
                    <div className='mb-2 flex items-center justify-between text-sm'>
                      <span className='font-medium text-slate-700'>{item.label}</span>
                      <span className='text-slate-500'>{item.value}%</span>
                    </div>
                    <Progress value={item.value} className='bg-slate-100 [&>div]:bg-slate-950' />
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <Card className='bg-white'>
            <CardHeader className='gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <CardTitle>Resume & Profile Information</CardTitle>
                <CardDescription>Profile data powers resume-based interview questions.</CardDescription>
              </div>
              <div className='flex flex-col gap-2 sm:flex-row'>
                {userProfile && !isEditing && (
                  <Button variant='outline' onClick={handleEditProfile}>
                    <Edit3 className='h-4 w-4' />
                    Edit Profile
                  </Button>
                )}
                {!isEditing && (
                  <Button variant='gradient' onClick={() => setShowResumeUpload(!showResumeUpload)}>
                    <Upload className='h-4 w-4' />
                    {showResumeUpload ? 'Hide Upload' : 'Upload Resume'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showResumeUpload && !resumeData && !isEditing && (
                <div className='mb-6'>
                  <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>
              )}

              {resumeData || isEditing ? (
                <div>
                  {resumeData && (
                    <div className='mb-4 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700'>
                      <Award className='h-5 w-5' />
                      <span className='font-medium'>Resume data extracted successfully</span>
                    </div>
                  )}
                  <ResumeForm resumeData={resumeData} onSave={handleUpdateProfile} isProfile={true} />
                </div>
              ) : userProfile ? (
                <div className='space-y-8'>
                  {userProfile.summary && (
                    <div className='rounded-3xl border border-slate-200 bg-slate-50 p-6'>
                      <h4 className='mb-3 font-semibold text-slate-950'>Professional Summary</h4>
                      <p className='leading-7 text-slate-700'>{userProfile.summary}</p>
                    </div>
                  )}

                  {userProfile.skills && userProfile.skills.length > 0 && (
                    <div>
                      <h4 className='mb-3 font-semibold text-slate-950'>Skills</h4>
                      <div className='flex flex-wrap gap-2'>
                        {userProfile.skills.map((skill, index) => (
                          <Badge key={index} className='rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-100'>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {userProfile.experience && userProfile.experience.length > 0 && (
                    <div>
                      <h4 className='mb-4 flex items-center gap-2 font-semibold text-slate-950'>
                        <Briefcase className='h-5 w-5' />
                        Work Experience
                      </h4>
                      <div className='space-y-4'>
                        {userProfile.experience.map((exp, index) => (
                          <div key={index} className='rounded-3xl border border-slate-200 p-5'>
                            <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                              <div>
                                <h5 className='font-semibold text-slate-950'>{exp.position}</h5>
                                <p className='text-slate-600'>{exp.company}</p>
                              </div>
                              {exp.duration && (
                                <span className='w-fit rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600'>
                                  {exp.duration}
                                </span>
                              )}
                            </div>
                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <ul className='space-y-2'>
                                {exp.responsibilities.map((resp, idx) => (
                                  <li key={idx} className='flex gap-2 text-sm leading-6 text-slate-600'>
                                    <CheckCircle2 className='mt-1 h-4 w-4 shrink-0 text-indigo-600' />
                                    {resp}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {userProfile.education && userProfile.education.length > 0 && (
                    <div>
                      <h4 className='mb-4 flex items-center gap-2 font-semibold text-slate-950'>
                        <GraduationCap className='h-5 w-5' />
                        Education
                      </h4>
                      <div className='space-y-4'>
                        {userProfile.education.map((edu, index) => (
                          <div key={index} className='rounded-3xl border border-slate-200 p-5'>
                            <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                              <div>
                                <h5 className='font-semibold text-slate-950'>{edu.degree}</h5>
                                <p className='text-slate-600'>{edu.institution}</p>
                              </div>
                              {edu.year && (
                                <span className='w-fit rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600'>
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
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100'>
                      <FileText className='h-8 w-8 text-slate-500' />
                    </div>
                    <h4 className='mb-2 text-lg font-semibold text-slate-950'>Complete your profile</h4>
                    <p className='mx-auto mb-6 max-w-md text-slate-600'>
                      Upload your resume to auto-fill profile information and unlock better interview prompts.
                    </p>
                    <Button variant='gradient' onClick={() => setShowResumeUpload(true)}>
                      Get Started
                    </Button>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <section className='grid gap-6 xl:grid-cols-2'>
            <Card className='bg-white'>
              <CardHeader>
                <CardTitle>Recent Interviews Timeline</CardTitle>
                <CardDescription>Your interview activity will appear here.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='rounded-3xl border border-dashed border-slate-300 p-8 text-center'>
                  <UserIcon className='mx-auto h-10 w-10 text-slate-400' />
                  <h4 className='mt-4 font-semibold text-slate-950'>No interviews yet</h4>
                  <p className='mt-2 text-sm text-slate-600'>Start your first AI interview to build your history.</p>
                  <Button asChild variant='gradient' className='mt-6'>
                    <Link to='/form'>Start Interview</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white'>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>Completion certificates unlock after practice milestones.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {['Technical Interview Readiness', 'Behavioral Communication', 'Resume Mastery'].map((item, index) => (
                  <div key={item} className='flex items-center justify-between rounded-2xl border border-slate-200 p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500'>
                        <ShieldCheck className='h-5 w-5' />
                      </div>
                      <div>
                        <p className='font-medium text-slate-950'>{item}</p>
                        <p className='text-sm text-slate-500'>{index + 1} sessions required</p>
                      </div>
                    </div>
                    <Badge variant='outline' className='rounded-full text-slate-500'>Locked</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <Card className='bg-white'>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage dashboard preferences.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {['Email Notifications', 'Performance Analytics'].map((label, index) => (
                <div key={label}>
                  <div className='flex items-center justify-between gap-4 py-2'>
                    <div>
                      <h4 className='font-semibold text-slate-950'>{label}</h4>
                      <p className='text-sm text-slate-600'>
                        {index === 0 ? 'Receive updates about your interviews' : 'Track detailed interview metrics'}
                      </p>
                    </div>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <input type='checkbox' defaultChecked className='peer sr-only' />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-950 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-200" />
                    </label>
                  </div>
                  {index === 0 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Profile;
