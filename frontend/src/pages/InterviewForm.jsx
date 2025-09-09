import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import StepNavigation from '../components/interview/StepNavigation';
import PersonalInfo from '../components/interview/PersonalInfo';
import ProfessionalEducation from '../components/interview/ProfessionalEducation';
import DocumentUpload from '../components/interview/DocumentUpload';
import StepButtons from '../components/interview/StepButtons';

const InterviewForm = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    position: '',
    experience: '',
    currentCompany: '',
    currentRole: '',
    education: '',
    university: '',
    graduationYear: '',
    skills: '',
    cv: null,
    identityCard: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [idDragActive, setIdDragActive] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Auto-fill user details from Clerk
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName:
          user.fullName ||
          `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.primaryEmailAddress?.emailAddress || '',
      }));
    }
  }, [user]);

  // Step validation functions
  const validateStep1 = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.phone &&
      formData.city &&
      formData.state &&
      isPhoneVerified
    );
  };

  const validateStep2 = () => {
    return (
      formData.position &&
      formData.experience &&
      formData.education &&
      formData.skills
    );
  };

  const validateStep3 = () => {
    return formData.cv && formData.identityCard;
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleIdDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIdDragActive(true);
    } else if (e.type === 'dragleave') {
      setIdDragActive(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, cv: e.dataTransfer.files[0] });
    }
  };

  const handleIdDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIdDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, identityCard: e.dataTransfer.files[0] });
    }
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, cv: e.target.files[0] });
    }
  };

  const handleIdFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, identityCard: e.target.files[0] });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, cv: null });
  };

  const removeIdFile = () => {
    setFormData({ ...formData, identityCard: null });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateStep3()) {
      // Store form data in localStorage for mock functionality
      localStorage.setItem(
        'interviewData',
        JSON.stringify({
          ...formData,
          cv: formData.cv
            ? { name: formData.cv.name, size: formData.cv.size }
            : null,
          identityCard: formData.identityCard
            ? {
                name: formData.identityCard.name,
                size: formData.identityCard.size,
              }
            : null,
        }),
      );
      navigate('/interview');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfo
            formData={formData}
            onChange={handleInputChange}
            onPhoneVerificationChange={setIsPhoneVerified}
          />
        );
      case 2:
        return (
          <ProfessionalEducation
            formData={formData}
            onChange={handleInputChange}
          />
        );
      case 3:
        return (
          <DocumentUpload
            formData={formData}
            dragActive={dragActive}
            idDragActive={idDragActive}
            handleDrag={handleDrag}
            handleIdDrag={handleIdDrag}
            handleDrop={handleDrop}
            handleIdDrop={handleIdDrop}
            handleFileChange={handleFileChange}
            handleIdFileChange={handleIdFileChange}
            removeFile={removeFile}
            removeIdFile={removeIdFile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen py-8 lg:py-12'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8 text-center lg:mb-12'>
          <h1 className='mb-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl'>
            AI Interview for Tech Professionals
          </h1>
          <p className='mx-auto max-w-3xl text-lg text-slate-600 lg:text-xl'>
            Get personalized AI interviews for Web Development, App Development,
            AI/ML, and Data Science roles
          </p>
        </div>

        {/* Step Navigation */}
        <StepNavigation
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Form */}
        <div className='rounded-2xl bg-white p-6 shadow-xl lg:p-12'>
          <form onSubmit={handleSubmit}>
            {renderCurrentStep()}

            <StepButtons
              currentStep={currentStep}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              canProceed={canProceedToNextStep()}
              isLastStep={currentStep === 3}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewForm;
