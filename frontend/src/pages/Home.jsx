import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Video, FileText, CheckCircle, Star } from 'lucide-react'

const Home = () => {
   const features = [
      {
         icon: <Brain className="w-6 h-6" />,
         title: "AI-Powered Questions",
         description: "Smart questions tailored to your CV and experience level"
      },
      {
         icon: <Video className="w-6 h-6" />,
         title: "Video Interview",
         description: "Practice with realistic video interview scenarios"
      },
      {
         icon: <FileText className="w-6 h-6" />,
         title: "Instant Feedback",
         description: "Get detailed analysis and improvement suggestions"
      }
   ]

   const benefits = [
      "Personalized interview questions based on your CV",
      "Real-time AI feedback and scoring",
      "Practice at your own pace, anytime",
      "Comprehensive performance analysis"
   ]

   return (
      <div className="relative">
         {/* Hero Section */}
         <section className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                     Master Your Next
                     <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Job Interview
                     </span>
                  </h1>
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                     Practice with our AI interviewer that analyzes your CV and creates personalized questions.
                     Get instant feedback and improve your interview skills.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                     <Link
                        to="/form"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                     >
                        Start Free Interview
                        <ArrowRight className="w-5 h-5" />
                     </Link>
                     <button className="text-slate-600 hover:text-slate-800 px-8 py-4 font-semibold transition-colors">
                        Watch Demo
                     </button>
                  </div>
               </div>
            </div>
         </section>

         {/* Features Section */}
         <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                     Why Choose InterviewAI?
                  </h2>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                     Our platform combines cutting-edge AI technology with proven interview techniques
                  </p>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                     <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:bg-slate-100 transition-colors">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                           {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">
                           {feature.title}
                        </h3>
                        <p className="text-slate-600">
                           {feature.description}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Benefits Section */}
         <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                     <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                        Everything You Need to
                        <span className="block text-blue-600">Succeed</span>
                     </h2>
                     <div className="space-y-4">
                        {benefits.map((benefit, index) => (
                           <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                              <p className="text-slate-700">{benefit}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="relative">
                     <div className="bg-white rounded-2xl p-8 shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <Star className="w-6 h-6 text-white" />
                           </div>
                           <div>
                              <h4 className="font-semibold text-slate-900">Premium Experience</h4>
                              <p className="text-slate-600 text-sm">Tailored for success</p>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between">
                              <span className="text-slate-600">CV Analysis</span>
                              <span className="text-green-600 font-semibold">✓ Complete</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-slate-600">Question Generation</span>
                              <span className="text-blue-600 font-semibold">🤖 AI Powered</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-slate-600">Performance Score</span>
                              <span className="text-purple-600 font-semibold">85%</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="py-20 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Ready to Ace Your Interview?
               </h2>
               <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                  Join thousands of professionals who have improved their interview skills with InterviewAI
               </p>
               <Link
                  to="/form"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
               >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
         </section>
      </div>
   )
}

export default Home
