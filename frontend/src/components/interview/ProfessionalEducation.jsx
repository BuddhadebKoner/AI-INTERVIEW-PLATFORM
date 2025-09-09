import React from 'react';
import { Briefcase, Building2, GraduationCap } from 'lucide-react';

const ProfessionalEducation = ({ formData, onChange }) => {
  return (
    <div className='space-y-10'>
      <div className='mb-8 text-center'>
        <h2 className='mb-2 text-2xl font-bold text-slate-900 lg:text-3xl'>
          Professional & Educational Background
        </h2>
        <p className='text-slate-600'>
          Share your experience and qualifications
        </p>
      </div>

      {/* Professional Information */}
      <div>
        <h3 className='mb-6 flex items-center gap-3 text-xl font-semibold text-slate-900'>
          <Briefcase className='h-5 w-5 text-blue-600' />
          Professional Information
        </h3>
        <div className='grid gap-6 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='position'
              className='mb-2 block text-sm font-medium text-slate-700'
            >
              Position Applied For *
            </label>
            <input
              type='text'
              id='position'
              name='position'
              value={formData.position}
              onChange={onChange}
              placeholder='e.g., Software Engineer, Data Scientist'
              className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='experience'
              className='mb-2 block text-sm font-medium text-slate-700'
            >
              Years of Experience *
            </label>
            <select
              id='experience'
              name='experience'
              value={formData.experience}
              onChange={onChange}
              className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value=''>Select experience level</option>
              <option value='0-1'>0-1 years (Entry Level)</option>
              <option value='2-3'>2-3 years (Junior)</option>
              <option value='4-6'>4-6 years (Mid Level)</option>
              <option value='7-10'>7-10 years (Senior)</option>
              <option value='10+'>10+ years (Expert)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='currentCompany'
              className='mb-2 block text-sm font-medium text-slate-700'
            >
              Current Company
            </label>
            <div className='relative'>
              <Building2 className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
              <input
                type='text'
                id='currentCompany'
                name='currentCompany'
                value={formData.currentCompany}
                onChange={onChange}
                placeholder='Current employer'
                className='w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='currentRole'
              className='mb-2 block text-sm font-medium text-slate-700'
            >
              Current Role
            </label>
            <input
              type='text'
              id='currentRole'
              name='currentRole'
              value={formData.currentRole}
              onChange={onChange}
              placeholder='Your current job title'
              className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      </div>

      {/* Educational Background */}
      <div>
        <h3 className='mb-6 flex items-center gap-3 text-xl font-semibold text-slate-900'>
          <GraduationCap className='h-5 w-5 text-blue-600' />
          Educational Background
        </h3>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <div>
            <label
              htmlFor='education'
              className='mb-2 block text-sm font-medium text-slate-700'
            >
              Highest Education *
            </label>
            <select
              id='education'
              name='education'
              value={formData.education}
              onChange={onChange}
              className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value=''>Select education level</option>
              <option value='high-school'>High School</option>
              <option value='associate'>Associate Degree</option>
              <option value='bachelor'>Bachelor's Degree</option>
              <option value='master'>Master's Degree</option>
              <option value='phd'>PhD</option>
              <option value='other'>Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='university'
              className='mb-2 block text-sm font-medium text-slate-700'
            >
              University/Institution
            </label>
            <input
              type='text'
              id='university'
              name='university'
              value={formData.university}
              onChange={onChange}
              placeholder='Name of your institution'
              className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label
              htmlFor='graduationYear'
              className='mb-2 block text-sm font-medium text-slate-700'
            >
              Graduation Year
            </label>
            <input
              type='number'
              id='graduationYear'
              name='graduationYear'
              value={formData.graduationYear}
              onChange={onChange}
              placeholder='2024'
              min='1950'
              max='2030'
              className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      </div>

      {/* Technical Skills */}
      <div>
        <h3 className='mb-6 text-xl font-semibold text-slate-900'>
          Technical Skills & Technologies
        </h3>
        <div>
          <label
            htmlFor='skills'
            className='mb-2 block text-sm font-medium text-slate-700'
          >
            Key Skills & Technologies *
          </label>
          <textarea
            id='skills'
            name='skills'
            value={formData.skills}
            onChange={onChange}
            placeholder='e.g., JavaScript, React, Node.js, Python, SQL, AWS, etc.'
            rows='3'
            className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalEducation;
