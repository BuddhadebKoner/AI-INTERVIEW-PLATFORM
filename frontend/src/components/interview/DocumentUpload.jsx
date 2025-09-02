import React from 'react'
import { Upload, FileText, CreditCard, X } from 'lucide-react'

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
   removeIdFile
}) => {
   return (
      <div className="space-y-10">
         <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Upload Documents</h2>
            <p className="text-slate-600">Upload your resume and identity verification documents</p>
         </div>

         {/* CV Upload */}
         <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
               <FileText className="w-5 h-5 text-blue-600" />
               Upload Your Resume/CV *
            </h3>

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

         {/* Identity Card Upload */}
         <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
               <CreditCard className="w-5 h-5 text-blue-600" />
               Upload Identity Card *
            </h3>
            <p className="text-slate-600 mb-4">
               Upload a Government ID (Aadhaar, PAN, Driving License) or College ID for identity verification
            </p>

            {!formData.identityCard ? (
               <div
                  className={`border-2 border-dashed rounded-xl p-8 lg:p-12 text-center transition-all duration-300 ${idDragActive
                     ? 'border-purple-500 bg-purple-50 scale-105'
                     : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                     }`}
                  onDragEnter={handleIdDrag}
                  onDragLeave={handleIdDrag}
                  onDragOver={handleIdDrag}
                  onDrop={handleIdDrop}
               >
                  <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                  <p className="text-xl font-medium text-slate-700 mb-3">
                     Drag & drop your identity card here
                  </p>
                  <p className="text-slate-500 mb-6">
                     Supports JPG, PNG, PDF (Max 5MB)
                  </p>
                  <label className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer inline-block text-lg">
                     Browse Files
                     <input
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleIdFileChange}
                     />
                  </label>
               </div>
            ) : (
               <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                           <CreditCard className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                           <p className="font-semibold text-slate-900 text-lg">{formData.identityCard.name}</p>
                           <p className="text-sm text-slate-500">
                              {(formData.identityCard.size / 1024 / 1024).toFixed(2)} MB • Identity card uploaded
                           </p>
                        </div>
                     </div>
                     <button
                        type="button"
                        onClick={removeIdFile}
                        className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-all duration-200"
                     >
                        <X className="w-5 h-5 text-red-600" />
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}

export default DocumentUpload
