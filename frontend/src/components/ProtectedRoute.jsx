import React from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Lock, Shield } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50'>
          <div className='mx-4 w-full max-w-md'>
            <div className='rounded-2xl bg-white p-8 text-center shadow-xl'>
              <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600'>
                <Lock className='h-8 w-8 text-white' />
              </div>

              <h2 className='mb-4 text-2xl font-bold text-slate-900'>
                Authentication Required
              </h2>

              <p className='mb-6 text-slate-600'>
                You need to sign in to access the interview platform and start
                practicing with our AI interviewer.
              </p>

              <div className='space-y-4'>
                <SignInButton mode='modal'>
                  <button className='flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg'>
                    <Shield className='h-5 w-5' />
                    Sign In to Continue
                  </button>
                </SignInButton>

                <p className='text-sm text-slate-500'>
                  New to InterviewAI? Signing up is free and takes less than a
                  minute.
                </p>
              </div>

              <div className='mt-8 rounded-xl bg-slate-50 p-4'>
                <h3 className='mb-2 font-semibold text-slate-900'>
                  What you'll get:
                </h3>
                <ul className='space-y-1 text-sm text-slate-600'>
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
  );
};

export default ProtectedRoute;
