import React, { useState, useEffect } from 'react';
import { Shield, X, Check, Phone } from 'lucide-react';

const OtpModal = ({ isOpen, onClose, phoneNumber, onVerificationSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setCountdown(30);
      setCanResend(false);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`modal-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`modal-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsVerifying(true);
      // Simulate OTP verification
      setTimeout(() => {
        setIsVerifying(false);
        onVerificationSuccess();
        onClose();
      }, 1500);
    }
  };

  const handleResendOtp = () => {
    setCountdown(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    console.log('OTP resent to:', phoneNumber);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='mx-auto w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-200 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
              <Shield className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-slate-900'>
                Verify Phone Number
              </h3>
              <p className='text-sm text-slate-500'>Enter the 6-digit code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-slate-100'
          >
            <X className='h-5 w-5 text-slate-500' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Phone Number Display */}
          <div className='mb-6 rounded-lg bg-blue-50 p-4'>
            <div className='flex items-center gap-3'>
              <Phone className='h-5 w-5 text-blue-600' />
              <div>
                <p className='text-sm font-medium text-blue-900'>OTP sent to</p>
                <p className='text-lg font-bold text-blue-900'>{phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* OTP Input */}
          <div className='mb-6'>
            <label className='mb-3 block text-sm font-medium text-slate-700'>
              Enter 6-digit OTP
            </label>
            <div className='flex justify-center gap-3'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`modal-otp-${index}`}
                  type='text'
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className='h-14 w-12 rounded-lg border-2 border-slate-300 text-center text-xl font-bold transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  maxLength='1'
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={otp.join('').length !== 6 || isVerifying}
            className={`mb-4 w-full rounded-xl py-3 text-lg font-semibold transition-all duration-300 ${
              otp.join('').length === 6 && !isVerifying
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:scale-105 hover:shadow-lg'
                : 'cursor-not-allowed bg-slate-300 text-slate-500'
            }`}
          >
            {isVerifying ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                Verifying...
              </div>
            ) : (
              <div className='flex items-center justify-center gap-2'>
                <Check className='h-5 w-5' />
                Verify OTP
              </div>
            )}
          </button>

          {/* Resend OTP */}
          <div className='text-center'>
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className='font-medium text-blue-600 transition-colors hover:text-blue-800'
              >
                Resend OTP
              </button>
            ) : (
              <p className='text-sm text-slate-500'>
                Resend OTP in {countdown} seconds
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
