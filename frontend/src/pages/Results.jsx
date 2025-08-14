import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trophy, TrendingUp, Clock, MessageSquare, Award, Download, RefreshCw, Home, BarChart3 } from 'lucide-react'

const Results = () => {
   const navigate = useNavigate()
   const [interviewData, setInterviewData] = useState(null)
   const [results, setResults] = useState(null)

   useEffect(() => {
      // Load interview data and generate mock results
      const storedData = localStorage.getItem('interviewData')
      const storedAnswers = localStorage.getItem('interviewAnswers')

      if (!storedData) {
         navigate('/form')
         return
      }

      const data = JSON.parse(storedData)
      const answers = storedAnswers ? JSON.parse(storedAnswers) : []

      setInterviewData(data)

      // Generate mock AI analysis results
      const mockResults = {
         overallScore: 78,
         performance: {
            communication: 85,
            technical: 72,
            behavioral: 80,
            confidence: 75
         },
         strengths: [
            "Excellent communication skills and clear articulation",
            "Strong technical background with relevant experience",
            "Good problem-solving approach and methodology"
         ],
         improvements: [
            "Provide more specific examples in behavioral questions",
            "Practice technical explanations for complex concepts",
            "Work on time management for longer responses"
         ],
         questionAnalysis: [
            {
               question: "Tell me about yourself and your background",
               score: 85,
               feedback: "Great introduction with clear career progression. Consider adding more specific achievements.",
               category: "General"
            },
            {
               question: "What programming languages are you comfortable with?",
               score: 72,
               feedback: "Good technical knowledge. Provide more real-world application examples.",
               category: "Technical"
            },
            {
               question: "Describe a challenging project",
               score: 80,
               feedback: "Well-structured response. Include more details about the impact and results.",
               category: "Behavioral"
            }
         ],
         recommendations: [
            "Practice the STAR method for behavioral questions",
            "Prepare 3-5 detailed project examples",
            "Research common technical questions for your role",
            "Work on confident body language and eye contact"
         ]
      }

      setResults(mockResults)
   }, [navigate])

   const getScoreColor = (score) => {
      if (score >= 80) return 'text-green-600'
      if (score >= 60) return 'text-yellow-600'
      return 'text-red-600'
   }

   const getScoreBg = (score) => {
      if (score >= 80) return 'bg-green-100'
      if (score >= 60) return 'bg-yellow-100'
      return 'bg-red-100'
   }

   if (!results) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
               <p className="text-slate-600">Analyzing your interview performance...</p>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-screen py-12 bg-slate-50">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                  <Trophy className="w-10 h-10 text-white" />
               </div>
               <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                  Interview Results
               </h1>
               <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Here's your detailed performance analysis and personalized feedback
               </p>
            </div>

            {/* Overall Score Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
               <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center">
                     <div className="relative inline-block">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                           <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-slate-200"
                           />
                           <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - results.overallScore / 100)}`}
                              className="text-blue-600 transition-all duration-1000"
                           />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-3xl font-bold text-slate-900">
                              {results.overallScore}%
                           </span>
                        </div>
                     </div>
                     <h3 className="text-xl font-semibold text-slate-900 mt-4">Overall Score</h3>
                     <p className="text-slate-600">Above Average Performance</p>
                  </div>

                  <div className="space-y-4">
                     {Object.entries(results.performance).map(([skill, score]) => (
                        <div key={skill} className="flex items-center justify-between">
                           <span className="font-medium text-slate-700 capitalize">
                              {skill}
                           </span>
                           <div className="flex items-center gap-3">
                              <div className="w-32 bg-slate-200 rounded-full h-2">
                                 <div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${score}%` }}
                                 ></div>
                              </div>
                              <span className={`font-semibold ${getScoreColor(score)}`}>
                                 {score}%
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
               {/* Strengths */}
               <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                     </div>
                     <h3 className="text-xl font-semibold text-slate-900">Strengths</h3>
                  </div>
                  <div className="space-y-3">
                     {results.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                           <p className="text-slate-700">{strength}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Areas for Improvement */}
               <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-yellow-600" />
                     </div>
                     <h3 className="text-xl font-semibold text-slate-900">Areas for Improvement</h3>
                  </div>
                  <div className="space-y-3">
                     {results.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-start gap-3">
                           <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                           <p className="text-slate-700">{improvement}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Question Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                     <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Question-by-Question Analysis</h3>
               </div>

               <div className="space-y-4">
                  {results.questionAnalysis.map((analysis, index) => (
                     <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                           <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-1">
                                 Question {index + 1}: {analysis.question}
                              </h4>
                              <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                 {analysis.category}
                              </span>
                           </div>
                           <div className={`ml-4 px-3 py-1 rounded-full font-semibold ${getScoreBg(analysis.score)} ${getScoreColor(analysis.score)}`}>
                              {analysis.score}%
                           </div>
                        </div>
                        <p className="text-slate-700">{analysis.feedback}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg p-6 mb-8">
               <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Personalized Recommendations</h3>
               </div>

               <div className="grid md:grid-cols-2 gap-4">
                  {results.recommendations.map((recommendation, index) => (
                     <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-start gap-3">
                           <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-sm font-bold">{index + 1}</span>
                           </div>
                           <p>{recommendation}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Report
               </button>

               <Link
                  to="/form"
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
               >
                  <RefreshCw className="w-5 h-5" />
                  Retake Interview
               </Link>

               <Link
                  to="/"
                  className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
               >
                  <Home className="w-5 h-5" />
                  Back to Home
               </Link>
            </div>
         </div>
      </div>
   )
}

export default Results
