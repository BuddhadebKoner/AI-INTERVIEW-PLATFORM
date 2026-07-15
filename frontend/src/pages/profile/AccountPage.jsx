import {
  Briefcase,
  CheckCircle2,
  Edit3,
  FileText,
  GraduationCap,
  LogOut,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { userApi } from '../../api/userApi';
import FileUpload from '../../components/FileUpload';
import ResumeForm from '../../components/ResumeForm';
import { Alert } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { EmptyState } from './ProfileShared';

const ProfileDetails = ({ userProfile }) => (
  <Card className='bg-white'>
    <CardHeader>
      <CardTitle>Resume & Profile Information</CardTitle>
      <CardDescription>Your saved candidate profile.</CardDescription>
    </CardHeader>
    <CardContent className='space-y-8'>
      {userProfile.summary && (
        <div className='rounded-3xl border border-slate-200 bg-slate-50 p-6'>
          <h4 className='mb-3 font-semibold text-slate-950'>
            Professional Summary
          </h4>
          <p className='leading-7 text-slate-700'>{userProfile.summary}</p>
        </div>
      )}

      {userProfile.skills?.length > 0 && (
        <div>
          <h4 className='mb-3 font-semibold text-slate-950'>Skills</h4>
          <div className='flex flex-wrap gap-2'>
            {userProfile.skills.map((skill, index) => (
              <Badge
                key={`${skill}-${index}`}
                className='rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-100'
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {userProfile.experience?.length > 0 && (
        <div>
          <h4 className='mb-4 flex items-center gap-2 font-semibold text-slate-950'>
            <Briefcase className='h-5 w-5' />
            Work Experience
          </h4>
          <div className='space-y-4'>
            {userProfile.experience.map((exp, index) => (
              <div
                key={`${exp.company}-${exp.position}-${index}`}
                className='rounded-3xl border border-slate-200 p-5'
              >
                <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                  <div>
                    <h5 className='font-semibold text-slate-950'>
                      {exp.position}
                    </h5>
                    <p className='text-slate-600'>{exp.company}</p>
                  </div>
                  {exp.duration && (
                    <span className='w-fit rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600'>
                      {exp.duration}
                    </span>
                  )}
                </div>
                {exp.responsibilities?.length > 0 && (
                  <ul className='space-y-2'>
                    {exp.responsibilities.map((responsibility, idx) => (
                      <li
                        key={`${responsibility}-${idx}`}
                        className='flex gap-2 text-sm leading-6 text-slate-600'
                      >
                        <CheckCircle2 className='mt-1 h-4 w-4 shrink-0 text-indigo-600' />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {userProfile.education?.length > 0 && (
        <div>
          <h4 className='mb-4 flex items-center gap-2 font-semibold text-slate-950'>
            <GraduationCap className='h-5 w-5' />
            Education
          </h4>
          <div className='space-y-4'>
            {userProfile.education.map((edu, index) => (
              <div
                key={`${edu.institution}-${edu.degree}-${index}`}
                className='rounded-3xl border border-slate-200 p-5'
              >
                <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                  <div>
                    <h5 className='font-semibold text-slate-950'>
                      {edu.degree}
                    </h5>
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
    </CardContent>
  </Card>
);

const AccountPage = ({ userProfile, onProfileSaved, onLogout, loggingOut }) => {
  const [resumeData, setResumeData] = useState(null);
  const [showResumeUpload, setShowResumeUpload] = useState(!userProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setShowResumeUpload(false);
    }
  }, [userProfile]);

  const handleUploadSuccess = data => {
    setResumeData(data);
    setShowResumeUpload(false);
    setIsEditing(true);
    setNotice(
      'Resume data extracted successfully. Review and save your profile.',
    );
  };

  const handleUpdateProfile = async formData => {
    try {
      setSaving(true);
      setError(null);
      const response = await userApi.saveProfile(formData);
      if (response.success) {
        onProfileSaved(response.data);
        setResumeData(null);
        setIsEditing(false);
        setShowResumeUpload(false);
        setNotice('Profile saved successfully.');
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProfile = () => {
    if (userProfile) {
      setResumeData({ resume_data: userProfile });
      setIsEditing(true);
      setNotice(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-slate-950'>Account Profile</h2>
          <p className='mt-1 text-sm text-slate-600'>
            Profile data powers resume-based interview questions.
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onLogout}
            disabled={loggingOut || saving}
          >
            <LogOut className='h-4 w-4' />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </Button>
          {userProfile && !isEditing && (
            <Button variant='outline' onClick={handleEditProfile}>
              <Edit3 className='h-4 w-4' />
              Edit Profile
            </Button>
          )}
          {!isEditing && (
            <Button
              variant='gradient'
              onClick={() => setShowResumeUpload(value => !value)}
            >
              <Upload className='h-4 w-4' />
              {showResumeUpload ? 'Hide Upload' : 'Upload Resume'}
            </Button>
          )}
        </div>
      </div>

      {notice && (
        <Alert className='border-emerald-200 bg-emerald-50 text-emerald-800'>
          <p className='font-medium'>{notice}</p>
        </Alert>
      )}
      {error && (
        <Alert className='border-red-200 bg-red-50 text-red-800'>
          <p className='font-medium'>{error}</p>
        </Alert>
      )}

      {showResumeUpload && !resumeData && !isEditing && (
        <Card className='bg-white'>
          <CardContent className='p-6'>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </CardContent>
        </Card>
      )}

      {resumeData || isEditing ? (
        <Card className='bg-white'>
          <CardHeader>
            <CardTitle>
              {saving ? 'Saving profile...' : 'Review Profile Information'}
            </CardTitle>
            <CardDescription>
              Save these details before starting resume-aware interviews.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeForm
              resumeData={resumeData}
              onSave={handleUpdateProfile}
              isProfile={true}
            />
          </CardContent>
        </Card>
      ) : userProfile ? (
        <ProfileDetails userProfile={userProfile} />
      ) : (
        !showResumeUpload && (
          <EmptyState
            icon={FileText}
            title='Complete your profile'
            description='Upload your resume to auto-fill profile information and unlock better interview prompts.'
            action={
              <Button
                variant='gradient'
                onClick={() => setShowResumeUpload(true)}
              >
                Upload Resume
              </Button>
            }
          />
        )
      )}
    </div>
  );
};

export default AccountPage;
