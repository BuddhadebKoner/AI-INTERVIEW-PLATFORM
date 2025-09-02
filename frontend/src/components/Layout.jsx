import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Menu, X } from 'lucide-react'

const Layout = ({ children }) => {
   const location = useLocation()
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
         {/* Header */}
         <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <div className="flex items-center space-x-2">
                     <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AI</span>
                     </div>
                     <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        InterviewAI
                     </Link>
                  </div>

                  {/* Navigation & Authentication */}
                  <div className="flex items-center space-x-3">
                     {/* Navigation */}
                     <nav className="hidden md:flex items-center space-x-3 mr-3">
                        <SignedIn>
                           <Link
                              to="/form"
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === '/form'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                 }`}
                           >
                              Start Interview
                           </Link>
                           <Link
                              to="/profile"
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === '/profile'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                 }`}
                           >
                              Profile
                           </Link>
                        </SignedIn>
                     </nav>

                     {/* Authentication */}
                     <SignedOut>
                        <SignInButton mode="modal">
                           <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm">
                              Sign In
                           </button>
                        </SignInButton>
                     </SignedOut>
                     <SignedIn>
                        <UserButton
                           appearance={{
                              elements: {
                                 avatarBox: "w-9 h-9 border-2 border-white shadow-sm"
                              }
                           }}
                        />
                     </SignedIn>

                     {/* Mobile menu button */}
                     <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
                     >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                     </button>
                  </div>
               </div>

               {/* Mobile Navigation */}
               {mobileMenuOpen && (
                  <div className="md:hidden border-t border-slate-200 bg-white">
                     <div className="px-4 py-4 space-y-2">
                        <Link
                           to="/"
                           onClick={() => setMobileMenuOpen(false)}
                           className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${location.pathname === '/'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-slate-700 hover:bg-slate-100'
                              }`}
                        >
                           Home
                        </Link>
                        <SignedIn>
                           <Link
                              to="/form"
                              onClick={() => setMobileMenuOpen(false)}
                              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${location.pathname === '/form'
                                 ? 'bg-blue-100 text-blue-700'
                                 : 'text-slate-700 hover:bg-slate-100'
                                 }`}
                           >
                              Start Interview
                           </Link>
                           <Link
                              to="/profile"
                              onClick={() => setMobileMenuOpen(false)}
                              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${location.pathname === '/profile'
                                 ? 'bg-blue-100 text-blue-700'
                                 : 'text-slate-700 hover:bg-slate-100'
                                 }`}
                           >
                              Profile
                           </Link>
                        </SignedIn>
                        <SignedOut>
                           <SignInButton mode="modal">
                              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 mt-2">
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
         <main className="flex-1">
            {children}
         </main>

         {/* Footer */}
         <footer className="bg-white border-t border-slate-200 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="text-center text-slate-600">
                  <p>&copy; 2025 InterviewAI. Powered by AI technology.</p>
               </div>
            </div>
         </footer>
      </div>
   )
}
{/* End of Layout Component*/}
export default Layout
