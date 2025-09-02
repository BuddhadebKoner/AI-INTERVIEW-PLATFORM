import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
   Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
   MessageCircle, Send, Volume2, VolumeX
} from 'lucide-react'

const InterviewPage = () => {
   const navigate = useNavigate()
   const localVideoRef = useRef(null)
   const remoteVideoRef = useRef(null)
   const peerConnection = useRef(null)
   const localStream = useRef(null)
   const messageEndRef = useRef(null)

   const [isVideoOn, setIsVideoOn] = useState(true)
   const [isAudioOn, setIsAudioOn] = useState(true)
   const [isConnected, setIsConnected] = useState(false)
   const [isConnecting, setIsConnecting] = useState(false)
   const [aiSpeaking, setAiSpeaking] = useState(false)
   const [userMessage, setUserMessage] = useState('')
   const [conversation, setConversation] = useState([
      {
         id: 1,
         sender: 'ai',
         message: "Hello! I'm your AI interviewer. I've reviewed your profile and I'm excited to chat with you today. Shall we begin?",
         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
   ])

   // Mock interview data
   const interviewData = JSON.parse(localStorage.getItem('interviewData') || '{}')

   // Mock AI responses based on user input
   const aiResponses = [
      "That's interesting! Can you tell me more about your experience with that?",
      "Great point! How do you handle challenges when working on such projects?",
      "I see. What would you say is your greatest strength in this area?",
      "Excellent! Can you walk me through your problem-solving approach?",
      "That's impressive. How do you stay updated with the latest technologies?",
      "Good answer! What motivates you in your professional work?",
      "I appreciate that insight. How do you handle working in a team environment?",
      "Interesting perspective! What are your career goals for the next few years?",
      "Thank you for sharing that. Do you have any questions about our company or the role?",
      "Perfect! I think we've covered a lot of ground today. Thank you for your time!"
   ]

   // Initialize WebRTC
   useEffect(() => {
      initializeWebRTC()
      return () => {
         if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop())
         }
         if (peerConnection.current) {
            peerConnection.current.close()
         }
      }
   }, [])

   // Auto scroll to latest message
   useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
   }, [conversation])

   const initializeWebRTC = async () => {
      try {
         // Get user media
         const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
         })
         localStream.current = stream
         if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
         }

         // Create peer connection
         peerConnection.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
         })

         // Add local stream tracks to peer connection
         stream.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, stream)
         })

         // Handle remote stream
         peerConnection.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
               remoteVideoRef.current.srcObject = event.streams[0]
            }
         }

         // Simulate AI video connection
         setTimeout(() => {
            simulateAIConnection()
         }, 2000)

      } catch (error) {
         console.error('Error accessing media devices:', error)
      }
   }

   const simulateAIConnection = () => {
      setIsConnecting(true)
      setTimeout(() => {
         setIsConnecting(false)
         setIsConnected(true)
         // Create a mock AI video element
         if (remoteVideoRef.current) {
            // In a real implementation, this would be the AI video stream
            remoteVideoRef.current.src = "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDFpc29tYWMyaGV2YwAABOhpbXZoZAAAAAAAAAAAAAAAALFMIV4="
         }
      }, 3000)
   }

   const toggleVideo = () => {
      if (localStream.current) {
         const videoTrack = localStream.current.getVideoTracks()[0]
         if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled
            setIsVideoOn(videoTrack.enabled)
         }
      }
   }

   const toggleAudio = () => {
      if (localStream.current) {
         const audioTrack = localStream.current.getAudioTracks()[0]
         if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled
            setIsAudioOn(audioTrack.enabled)
         }
      }
   }

   const endInterview = () => {
      if (localStream.current) {
         localStream.current.getTracks().forEach(track => track.stop())
      }
      if (peerConnection.current) {
         peerConnection.current.close()
      }

      // Save conversation data
      localStorage.setItem('interviewConversation', JSON.stringify(conversation))
      navigate('/results')
   }

   const sendMessage = () => {
      if (userMessage.trim()) {
         const newUserMessage = {
            id: Date.now(),
            sender: 'user',
            message: userMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
         }

         setConversation(prev => [...prev, newUserMessage])
         setUserMessage('')

         // Simulate AI response
         setAiSpeaking(true)
         setTimeout(() => {
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
            const aiMessage = {
               id: Date.now() + 1,
               sender: 'ai',
               message: randomResponse,
               timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setConversation(prev => [...prev, aiMessage])
            setAiSpeaking(false)

            // Simulate text-to-speech
            if ('speechSynthesis' in window) {
               const utterance = new SpeechSynthesisUtterance(randomResponse)
               utterance.rate = 0.9
               utterance.pitch = 1.1
               speechSynthesis.speak(utterance)
            }
         }, 2000)
      }
   }

   const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         sendMessage()
      }
   }

   return (
      <div className="min-h-screen bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                     <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                        AI Interview Session
                     </h1>
                     <p className="text-slate-600 mt-1">
                        Interviewing for: <span className="font-semibold">{interviewData.position || 'Software Engineer'}</span>
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800' :
                           isConnecting ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' :
                              isConnecting ? 'bg-yellow-500 animate-pulse' :
                                 'bg-red-500'
                           }`} />
                        {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
               {/* Video Section */}
               <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                     <h2 className="text-xl font-semibold text-slate-900 mb-4">Video Call</h2>

                     {/* Video Grid */}
                     <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {/* AI Video */}
                        <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                           <video
                              ref={remoteVideoRef}
                              autoPlay
                              className="w-full h-full object-cover"
                              poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUUyOTNDIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxNzAiIHk9IjkwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IndoaXRlIj4KICA8cGF0aCBkPSJNMzAgMTVDMzAgNi43MTU3MyAyMy4yODQzIDAgMTUgMEM2LjcxNTczIDAgMCA2LjcxNTczIDAgMTVDMCAyMy4yODQzIDYuNzE1NzMgMzAgMTUgMzBDMjMuMjg0MyAzMCAzMCAyMy4yODQzIDMwIDE1WiIgZmlsbD0id2hpdGUiLz4KICA8cGF0aCBkPSJNMTMuMTI1IDEwLjYyNUMxMy4xMjUgMTAuMDM5NyAxMy42Mjk3IDkuMzc1IDE0LjM3NSA5LjM3NUgxNS42MjVDMTYuMzcwMyA5LjM3NSAxNi44NzUgMTAuMDM5NyAxNi44NzUgMTAuNjI1VjEzLjEyNUgxOS4zNzVDMTkuOTYwMyAxMy4xMjUgMjAuNjI1IDEzLjYyOTcgMjAuNjI1IDE0LjM3NVYxNS42MjVDMjAuNjI1IDE2LjM3MDMgMTkuOTYwMyAxNi44NzUgMTkuMzc1IDE2Ljg3NUgxNi44NzVWMTkuMzc1QzE2Ljg3NSAxOS45NjAzIDE2LjM3MDMgMjAuNjI1IDE1LjYyNSAyMC42MjVIMTQuMzc1QzEzLjYyOTcgMjAuNjI1IDEzLjEyNSAxOS45NjAzIDEzLjEyNSAxOS4zNzVWMTYuODc1SDEwLjYyNUMxMC4wMzk3IDE2Ljg3NSA5LjM3NSAxNi4zNzAzIDkuMzc1IDE1LjYyNVYxNC4zNzVDOS4zNzUgMTMuNjI5NyAxMC4wMzk3IDEzLjEyNSAxMC42MjUgMTMuMTI1SDEzLjEyNVYxMC42MjVaIiBmaWxsPSIjNjM2NkYxIi8+Cjwvc3ZnPgo8L3N2Zz4KPHR5cGUgeD0iMTQwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFJIEludGVydmlld2VyPC90ZXh0PgoKPC9zdmc+"
                           />
                           {!isConnected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                       <Video className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-white font-medium">AI Interviewer</p>
                                    {isConnecting && (
                                       <div className="flex justify-center mt-2">
                                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           )}
                           {aiSpeaking && (
                              <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                 <Volume2 className="w-4 h-4" />
                                 Speaking...
                              </div>
                           )}
                        </div>

                        {/* User Video */}
                        <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                           <video
                              ref={localVideoRef}
                              autoPlay
                              muted
                              className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                           />
                           {!isVideoOn && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                       <VideoOff className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-white font-medium">Video Off</p>
                                 </div>
                              </div>
                           )}
                           <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                              You
                           </div>
                        </div>
                     </div>

                     {/* Video Controls */}
                     <div className="flex items-center justify-center gap-4">
                        <button
                           onClick={toggleVideo}
                           className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isVideoOn
                                 ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                 : 'bg-red-500 hover:bg-red-600 text-white'
                              }`}
                        >
                           {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>

                        <button
                           onClick={toggleAudio}
                           className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isAudioOn
                                 ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                 : 'bg-red-500 hover:bg-red-600 text-white'
                              }`}
                        >
                           {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>

                        <button
                           onClick={endInterview}
                           className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200"
                        >
                           <PhoneOff className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>

               {/* Chat Section */}
               <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-[600px]">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                     <MessageCircle className="w-5 h-5 text-blue-600" />
                     <h2 className="text-xl font-semibold text-slate-900">Live Conversation</h2>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ scrollbarWidth: 'thin' }}>
                     {conversation.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                                 ? 'bg-blue-600 text-white rounded-br-sm'
                                 : 'bg-slate-100 text-slate-900 rounded-bl-sm'
                              }`}>
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                                 }`}>
                                 {msg.timestamp}
                              </p>
                           </div>
                        </div>
                     ))}
                     {aiSpeaking && (
                        <div className="flex justify-start">
                           <div className="bg-slate-100 text-slate-900 rounded-2xl rounded-bl-sm p-3">
                              <div className="flex space-x-1">
                                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                           </div>
                        </div>
                     )}
                     <div ref={messageEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-slate-200 pt-4">
                     <div className="flex gap-3">
                        <input
                           type="text"
                           value={userMessage}
                           onChange={(e) => setUserMessage(e.target.value)}
                           onKeyPress={handleKeyPress}
                           placeholder="Type your response..."
                           className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                           disabled={aiSpeaking}
                        />
                        <button
                           onClick={sendMessage}
                           disabled={!userMessage.trim() || aiSpeaking}
                           className={`px-4 py-3 rounded-xl transition-all duration-200 ${userMessage.trim() && !aiSpeaking
                                 ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                 : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                              }`}
                        >
                           <Send className="w-5 h-5" />
                        </button>
                     </div>
                     <p className="text-xs text-slate-500 mt-2">
                        Press Enter to send • The AI will respond with voice
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default InterviewPage
