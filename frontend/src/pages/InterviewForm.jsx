import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ResumeForm from '../components/ResumeForm';

const InterviewForm = () => {
  const [resumeData, setResumeData] = useState(null);

  const handleUploadSuccess = data => {
    setResumeData(data);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto py-8'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Interview Preparation
          </h1>
          <p className='text-gray-600'>Upload your resume to get started</p>
        </div>

        <div className='mx-auto max-w-4xl'>
          {resumeData ? (
            <ResumeForm resumeData={resumeData} />
          ) : (
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewForm;
