import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { User, Mail, Calendar, Award, TrendingUp, Clock } from 'lucide-react'

const Profile = () => {
   const { user } = useUser()

   const stats = [
      {
         icon: <Award className="w-6 h-6" />,
         label: "Interviews Completed",
         value: "0",
         color: "from-blue-600 to-blue-700"
      },
      {
         icon: <TrendingUp className="w-6 h-6" />,
         label: "Average Score",
         value: "N/A",
         color: "from-green-600 to-green-700"
      },
      {
         icon: <Clock className="w-6 h-6" />,
         label: "Practice Time",
         value: "0 min",
         color: "from-purple-600 to-purple-700"
      }
   ]

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
               <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                  My Profile
               </h1>
               <p className="text-xl text-slate-600">
                  Track your interview progress and manage your account
               </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
               <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                     <img
                        src={user?.imageUrl}
                        alt={user?.fullName}
                        className="w-24 h-24 rounded-full border-4 border-gradient-to-r from-blue-600 to-purple-600"
                     />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {user?.fullName || 'User'}
                     </h2>

                     <div className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600">
                           <Mail className="w-4 h-4" />
                           <span>{user?.primaryEmailAddress?.emailAddress}</span>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600">
                           <Calendar className="w-4 h-4" />
                           <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex-shrink-0">
                     <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl">
                        <div className="text-center">
                           <div className="text-2xl font-bold">0</div>
                           <div className="text-sm opacity-90">Interviews</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
               {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                     <div className="flex items-center gap-4">
                        <div className={`bg-gradient-to-r ${stat.color} text-white w-12 h-12 rounded-xl flex items-center justify-center`}>
                           {stat.icon}
                        </div>
                        <div>
                           <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                           <div className="text-sm text-slate-600">{stat.label}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
               <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Activity</h3>

               <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No interviews yet</h4>
                  <p className="text-slate-600 mb-6">
                     Start your first AI interview to see your progress here
                  </p>
                  <a
                     href="/form"
                     className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-block"
                  >
                     Start First Interview
                  </a>
               </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
               <h3 className="text-xl font-semibold text-slate-900 mb-6">Account Settings</h3>

               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                     <div>
                        <h4 className="font-semibold text-slate-900">Email Notifications</h4>
                        <p className="text-sm text-slate-600">Receive updates about your interviews</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                     <div>
                        <h4 className="font-semibold text-slate-900">Performance Analytics</h4>
                        <p className="text-sm text-slate-600">Track detailed interview metrics</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                     </label>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Profile
