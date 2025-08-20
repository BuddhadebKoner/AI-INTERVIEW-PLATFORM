import React from 'react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Lock, Shield } from 'lucide-react'

const ProtectedRoute = ({ children }) => {
   return (
      <>
         <SignedIn>
            {children}
         </SignedIn>
         <SignedOut>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
               <div className="max-w-md w-full mx-4">
                  <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                     <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-white" />
                     </div>

                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Authentication Required
                     </h2>

                     <p className="text-slate-600 mb-6">
                        You need to sign in to access the interview platform and start practicing with our AI interviewer.
                     </p>

                     <div className="space-y-4">
                        <SignInButton mode="modal">
                           <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                              <Shield className="w-5 h-5" />
                              Sign In to Continue
                           </button>
                        </SignInButton>

                        <p className="text-sm text-slate-500">
                           New to InterviewAI? Signing up is free and takes less than a minute.
                        </p>
                     </div>

                     <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                        <h3 className="font-semibold text-slate-900 mb-2">What you'll get:</h3>
                        <ul className="text-sm text-slate-600 space-y-1">
                           <li>• Personalized AI interviews</li>
                           <li>• Real-time feedback</li>
                           <li>• Performance tracking</li>
                           <li>• CV-based questions</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </SignedOut>
      </>
   )
}

export default ProtectedRoute
