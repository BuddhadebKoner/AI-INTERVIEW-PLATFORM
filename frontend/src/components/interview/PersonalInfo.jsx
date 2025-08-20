import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Check } from 'lucide-react'
import OtpModal from './OtpModal'

const PersonalInfo = ({ formData, onChange, onPhoneVerificationChange }) => {
   const [showOtpModal, setShowOtpModal] = useState(false)
   const [isPhoneVerified, setIsPhoneVerified] = useState(false)

   const handleSendOtp = () => {
      if (formData.phone && formData.phone.length >= 10) {
         setShowOtpModal(true)
         // Simulate sending OTP (in real app, you'd call your backend API)
         console.log('OTP sent to:', formData.phone)
      }
   }

   const handleOtpVerificationSuccess = () => {
      setIsPhoneVerified(true)
      if (onPhoneVerificationChange) {
         onPhoneVerificationChange(true)
      }
   }

   const handlePhoneChange = (e) => {
      onChange(e)
      // Reset verification if phone number changes
      if (isPhoneVerified) {
         setIsPhoneVerified(false)
         // Notify parent component about verification status
         if (onPhoneVerificationChange) {
            onPhoneVerificationChange(false)
         }
      }
   }
   return (
      <div className="space-y-6">
         <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Personal Information</h2>
            <p className="text-slate-600">Tell us about yourself</p>
         </div>

         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
               <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
               </label>
               <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
               />
            </div>

            <div>
               <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
               </label>
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={onChange}
                     placeholder="your@email.com"
                     className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                     required
                  />
               </div>
            </div>

            <div>
               <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number *
               </label>
               <div className="space-y-3">
                  <div className="relative">
                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                     <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="+91 98765 43210"
                        pattern="[+]91[0-9]{10}"
                        className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${isPhoneVerified
                              ? 'border-green-500 bg-green-50'
                              : 'border-slate-300'
                           }`}
                        required
                        disabled={isPhoneVerified}
                     />
                     {isPhoneVerified && (
                        <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                     )}
                  </div>

                  {/* Verify Button */}
                  {!isPhoneVerified && formData.phone && formData.phone.length >= 10 && (
                     <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                     >
                        Verify Phone Number
                     </button>
                  )}

                  {/* Verification Success */}
                  {isPhoneVerified && (
                     <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                           <Check className="w-4 h-4 text-green-600" />
                           <span className="text-sm font-medium text-green-900">
                              Mobile number verified successfully!
                           </span>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div>
               <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                  City *
               </label>
               <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                     type="text"
                     id="city"
                     name="city"
                     value={formData.city}
                     onChange={onChange}
                     placeholder="Mumbai, Delhi, Bangalore..."
                     className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                     required
                  />
               </div>
            </div>

            <div className="lg:col-span-2">
               <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
                  State *
               </label>
               <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
               >
                  <option value="">Select your state</option>
                  <option value="andhra-pradesh">Andhra Pradesh</option>
                  <option value="arunachal-pradesh">Arunachal Pradesh</option>
                  <option value="assam">Assam</option>
                  <option value="bihar">Bihar</option>
                  <option value="chhattisgarh">Chhattisgarh</option>
                  <option value="goa">Goa</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="haryana">Haryana</option>
                  <option value="himachal-pradesh">Himachal Pradesh</option>
                  <option value="jharkhand">Jharkhand</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="kerala">Kerala</option>
                  <option value="madhya-pradesh">Madhya Pradesh</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="manipur">Manipur</option>
                  <option value="meghalaya">Meghalaya</option>
                  <option value="mizoram">Mizoram</option>
                  <option value="nagaland">Nagaland</option>
                  <option value="odisha">Odisha</option>
                  <option value="punjab">Punjab</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="sikkim">Sikkim</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="telangana">Telangana</option>
                  <option value="tripura">Tripura</option>
                  <option value="uttar-pradesh">Uttar Pradesh</option>
                  <option value="uttarakhand">Uttarakhand</option>
                  <option value="west-bengal">West Bengal</option>
                  <option value="delhi">Delhi</option>
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
   )
}

export default PersonalInfo
