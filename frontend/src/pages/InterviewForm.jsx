import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, User, Mail, Briefcase, FileText, ArrowRight, X, GraduationCap, MapPin, Phone, Building2 } from 'lucide-react'

const InterviewForm = () => {
   const navigate = useNavigate()
   const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      position: '',
      experience: '',
      education: '',
      university: '',
      graduationYear: '',
      currentCompany: '',
      currentRole: '',
      skills: '',
      preferredLanguage: 'english',
      interviewType: 'technical',
      cv: null
   })
   const [dragActive, setDragActive] = useState(false)

   const handleInputChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      })
   }

   const handleDrag = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
         setDragActive(true)
      } else if (e.type === "dragleave") {
         setDragActive(false)
      }
   }

   const handleDrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         setFormData({ ...formData, cv: e.dataTransfer.files[0] })
      }
   }

   const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
         setFormData({ ...formData, cv: e.target.files[0] })
      }
   }

   const removeFile = () => {
      setFormData({ ...formData, cv: null })
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      // Store form data in localStorage for mock functionality
      localStorage.setItem('interviewData', JSON.stringify({
         ...formData,
         cv: formData.cv ? { name: formData.cv.name, size: formData.cv.size } : null
      }))
      navigate('/interview')
   }

   const isFormValid = formData.fullName && formData.email && formData.phone && formData.position &&
      formData.experience && formData.education && formData.skills && formData.cv

   return (
      <div className="min-h-screen py-8 lg:py-12">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-12">
               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                  Tell Us About Yourself
               </h1>
               <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
                  Provide comprehensive details to get the most personalized AI interview experience
               </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-12">
               <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Personal Information */}
                  <div>
                     <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <User className="w-6 h-6 text-blue-600" />
                        Personal Information
                     </h2>
                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                           <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                              Full Name *
                           </label>
                           <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
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
                                 onChange={handleInputChange}
                                 placeholder="your@email.com"
                                 className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                 required
                              />
                           </div>
                        </div>
                        <div>
                           <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                              Phone Number *
                           </label>
                           <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                 type="tel"
                                 id="phone"
                                 name="phone"
                                 value={formData.phone}
                                 onChange={handleInputChange}
                                 placeholder="+1 (555) 123-4567"
                                 className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                 required
                              />
                           </div>
                        </div>
                        <div className="lg:col-span-2">
                           <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                              Location
                           </label>
                           <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                 type="text"
                                 id="location"
                                 name="location"
                                 value={formData.location}
                                 onChange={handleInputChange}
                                 placeholder="City, State, Country"
                                 className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                     <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                        Professional Information
                     </h2>
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                           <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-2">
                              Position Applied For *
                           </label>
                           <input
                              type="text"
                              id="position"
                              name="position"
                              value={formData.position}
                              onChange={handleInputChange}
                              placeholder="e.g., Software Engineer, Data Scientist"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              required
                           />
                        </div>
                        <div>
                           <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
                              Years of Experience *
                           </label>
                           <select
                              id="experience"
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              required
                           >
                              <option value="">Select experience level</option>
                              <option value="0-1">0-1 years (Entry Level)</option>
                              <option value="2-3">2-3 years (Junior)</option>
                              <option value="4-6">4-6 years (Mid Level)</option>
                              <option value="7-10">7-10 years (Senior)</option>
                              <option value="10+">10+ years (Expert)</option>
                           </select>
                        </div>
                        <div>
                           <label htmlFor="currentCompany" className="block text-sm font-medium text-slate-700 mb-2">
                              Current Company
                           </label>
                           <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                 type="text"
                                 id="currentCompany"
                                 name="currentCompany"
                                 value={formData.currentCompany}
                                 onChange={handleInputChange}
                                 placeholder="Current employer"
                                 className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              />
                           </div>
                        </div>
                        <div>
                           <label htmlFor="currentRole" className="block text-sm font-medium text-slate-700 mb-2">
                              Current Role
                           </label>
                           <input
                              type="text"
                              id="currentRole"
                              name="currentRole"
                              value={formData.currentRole}
                              onChange={handleInputChange}
                              placeholder="Your current job title"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Educational Background */}
                  <div>
                     <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                        Educational Background
                     </h2>
                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                           <label htmlFor="education" className="block text-sm font-medium text-slate-700 mb-2">
                              Highest Education *
                           </label>
                           <select
                              id="education"
                              name="education"
                              value={formData.education}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              required
                           >
                              <option value="">Select education level</option>
                              <option value="high-school">High School</option>
                              <option value="associate">Associate Degree</option>
                              <option value="bachelor">Bachelor's Degree</option>
                              <option value="master">Master's Degree</option>
                              <option value="phd">PhD</option>
                              <option value="other">Other</option>
                           </select>
                        </div>
                        <div>
                           <label htmlFor="university" className="block text-sm font-medium text-slate-700 mb-2">
                              University/Institution
                           </label>
                           <input
                              type="text"
                              id="university"
                              name="university"
                              value={formData.university}
                              onChange={handleInputChange}
                              placeholder="Name of your institution"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                           />
                        </div>
                        <div>
                           <label htmlFor="graduationYear" className="block text-sm font-medium text-slate-700 mb-2">
                              Graduation Year
                           </label>
                           <input
                              type="number"
                              id="graduationYear"
                              name="graduationYear"
                              value={formData.graduationYear}
                              onChange={handleInputChange}
                              placeholder="2024"
                              min="1950"
                              max="2030"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Technical Skills */}
                  <div>
                     <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-6">
                        Technical Skills & Preferences
                     </h2>
                     <div className="space-y-6">
                        <div>
                           <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-2">
                              Key Skills & Technologies *
                           </label>
                           <textarea
                              id="skills"
                              name="skills"
                              value={formData.skills}
                              onChange={handleInputChange}
                              placeholder="e.g., JavaScript, React, Node.js, Python, SQL, AWS, etc."
                              rows="3"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              required
                           />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                           <div>
                              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-slate-700 mb-2">
                                 Interview Language
                              </label>
                              <select
                                 id="preferredLanguage"
                                 name="preferredLanguage"
                                 value={formData.preferredLanguage}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              >
                                 <option value="english">English</option>
                                 <option value="spanish">Spanish</option>
                                 <option value="french">French</option>
                                 <option value="german">German</option>
                                 <option value="hindi">Hindi</option>
                              </select>
                           </div>
                           <div>
                              <label htmlFor="interviewType" className="block text-sm font-medium text-slate-700 mb-2">
                                 Interview Focus
                              </label>
                              <select
                                 id="interviewType"
                                 name="interviewType"
                                 value={formData.interviewType}
                                 onChange={handleInputChange}
                                 className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              >
                                 <option value="technical">Technical Interview</option>
                                 <option value="behavioral">Behavioral Interview</option>
                                 <option value="mixed">Mixed (Technical + Behavioral)</option>
                                 <option value="leadership">Leadership Interview</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* CV Upload */}
                  <div>
                     <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        Upload Your Resume/CV *
                     </h2>

                     {!formData.cv ? (
                        <div
                           className={`border-2 border-dashed rounded-xl p-8 lg:p-12 text-center transition-all duration-300 ${dragActive
                              ? 'border-blue-500 bg-blue-50 scale-105'
                              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                              }`}
                           onDragEnter={handleDrag}
                           onDragLeave={handleDrag}
                           onDragOver={handleDrag}
                           onDrop={handleDrop}
                        >
                           <Upload className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                           <p className="text-xl font-medium text-slate-700 mb-3">
                              Drag & drop your resume here
                           </p>
                           <p className="text-slate-500 mb-6">
                              Supports PDF, DOC, DOCX (Max 10MB)
                           </p>
                           <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer inline-block text-lg">
                              Browse Files
                              <input
                                 type="file"
                                 className="hidden"
                                 accept=".pdf,.doc,.docx"
                                 onChange={handleFileChange}
                              />
                           </label>
                        </div>
                     ) : (
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-green-600" />
                                 </div>
                                 <div>
                                    <p className="font-semibold text-slate-900 text-lg">{formData.cv.name}</p>
                                    <p className="text-sm text-slate-500">
                                       {(formData.cv.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                                    </p>
                                 </div>
                              </div>
                              <button
                                 type="button"
                                 onClick={removeFile}
                                 className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-200"
                              >
                                 <X className="w-5 h-5 text-red-600" />
                              </button>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-8">
                     <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`px-12 py-4 rounded-xl font-semibold flex items-center gap-3 text-lg transition-all duration-300 ${isFormValid
                           ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105 transform'
                           : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                           }`}
                     >
                        Start AI Interview
                        <ArrowRight className="w-6 h-6" />
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}

export default InterviewForm
