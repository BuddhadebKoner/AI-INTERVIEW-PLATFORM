import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
   const location = useLocation()

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
         {/* Header */}
         <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-2">
                     <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AI</span>
                     </div>
                     <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        InterviewAI
                     </Link>
                  </div>

                  {/* Navigation */}
                  <nav className="hidden md:flex items-center space-x-8">
                     <Link
                        to="/"
                        className={`text-sm font-medium transition-colors ${location.pathname === '/'
                              ? 'text-blue-600'
                              : 'text-slate-600 hover:text-blue-600'
                           }`}
                     >
                        Home
                     </Link>
                     <Link
                        to="/form"
                        className={`text-sm font-medium transition-colors ${location.pathname === '/form'
                              ? 'text-blue-600'
                              : 'text-slate-600 hover:text-blue-600'
                           }`}
                     >
                        Start Interview
                     </Link>
                  </nav>
               </div>
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

export default Layout
