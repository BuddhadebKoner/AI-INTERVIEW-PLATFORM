import { userApi } from '@/api/userApi';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

const ResumeForm = ({
  resumeData,
  onSave,
  isProfile = false,
  buttonText = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experience: [],
    education: [],
    summary: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (resumeData && resumeData.resume_data) {
      const data = resumeData.resume_data;
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        skills: data.skills || [],
        experience: data.experience || [],
        education: data.education || [],
        summary: data.summary || '',
      });
    }
  }, [resumeData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillsChange = value => {
    const skillsArray = value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills: skillsArray,
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    if (field === 'responsibilities') {
      updatedExperience[index][field] = value
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
    } else {
      updatedExperience[index][field] = value;
    }
    setFormData(prev => ({
      ...prev,
      experience: updatedExperience,
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData(prev => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log('Form Data to Save:', formData);

      if (onSave) {
        // If custom onSave is provided (for Profile page)
        await onSave(formData);
      } else {
        // Default behavior for InterviewForm - save to database
        const response = await userApi.saveProfile(formData);
        console.log('Profile saved:', response);
        setSuccess(true);

        // Optionally redirect or show success message
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isProfile ? 'Profile Information' : 'Extracted Resume Data'}
        </CardTitle>
        <CardDescription>
          {isProfile
            ? 'Review and update your profile information below'
            : 'Review and edit the extracted information before proceeding'}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Success Message */}
        {success && (
          <Alert className='border-green-200 bg-green-50 text-green-800'>
            <p className='font-medium'>✓ Profile saved successfully!</p>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className='border-red-200 bg-red-50 text-red-800'>
            <p className='font-medium'>✗ {error}</p>
          </Alert>
        )}

        {/* Basic Information */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <Input
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder='Enter your full name'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <Input
              type='email'
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder='Enter your email'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Phone</label>
            <Input
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              placeholder='Enter your phone number'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Location
            </label>
            <Input
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              placeholder='Enter your location'
            />
          </div>
        </div>

        {/* Skills */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>Skills</label>
          <Input
            value={formData.skills.join(', ')}
            onChange={e => handleSkillsChange(e.target.value)}
            placeholder='Enter skills separated by commas'
          />
          <div className='mt-2 flex flex-wrap gap-2'>
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className='rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-gray-700'>
            Experience
          </label>
          {formData.experience.map((exp, index) => (
            <div
              key={index}
              className='space-y-3 rounded-lg border border-gray-200 p-4'
            >
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <Input
                  value={exp.company || ''}
                  onChange={e =>
                    handleExperienceChange(index, 'company', e.target.value)
                  }
                  placeholder='Company name'
                />
                <Input
                  value={exp.position || ''}
                  onChange={e =>
                    handleExperienceChange(index, 'position', e.target.value)
                  }
                  placeholder='Position'
                />
              </div>
              <Input
                value={exp.duration || ''}
                onChange={e =>
                  handleExperienceChange(index, 'duration', e.target.value)
                }
                placeholder='Duration (e.g., Jan 2020 - Dec 2022)'
              />
              <textarea
                className='w-full resize-none rounded-md border border-gray-300 p-3'
                rows='3'
                value={exp.responsibilities?.join(', ') || ''}
                onChange={e =>
                  handleExperienceChange(
                    index,
                    'responsibilities',
                    e.target.value.split(', '),
                  )
                }
                placeholder='Key responsibilities (separated by commas)'
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-gray-700'>Education</label>
          {formData.education.map((edu, index) => (
            <div
              key={index}
              className='space-y-3 rounded-lg border border-gray-200 p-4'
            >
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <Input
                  value={edu.institution || ''}
                  onChange={e =>
                    handleEducationChange(index, 'institution', e.target.value)
                  }
                  placeholder='Institution name'
                />
                <Input
                  value={edu.degree || ''}
                  onChange={e =>
                    handleEducationChange(index, 'degree', e.target.value)
                  }
                  placeholder='Degree/Certification'
                />
              </div>
              <Input
                value={edu.year || ''}
                onChange={e =>
                  handleEducationChange(index, 'year', e.target.value)
                }
                placeholder='Year (e.g., 2022)'
              />
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Professional Summary
          </label>
          <div>
            <textarea
              className='w-full resize-none rounded-md border border-gray-300 p-3'
              rows='4'
              value={formData.summary}
              onChange={e => handleInputChange('summary', e.target.value)}
              placeholder='Brief professional summary...'
            />
          </div>
        </div>

        {/* Save Button */}
        <div className='flex justify-center pt-4'>
          <Button
            onClick={handleSave}
            disabled={loading}
            className={`px-8 ${
              isProfile
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
            }`}
          >
            {loading
              ? 'Saving...'
              : buttonText ||
                (isProfile ? 'Update Profile' : 'Proceed to Interview')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeForm;
