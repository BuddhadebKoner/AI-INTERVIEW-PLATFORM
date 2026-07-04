import axios from 'axios';
import { Loader2, Mic, MicOff, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const PYTHON_API_URL = 'http://localhost:8000';
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const VoiceInterview = ({ interview }) => {
  const [socket, setSocket] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [interimTranscript, setInterimTranscript] = useState(''); // Show live transcript

  // Check microphone permission on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const result = await navigator.permissions.query({
          name: 'microphone',
        });
        setMicPermission(result.state);

        result.onchange = () => {
          setMicPermission(result.state);
        };
      } catch (error) {
        console.log('Permission API not supported, will prompt on use');
      }
    };

    checkMicPermission();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🔌 Connected to server');
      newSocket.emit('join-interview', interview._id);
    });

    newSocket.on('analysis-result', data => {
      console.log('📊 Analysis result received:', data);
      setFeedback(data.analysis);
      setIsProcessing(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [interview._id]);

  // Ask first question only when interview is started
  useEffect(() => {
    if (interview?.questions?.length > 0 && interviewStarted) {
      askQuestion(0);
    }
  }, [interview, interviewStarted]);

  const startInterview = () => {
    setInterviewStarted(true);
  };

  const askQuestion = async index => {
    if (index >= interview.questions.length) {
      setInterviewComplete(true);
      return;
    }

    const question = interview.questions[index];
    setCurrentQuestionIndex(index);
    setCurrentAnswer('');
    setFeedback(null);

    try {
      setIsSpeaking(true);

      // Convert question text to speech
      // Map language name to language code
      const languageCode =
        interview.language === 'english' ? 'en' : interview.language || 'en';

      const response = await axios.post(`${PYTHON_API_URL}/text-to-speech`, {
        text: question.question,
        language: languageCode,
      });

      if (response.data.success) {
        // Play audio
        const audioBlob = base64ToBlob(response.data.audio_data, 'audio/mp3');
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;

          // Handle autoplay policy
          const playPromise = audioRef.current.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Audio playback started successfully');
              })
              .catch(error => {
                console.error('Autoplay prevented:', error);
                setIsSpeaking(false);
                // Don't show error - just skip audio playback
              });
          }

          audioRef.current.onended = () => {
            setIsSpeaking(false);
            socket?.emit('question-asked', {
              interviewId: interview._id,
              questionNumber: question.questionNumber,
            });
          };
        }
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    try {
      // Check if browser supports Web Speech API
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert(
          'Speech recognition is not supported in your browser. Please use Chrome or Edge.',
        );
        return;
      }

      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission('granted');
      } catch (error) {
        console.error('Microphone permission denied:', error);
        setMicPermission('denied');
        alert(
          '🎤 Microphone Access Required!\n\n' +
            'Please allow microphone access to record your answers.\n\n' +
            'How to enable:\n' +
            '1. Click the camera/microphone icon in the address bar\n' +
            '2. Select "Always allow" for microphone\n' +
            '3. Click "Done" and try again',
        );
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = interview.language === 'english' ? 'en-US' : 'en-IN';
      recognition.continuous = true; // Keep listening continuously
      recognition.interimResults = true; // Show interim results
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
        setInterimTranscript('');
      };

      recognition.onresult = event => {
        let finalTranscript = '';
        let interim = '';

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        // Update the interim transcript display
        setInterimTranscript((finalTranscript + interim).trim());
        console.log('Current transcript:', finalTranscript + interim);
      };

      recognition.onerror = event => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);

        if (event.error === 'not-allowed') {
          alert(
            '🎤 Microphone Access Denied!\n\n' +
              'Please allow microphone access to continue the interview.\n\n' +
              'How to enable:\n' +
              '1. Click the lock/info icon in the address bar\n' +
              '2. Find "Microphone" permissions\n' +
              '3. Select "Allow"\n' +
              '4. Refresh the page and try again',
          );
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please try speaking again.');
        } else if (event.error === 'audio-capture') {
          alert(
            'No microphone found. Please connect a microphone and try again.',
          );
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to start speech recognition. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);

      // Process the final transcript
      if (interimTranscript.trim()) {
        processAnswer(interimTranscript.trim());
      } else {
        alert('No speech was detected. Please try again.');
      }
    }
  };

  const processAnswer = async answerText => {
    try {
      setIsProcessing(true);
      setCurrentAnswer(answerText);

      // Emit answer submitted event
      socket?.emit('answer-submitted', {
        interviewId: interview._id,
        questionNumber:
          interview.questions[currentQuestionIndex].questionNumber,
        answer: answerText,
      });

      // Analyze answer using Gemini
      const analysisResponse = await axios.post(
        `${PYTHON_API_URL}/analyze-answer`,
        {
          question: interview.questions[currentQuestionIndex].question,
          answer: answerText,
          expectedAnswer:
            interview.questions[currentQuestionIndex].expectedAnswer,
        },
      );

      if (analysisResponse.data.success) {
        const analysis = analysisResponse.data.analysis;

        // Emit analysis complete event
        socket?.emit('answer-analyzed', {
          interviewId: interview._id,
          questionNumber:
            interview.questions[currentQuestionIndex].questionNumber,
          analysis,
        });

        // Store answer with analysis
        setAnswers(prev => [
          ...prev,
          {
            questionNumber:
              interview.questions[currentQuestionIndex].questionNumber,
            question: interview.questions[currentQuestionIndex].question,
            answer: answerText,
            analysis,
          },
        ]);

        setFeedback(analysis);

        // Speak the feedback
        await speakFeedback(analysis.feedback);
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      alert('Error processing your answer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakFeedback = async text => {
    try {
      setIsSpeaking(true);

      // Map language name to language code
      const languageCode =
        interview.language === 'english' ? 'en' : interview.language || 'en';

      const response = await axios.post(`${PYTHON_API_URL}/text-to-speech`, {
        text,
        language: languageCode,
      });

      if (response.data.success) {
        const audioBlob = base64ToBlob(response.data.audio_data, 'audio/mp3');
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;

          // Handle autoplay policy
          const playPromise = audioRef.current.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Feedback audio playback started');
              })
              .catch(error => {
                console.error('Autoplay prevented for feedback:', error);
                setIsSpeaking(false);
                // Don't show error - just skip audio playback
              });
          }

          audioRef.current.onended = () => {
            setIsSpeaking(false);
          };
        }
      }
    } catch (error) {
      console.error('Error speaking feedback:', error);
      setIsSpeaking(false);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < interview.questions.length) {
      askQuestion(nextIndex);
    } else {
      setInterviewComplete(true);
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Show start screen if interview hasn't started
  if (!interviewStarted) {
    return (
      <div className='mx-auto max-w-4xl p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Ready to Start Your Interview?</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='rounded-lg bg-blue-50 p-4'>
              <h3 className='mb-2 font-semibold'>📋 Interview Details</h3>
              <ul className='space-y-1 text-sm'>
                <li>
                  • <strong>Type:</strong> {interview?.interviewType}
                </li>
                <li>
                  • <strong>Questions:</strong> {interview?.questions?.length}
                </li>
                <li>
                  • <strong>Language:</strong> {interview?.language}
                </li>
                <li>
                  • <strong>Complexity:</strong> {interview?.complexity}
                </li>
              </ul>
            </div>

            <div className='rounded-lg bg-yellow-50 p-4'>
              <h3 className='mb-2 font-semibold'>⚠️ Before You Start</h3>
              <ul className='space-y-1 text-sm'>
                <li>✓ Make sure your microphone is connected</li>
                <li>✓ Find a quiet place</li>
                <li>✓ Allow microphone permissions when prompted</li>
                <li>✓ Enable sound to hear questions</li>
              </ul>
            </div>

            <div className='rounded-lg bg-green-50 p-4'>
              <h3 className='mb-2 font-semibold'>🎤 How It Works</h3>
              <ul className='space-y-1 text-sm'>
                <li>1. Each question will be read aloud to you</li>
                <li>2. Click "Start Recording" when you're ready to answer</li>
                <li>3. Speak your answer clearly</li>
                <li>4. Click "Stop Recording" when you finish</li>
                <li>5. Get instant AI feedback on your answer</li>
              </ul>
            </div>

            <div className='flex justify-center pt-4'>
              <Button
                onClick={startInterview}
                size='lg'
                className='flex items-center space-x-2'
              >
                <Volume2 className='h-5 w-5' />
                <span>Start Interview</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (interviewComplete) {
    return (
      <div className='mx-auto max-w-4xl p-6'>
        <Card>
          <CardHeader>
            <CardTitle>Interview Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4'>
              You have completed all {interview.questions.length} questions.
            </p>

            <div className='space-y-4'>
              <h3 className='text-xl font-semibold'>Summary</h3>
              {answers.map((ans, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className='text-sm'>
                      Question {ans.questionNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='mb-2 font-medium'>{ans.question}</p>
                    <p className='mb-2 text-gray-700'>
                      <strong>Your Answer:</strong> {ans.answer}
                    </p>
                    <div className='rounded bg-gray-50 p-3'>
                      <p className='text-sm'>
                        <strong>Score:</strong> {ans.analysis.score}/10
                      </p>
                      <p className='mt-1 text-sm'>{ans.analysis.feedback}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = interview?.questions?.[currentQuestionIndex];

  return (
    <div className='mx-auto max-w-4xl p-6'>
      <audio ref={audioRef} className='hidden' />

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} of {interview.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='rounded-lg bg-blue-50 p-4'>
              <p className='text-lg font-medium'>{currentQuestion?.question}</p>
              <p className='mt-2 text-sm text-gray-600'>
                Category: {currentQuestion?.category}
              </p>
            </div>

            {isSpeaking && (
              <div className='flex items-center justify-center rounded-lg bg-green-50 p-4'>
                <Volume2 className='mr-2 animate-pulse' />
                <span>Speaking question...</span>
              </div>
            )}

            {!isSpeaking && !isProcessing && (
              <div className='space-y-2'>
                {micPermission === 'denied' && (
                  <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-center'>
                    <p className='text-sm font-medium text-red-600'>
                      🔒 Microphone access is blocked. Please enable it in your
                      browser settings.
                    </p>
                  </div>
                )}
                <div className='flex justify-center space-x-4'>
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className='flex items-center space-x-2'
                      size='lg'
                      disabled={micPermission === 'denied'}
                    >
                      <Mic className='h-5 w-5' />
                      <span>
                        {micPermission === 'denied'
                          ? 'Microphone Blocked'
                          : 'Start Recording Answer'}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant='destructive'
                      className='flex items-center space-x-2'
                      size='lg'
                    >
                      <MicOff className='h-5 w-5' />
                      <span>Stop Recording</span>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {isRecording && (
              <div className='space-y-2'>
                <div className='flex items-center justify-center rounded-lg bg-red-50 p-4'>
                  <div className='mr-2 h-3 w-3 animate-pulse rounded-full bg-red-500'></div>
                  <span>
                    Recording... Speak your answer (Click "Stop Recording" when
                    done)
                  </span>
                </div>
                {interimTranscript && (
                  <Card className='border-blue-200 bg-blue-50'>
                    <CardContent className='pt-4'>
                      <p className='mb-1 text-sm font-semibold text-gray-600'>
                        Live Transcript:
                      </p>
                      <p className='text-gray-800'>{interimTranscript}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {isProcessing && (
              <div className='flex items-center justify-center rounded-lg bg-yellow-50 p-4'>
                <Loader2 className='mr-2 animate-spin' />
                <span>Processing your answer...</span>
              </div>
            )}

            {currentAnswer && (
              <Card className='bg-gray-50'>
                <CardHeader>
                  <CardTitle className='text-sm'>Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{currentAnswer}</p>
                </CardContent>
              </Card>
            )}

            {feedback && (
              <Card className='bg-green-50'>
                <CardHeader>
                  <CardTitle className='text-sm'>Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <p>
                      <strong>Score:</strong> {feedback.score}/10
                    </p>
                    <p>{feedback.feedback}</p>

                    {feedback.strengths && feedback.strengths.length > 0 && (
                      <div>
                        <strong>Strengths:</strong>
                        <ul className='list-inside list-disc'>
                          {feedback.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.improvements &&
                      feedback.improvements.length > 0 && (
                        <div>
                          <strong>Areas to Improve:</strong>
                          <ul className='list-inside list-disc'>
                            {feedback.improvements.map((improvement, idx) => (
                              <li key={idx}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <Button onClick={nextQuestion} className='mt-4'>
                      {currentQuestionIndex < interview.questions.length - 1
                        ? 'Next Question'
                        : 'Finish Interview'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <div className='text-center text-sm text-gray-500'>
        <p>
          Progress: {answers.length} of {interview.questions.length} questions
          answered
        </p>
      </div>
    </div>
  );
};

export default VoiceInterview;
