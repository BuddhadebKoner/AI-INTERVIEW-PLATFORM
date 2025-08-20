import React, { useState, useEffect } from 'react'
import { Shield, X, Check, Phone } from 'lucide-react'

const OtpModal = ({ isOpen, onClose, phoneNumber, onVerificationSuccess }) => {
   const [otp, setOtp] = useState(['', '', '', '', '', ''])
   const [isVerifying, setIsVerifying] = useState(false)
   const [countdown, setCountdown] = useState(30)
   const [canResend, setCanResend] = useState(false)

   useEffect(() => {
      if (isOpen && countdown > 0) {
         const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
         return () => clearTimeout(timer)
      } else if (countdown === 0) {
         setCanResend(true)
      }
   }, [countdown, isOpen])

   useEffect(() => {
      if (isOpen) {
         setOtp(['', '', '', '', '', ''])
         setCountdown(30)
         setCanResend(false)
         setIsVerifying(false)
      }
   }, [isOpen])

   const handleOtpChange = (index, value) => {
      if (value.length <= 1 && /^\d*$/.test(value)) {
         const newOtp = [...otp]
         newOtp[index] = value
         setOtp(newOtp)

         // Auto-focus next input
         if (value && index < 5) {
            const nextInput = document.getElementById(`modal-otp-${index + 1}`)
            if (nextInput) nextInput.focus()
         }
      }
   }

   const handleOtpKeyDown = (index, e) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
         const prevInput = document.getElementById(`modal-otp-${index - 1}`)
         if (prevInput) prevInput.focus()
      }
   }

   const handleVerifyOtp = () => {
      const otpString = otp.join('')
      if (otpString.length === 6) {
         setIsVerifying(true)
         // Simulate OTP verification
         setTimeout(() => {
            setIsVerifying(false)
            onVerificationSuccess()
            onClose()
         }, 1500)
      }
   }

   const handleResendOtp = () => {
      setCountdown(30)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      console.log('OTP resent to:', phoneNumber)
   }

   if (!isOpen) return null

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                     <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                     <h3 className="text-lg font-semibold text-slate-900">Verify Phone Number</h3>
                     <p className="text-sm text-slate-500">Enter the 6-digit code</p>
                  </div>
               </div>
               <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
               >
                  <X className="w-5 h-5 text-slate-500" />
               </button>
            </div>

            {/* Content */}
            <div className="p-6">
               {/* Phone Number Display */}
               <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                     <Phone className="w-5 h-5 text-blue-600" />
                     <div>
                        <p className="text-sm font-medium text-blue-900">OTP sent to</p>
                        <p className="text-lg font-bold text-blue-900">{phoneNumber}</p>
                     </div>
                  </div>
               </div>

               {/* OTP Input */}
               <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                     Enter 6-digit OTP
                  </label>
                  <div className="flex gap-3 justify-center">
                     {otp.map((digit, index) => (
                        <input
                           key={index}
                           id={`modal-otp-${index}`}
                           type="text"
                           value={digit}
                           onChange={(e) => handleOtpChange(index, e.target.value)}
                           onKeyDown={(e) => handleOtpKeyDown(index, e)}
                           className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                           maxLength="1"
                        />
                     ))}
                  </div>
               </div>

               {/* Verify Button */}
               <button
                  onClick={handleVerifyOtp}
                  disabled={otp.join('').length !== 6 || isVerifying}
                  className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 mb-4 ${otp.join('').length === 6 && !isVerifying
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                     }`}
               >
                  {isVerifying ? (
                     <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                     </div>
                  ) : (
                     <div className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        Verify OTP
                     </div>
                  )}
               </button>

               {/* Resend OTP */}
               <div className="text-center">
                  {canResend ? (
                     <button
                        onClick={handleResendOtp}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                     >
                        Resend OTP
                     </button>
                  ) : (
                     <p className="text-slate-500 text-sm">
                        Resend OTP in {countdown} seconds
                     </p>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default OtpModal
