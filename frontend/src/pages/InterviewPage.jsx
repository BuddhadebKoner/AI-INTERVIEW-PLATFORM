import {
  MessageCircle,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Video,
  VideoOff,
  Volume2
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InterviewPage = () => {
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const messageEndRef = useRef(null);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([
    {
      id: 1,
      sender: 'ai',
      message:
        "Hello! I'm your AI interviewer. I've reviewed your profile and I'm excited to chat with you today. Shall we begin?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  // Mock interview data
  const interviewData = JSON.parse(
    localStorage.getItem('interviewData') || '{}',
  );

  // Mock AI responses based on user input
  const aiResponses = [
    "That's interesting! Can you tell me more about your experience with that?",
    'Great point! How do you handle challenges when working on such projects?',
    'I see. What would you say is your greatest strength in this area?',
    'Excellent! Can you walk me through your problem-solving approach?',
    "That's impressive. How do you stay updated with the latest technologies?",
    'Good answer! What motivates you in your professional work?',
    'I appreciate that insight. How do you handle working in a team environment?',
    'Interesting perspective! What are your career goals for the next few years?',
    'Thank you for sharing that. Do you have any questions about our company or the role?',
    "Perfect! I think we've covered a lot of ground today. Thank you for your time!",
  ];

  // Initialize WebRTC
  useEffect(() => {
    initializeWebRTC();
    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [initializeWebRTC]);

  // Auto scroll to latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const initializeWebRTC = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.current.ontrack = event => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Simulate AI video connection
      setTimeout(() => {
        simulateAIConnection();
      }, 2000);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }, []);

  const simulateAIConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      // Create a mock AI video element
      if (remoteVideoRef.current) {
        // In a real implementation, this would be the AI video stream
        remoteVideoRef.current.src =
          'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDFpc29tYWMyaGV2YwAABOhpbXZoZAAAAAAAAAAAAAAAALFMIV4=';
      }
    }, 3000);
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const endInterview = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    // Save conversation data
    localStorage.setItem('interviewConversation', JSON.stringify(conversation));
    navigate('/results');
  };

  const sendMessage = () => {
    if (userMessage.trim()) {
      const newUserMessage = {
        id: Date.now(),
        sender: 'user',
        message: userMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setConversation(prev => [...prev, newUserMessage]);
      setUserMessage('');

      // Simulate AI response
      setAiSpeaking(true);
      setTimeout(() => {
        const randomResponse =
          aiResponses[Math.floor(Math.random() * aiResponses.length)];
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setConversation(prev => [...prev, aiMessage]);
        setAiSpeaking(false);

        // Simulate text-to-speech
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(randomResponse);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          speechSynthesis.speak(utterance);
        }
      }, 2000);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-6 rounded-2xl bg-white p-6 shadow-lg'>
          <div className='flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center'>
            <div>
              <h1 className='text-2xl font-bold text-slate-900 lg:text-3xl'>
                AI Interview Session
              </h1>
              <p className='mt-1 text-slate-600'>
                Interviewing for:{' '}
                <span className='font-semibold'>
                  {interviewData.position || 'Software Engineer'}
                </span>
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${isConnected
                    ? 'bg-green-100 text-green-800'
                    : isConnecting
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${isConnected
                      ? 'animate-pulse bg-green-500'
                      : isConnecting
                        ? 'animate-pulse bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                />
                {isConnected
                  ? 'Connected'
                  : isConnecting
                    ? 'Connecting...'
                    : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Video Section */}
          <div className='space-y-6 lg:col-span-2'>
            <div className='rounded-2xl bg-white p-6 shadow-lg'>
              <h2 className='mb-4 text-xl font-semibold text-slate-900'>
                Video Call
              </h2>

              {/* Video Grid */}
              <div className='mb-6 grid gap-4 md:grid-cols-2'>
                {/* AI Video */}
                <div className='relative aspect-video overflow-hidden rounded-xl bg-slate-900'>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className='h-full w-full object-cover'
                    poster='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUUyOTNDIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxNzAiIHk9IjkwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IndoaXRlIj4KICA8cGF0aCBkPSJNMzAgMTVDMzAgNi43MTU3MyAyMy4yODQzIDAgMTUgMEM2LjcxNTczIDAgMCA2LjcxNTczIDAgMTVDMCAyMy4yODQzIDYuNzE1NzMgMzAgMTUgMzBDMjMuMjg0MyAzMCAzMCAyMy4yODQzIDMwIDE1WiIgZmlsbD0id2hpdGUiLz4KICA8cGF0aCBkPSJNMTMuMTI1IDEwLjYyNUMxMy4xMjUgMTAuMDM5NyAxMy42Mjk3IDkuMzc1IDE0LjM3NSA5LjM3NUgxNS42MjVDMTYuMzcwMyA5LjM3NSAxNi44NzUgMTAuMDM5NyAxNi44NzUgMTAuNjI1VjEzLjEyNUgxOS4zNzVDMTkuOTYwMyAxMy4xMjUgMjAuNjI1IDEzLjYyOTcgMjAuNjI1IDE0LjM3NVYxNS42MjVDMjAuNjI1IDE2LjM3MDMgMTkuOTYwMyAxNi44NzUgMTkuMzc1IDE2Ljg3NUgxNi44NzVWMTkuMzc1QzE2Ljg3NSAxOS45NjAzIDE2LjM3MDMgMjAuNjI1IDE1LjYyNSAyMC42MjVIMTQuMzc1QzEzLjYyOTcgMjAuNjI1IDEzLjEyNSAxOS45NjAzIDEzLjEyNSAxOS4zNzVWMTYuODc1SDEwLjYyNUMxMC4wMzk3IDE2Ljg3NSA5LjM3NSAxNi4zNzAzIDkuMzc1IDE1LjYyNVYxNC4zNzVDOS4zNzUgMTMuNjI5NyAxMC4wMzk3IDEzLjEyNSAxMC42MjUgMTMuMTI1SDEzLjEyNVYxMC42MjVaIiBmaWxsPSIjNjM2NkYxIi8+Cjwvc3ZnPgo8L3N2Zz4KPHR5cGUgeD0iMTQwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFJIEludGVydmlld2VyPC90ZXh0PgoKPC9zdmc+'
                  />
                  {!isConnected && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600'>
                          <Video className='h-8 w-8 text-white' />
                        </div>
                        <p className='font-medium text-white'>AI Interviewer</p>
                        {isConnecting && (
                          <div className='mt-2 flex justify-center'>
                            <div className='h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {aiSpeaking && (
                    <div className='absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-green-500 px-3 py-1 text-sm text-white'>
                      <Volume2 className='h-4 w-4' />
                      Speaking...
                    </div>
                  )}
                </div>

                {/* User Video */}
                <div className='relative aspect-video overflow-hidden rounded-xl bg-slate-900'>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className={`h-full w-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
                  />
                  {!isVideoOn && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-600'>
                          <VideoOff className='h-8 w-8 text-white' />
                        </div>
                        <p className='font-medium text-white'>Video Off</p>
                      </div>
                    </div>
                  )}
                  <div className='absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white'>
                    You
                  </div>
                </div>
              </div>

              {/* Video Controls */}
              <div className='flex items-center justify-center gap-4'>
                <button
                  onClick={toggleVideo}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${isVideoOn
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                >
                  {isVideoOn ? (
                    <Video className='h-5 w-5' />
                  ) : (
                    <VideoOff className='h-5 w-5' />
                  )}
                </button>

                <button
                  onClick={toggleAudio}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${isAudioOn
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                >
                  {isAudioOn ? (
                    <Mic className='h-5 w-5' />
                  ) : (
                    <MicOff className='h-5 w-5' />
                  )}
                </button>

                <button
                  onClick={endInterview}
                  className='flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white transition-all duration-200 hover:bg-red-600'
                >
                  <PhoneOff className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className='flex h-[600px] flex-col rounded-2xl bg-white p-6 shadow-lg'>
            <div className='mb-4 flex items-center gap-3 border-b border-slate-200 pb-4'>
              <MessageCircle className='h-5 w-5 text-blue-600' />
              <h2 className='text-xl font-semibold text-slate-900'>
                Live Conversation
              </h2>
            </div>

            {/* Messages */}
            <div
              className='mb-4 flex-1 space-y-4 overflow-y-auto pr-2'
              style={{ scrollbarWidth: 'thin' }}
            >
              {conversation.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === 'user'
                        ? 'rounded-br-sm bg-blue-600 text-white'
                        : 'rounded-bl-sm bg-slate-100 text-slate-900'
                      }`}
                  >
                    <p className='text-sm leading-relaxed'>{msg.message}</p>
                    <p
                      className={`mt-1 text-xs ${msg.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-slate-500'
                        }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {aiSpeaking && (
                <div className='flex justify-start'>
                  <div className='rounded-2xl rounded-bl-sm bg-slate-100 p-3 text-slate-900'>
                    <div className='flex space-x-1'>
                      <div className='h-2 w-2 animate-bounce rounded-full bg-slate-400'></div>
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-slate-400'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='h-2 w-2 animate-bounce rounded-full bg-slate-400'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className='border-t border-slate-200 pt-4'>
              <div className='flex gap-3'>
                <input
                  type='text'
                  value={userMessage}
                  onChange={e => setUserMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Type your response...'
                  className='flex-1 rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  disabled={aiSpeaking}
                />
                <button
                  onClick={sendMessage}
                  disabled={!userMessage.trim() || aiSpeaking}
                  className={`rounded-xl px-4 py-3 transition-all duration-200 ${userMessage.trim() && !aiSpeaking
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'cursor-not-allowed bg-slate-300 text-slate-500'
                    }`}
                >
                  <Send className='h-5 w-5' />
                </button>
              </div>
              <p className='mt-2 text-xs text-slate-500'>
                Press Enter to send • The AI will respond with voice
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
