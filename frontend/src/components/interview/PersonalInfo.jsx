import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Check } from 'lucide-react';
import OtpModal from './OtpModal';

const PersonalInfo = ({ formData, onChange, onPhoneVerificationChange }) => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const handleSendOtp = () => {
    if (formData.phone && formData.phone.length >= 10) {
      setShowOtpModal(true);
      // Simulate sending OTP (in real app, you'd call your backend API)
      console.log('OTP sent to:', formData.phone);
    }
  };

  const handleOtpVerificationSuccess = () => {
    setIsPhoneVerified(true);
    if (onPhoneVerificationChange) {
      onPhoneVerificationChange(true);
    }
  };

  const handlePhoneChange = e => {
    onChange(e);
    // Reset verification if phone number changes
    if (isPhoneVerified) {
      setIsPhoneVerified(false);
      // Notify parent component about verification status
      if (onPhoneVerificationChange) {
        onPhoneVerificationChange(false);
      }
    }
  };
  return (
    <div className='space-y-6'>
      <div className='mb-8 text-center'>
        <h2 className='mb-2 text-2xl font-bold text-slate-900 lg:text-3xl'>
          Personal Information
        </h2>
        <p className='text-slate-600'>Tell us about yourself</p>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='lg:col-span-1'>
          <label
            htmlFor='fullName'
            className='mb-2 block text-sm font-medium text-slate-700'
          >
            Full Name *
          </label>
          <input
            type='text'
            id='fullName'
            name='fullName'
            value={formData.fullName}
            onChange={onChange}
            placeholder='Enter your full name'
            className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='mb-2 block text-sm font-medium text-slate-700'
          >
            Email Address *
          </label>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={onChange}
              placeholder='your@email.com'
              className='w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='phone'
            className='mb-2 block text-sm font-medium text-slate-700'
          >
            Mobile Number *
          </label>
          <div className='space-y-3'>
            <div className='relative'>
              <Phone className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
              <input
                type='tel'
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder='+91 98765 43210'
                pattern='[+]91[0-9]{10}'
                className={`w-full rounded-xl border py-3 pl-11 pr-12 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                  isPhoneVerified
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-300'
                }`}
                required
                disabled={isPhoneVerified}
              />
              {isPhoneVerified && (
                <Check className='absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-600' />
              )}
            </div>

            {/* Verify Button */}
            {!isPhoneVerified &&
              formData.phone &&
              formData.phone.length >= 10 && (
                <button
                  type='button'
                  onClick={handleSendOtp}
                  className='w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'
                >
                  Verify Phone Number
                </button>
              )}

            {/* Verification Success */}
            {isPhoneVerified && (
              <div className='rounded-lg border border-green-200 bg-green-50 p-3'>
                <div className='flex items-center gap-2'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span className='text-sm font-medium text-green-900'>
                    Mobile number verified successfully!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor='city'
            className='mb-2 block text-sm font-medium text-slate-700'
          >
            City *
          </label>
          <div className='relative'>
            <MapPin className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
            <input
              type='text'
              id='city'
              name='city'
              value={formData.city}
              onChange={onChange}
              placeholder='Mumbai, Delhi, Bangalore...'
              className='w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        </div>

        <div className='lg:col-span-2'>
          <label
            htmlFor='state'
            className='mb-2 block text-sm font-medium text-slate-700'
          >
            State *
          </label>
          <select
            id='state'
            name='state'
            value={formData.state}
            onChange={onChange}
            className='w-full rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value=''>Select your state</option>
            <option value='andhra-pradesh'>Andhra Pradesh</option>
            <option value='arunachal-pradesh'>Arunachal Pradesh</option>
            <option value='assam'>Assam</option>
            <option value='bihar'>Bihar</option>
            <option value='chhattisgarh'>Chhattisgarh</option>
            <option value='goa'>Goa</option>
            <option value='gujarat'>Gujarat</option>
            <option value='haryana'>Haryana</option>
            <option value='himachal-pradesh'>Himachal Pradesh</option>
            <option value='jharkhand'>Jharkhand</option>
            <option value='karnataka'>Karnataka</option>
            <option value='kerala'>Kerala</option>
            <option value='madhya-pradesh'>Madhya Pradesh</option>
            <option value='maharashtra'>Maharashtra</option>
            <option value='manipur'>Manipur</option>
            <option value='meghalaya'>Meghalaya</option>
            <option value='mizoram'>Mizoram</option>
            <option value='nagaland'>Nagaland</option>
            <option value='odisha'>Odisha</option>
            <option value='punjab'>Punjab</option>
            <option value='rajasthan'>Rajasthan</option>
            <option value='sikkim'>Sikkim</option>
            <option value='tamil-nadu'>Tamil Nadu</option>
            <option value='telangana'>Telangana</option>
            <option value='tripura'>Tripura</option>
            <option value='uttar-pradesh'>Uttar Pradesh</option>
            <option value='uttarakhand'>Uttarakhand</option>
            <option value='west-bengal'>West Bengal</option>
            <option value='delhi'>Delhi</option>
          </select>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        phoneNumber={formData.phone}
        onVerificationSuccess={handleOtpVerificationSuccess}
      />
    </div>
  );
};

export default PersonalInfo;
