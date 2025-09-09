import React from 'react';
import { Upload, FileText, CreditCard, X } from 'lucide-react';

const DocumentUpload = ({
  formData,
  dragActive,
  idDragActive,
  handleDrag,
  handleIdDrag,
  handleDrop,
  handleIdDrop,
  handleFileChange,
  handleIdFileChange,
  removeFile,
  removeIdFile,
}) => {
  return (
    <div className='space-y-10'>
      <div className='mb-8 text-center'>
        <h2 className='mb-2 text-2xl font-bold text-slate-900 lg:text-3xl'>
          Upload Documents
        </h2>
        <p className='text-slate-600'>
          Upload your resume and identity verification documents
        </p>
      </div>

      {/* CV Upload */}
      <div>
        <h3 className='mb-6 flex items-center gap-3 text-xl font-semibold text-slate-900'>
          <FileText className='h-5 w-5 text-blue-600' />
          Upload Your Resume/CV *
        </h3>

        {!formData.cv ? (
          <div
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 lg:p-12 ${
              dragActive
                ? 'scale-105 border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className='mx-auto mb-6 h-16 w-16 text-slate-400' />
            <p className='mb-3 text-xl font-medium text-slate-700'>
              Drag & drop your resume here
            </p>
            <p className='mb-6 text-slate-500'>
              Supports PDF, DOC, DOCX (Max 10MB)
            </p>
            <label className='inline-block cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'>
              Browse Files
              <input
                type='file'
                className='hidden'
                accept='.pdf,.doc,.docx'
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className='rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-green-100'>
                  <FileText className='h-8 w-8 text-green-600' />
                </div>
                <div>
                  <p className='text-lg font-semibold text-slate-900'>
                    {formData.cv.name}
                  </p>
                  <p className='text-sm text-slate-500'>
                    {(formData.cv.size / 1024 / 1024).toFixed(2)} MB • Uploaded
                    successfully
                  </p>
                </div>
              </div>
              <button
                type='button'
                onClick={removeFile}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100 transition-all duration-200 hover:bg-red-200'
              >
                <X className='h-5 w-5 text-red-600' />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Identity Card Upload */}
      <div>
        <h3 className='mb-6 flex items-center gap-3 text-xl font-semibold text-slate-900'>
          <CreditCard className='h-5 w-5 text-blue-600' />
          Upload Identity Card *
        </h3>
        <p className='mb-4 text-slate-600'>
          Upload a Government ID (Aadhaar, PAN, Driving License) or College ID
          for identity verification
        </p>

        {!formData.identityCard ? (
          <div
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 lg:p-12 ${
              idDragActive
                ? 'scale-105 border-purple-500 bg-purple-50'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }`}
            onDragEnter={handleIdDrag}
            onDragLeave={handleIdDrag}
            onDragOver={handleIdDrag}
            onDrop={handleIdDrop}
          >
            <CreditCard className='mx-auto mb-6 h-16 w-16 text-slate-400' />
            <p className='mb-3 text-xl font-medium text-slate-700'>
              Drag & drop your identity card here
            </p>
            <p className='mb-6 text-slate-500'>
              Supports JPG, PNG, PDF (Max 5MB)
            </p>
            <label className='inline-block cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'>
              Browse Files
              <input
                type='file'
                className='hidden'
                accept='.jpg,.jpeg,.png,.pdf'
                onChange={handleIdFileChange}
              />
            </label>
          </div>
        ) : (
          <div className='rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100'>
                  <CreditCard className='h-8 w-8 text-purple-600' />
                </div>
                <div>
                  <p className='text-lg font-semibold text-slate-900'>
                    {formData.identityCard.name}
                  </p>
                  <p className='text-sm text-slate-500'>
                    {(formData.identityCard.size / 1024 / 1024).toFixed(2)} MB •
                    Identity card uploaded
                  </p>
                </div>
              </div>
              <button
                type='button'
                onClick={removeIdFile}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100 transition-all duration-200 hover:bg-red-200'
              >
                <X className='h-5 w-5 text-red-600' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
