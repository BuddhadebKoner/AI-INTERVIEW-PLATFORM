import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo */}
            <div className='flex items-center space-x-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600'>
                <span className='text-sm font-bold text-white'>AI</span>
              </div>
              <Link
                to='/'
                className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent'
              >
                InterviewAI
              </Link>
            </div>

            {/* Navigation & Authentication */}
            <div className='flex items-center space-x-3'>
              {/* Navigation */}
              <nav className='mr-3 hidden items-center space-x-3 md:flex'>
                <SignedIn>
                  <Link
                    to='/form'
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      location.pathname === '/form'
                        ? 'border border-blue-200 bg-blue-100 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    Start Interview
                  </Link>
                  <Link
                    to='/profile'
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      location.pathname === '/profile'
                        ? 'border border-blue-200 bg-blue-100 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    Profile
                  </Link>
                </SignedIn>
              </nav>

              {/* Authentication */}
              <SignedOut>
                <SignInButton mode='modal'>
                  <button className='rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700'>
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9 border-2 border-white shadow-sm',
                    },
                  }}
                />
              </SignedIn>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='rounded-lg p-2.5 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 md:hidden'
              >
                {mobileMenuOpen ? (
                  <X className='h-5 w-5' />
                ) : (
                  <Menu className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className='border-t border-slate-200 bg-white md:hidden'>
              <div className='space-y-2 px-4 py-4'>
                <Link
                  to='/'
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Home
                </Link>
                <SignedIn>
                  <Link
                    to='/form'
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      location.pathname === '/form'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Start Interview
                  </Link>
                  <Link
                    to='/profile'
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      location.pathname === '/profile'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Profile
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode='modal'>
                    <button className='mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700'>
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1'>{children}</main>

      {/* Footer */}
      <footer className='mt-20 border-t border-slate-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='text-center text-slate-600'>
            <p>&copy; 2025 InterviewAI. Powered by AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
{
  /* End of Layout Component*/
}
export default Layout;
