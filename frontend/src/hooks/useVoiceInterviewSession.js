import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { interviewApi } from '../api/interviewApi';

const PYTHON_API_URL =
  import.meta.env.VITE_PYTHON_SERVICE_URL ||
  import.meta.env.VITE_PDF_SERVICE_URL ||
  'http://localhost:8000';

const getSocketUrl = () => {
  const explicitUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (explicitUrl) return explicitUrl.replace(/\/api\/?$/, '');
  if (apiBaseUrl) return apiBaseUrl.replace(/\/api\/?$/, '');

  return 'http://localhost:5000';
};

const SOCKET_URL = getSocketUrl();

const SUPPORTED_AUDIO_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
  'audio/mp4',
  'audio/wav',
];

const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const AUTO_RECORD_DELAY_MS = 350;
const MIN_RECORDING_DURATION_MS = 1500;
const SILENCE_STOP_DELAY_MS = 2400;
const SILENCE_CHECK_INTERVAL_MS = 250;
const SILENCE_RMS_THRESHOLD = 0.025;
const MAX_RECORDING_DURATION_MS = 180000;
const MAX_FOLLOW_UPS_PER_QUESTION = 2;

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const getTtsLanguageCode = language =>
  language === 'english' ? 'en' : language || 'en';

const getTranscriptionLanguageCode = language =>
  language === 'english' ? 'en' : language || 'en';

const getSupportedAudioMimeType = () => {
  if (!window.MediaRecorder?.isTypeSupported) return '';

  return SUPPORTED_AUDIO_TYPES.find(type => MediaRecorder.isTypeSupported(type)) || '';
};

const getAudioFileExtension = mimeType => {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';

  return 'webm';
};

const stopMediaStream = stream => {
  stream?.getTracks().forEach(track => track.stop());
};

const getApiErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail || error.response?.data?.message;

  if (typeof detail === 'string') return detail;

  return error.message || fallback;
};

const getMicrophoneErrorMessage = error => {
  if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') {
    return 'Microphone access is blocked in browser settings.';
  }

  if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
    return 'No microphone was found. Please connect one and try again.';
  }

  if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
    return 'Your microphone is already in use by another app.';
  }

  return error?.message || 'Microphone access is required to answer the question.';
};

export const useVoiceInterviewSession = interview => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const discardRecordingRef = useRef(false);
  const pendingAutoRecordTimeoutRef = useRef(null);
  const maxRecordingTimerRef = useRef(null);
  const silenceCheckIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const recordingStartedAtRef = useRef(null);
  const speechDetectedRef = useRef(false);
  const lastSpeechAtRef = useRef(null);
  const sessionStateRef = useRef({});
  const audioRef = useRef(null);
  const firstQuestionAskedRef = useRef(false);
  const activeAnswerPartsRef = useRef([]);
  const followUpCountRef = useRef(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparingMic, setIsPreparingMic] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [followUpPrompt, setFollowUpPrompt] = useState(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [micPermission, setMicPermission] = useState('prompt');
  const [pendingAutoRecord, setPendingAutoRecord] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [sessionError, setSessionError] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const questions = useMemo(() => interview?.questions || [], [interview?.questions]);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    sessionStateRef.current = {
      interviewComplete,
      interviewStarted,
      isProcessing,
      isRecording,
      isSpeaking,
      savingReport,
    };
  }, [
    interviewComplete,
    interviewStarted,
    isPreparingMic,
    isProcessing,
    isRecording,
    isSpeaking,
    savingReport,
  ]);

  const clearPendingAutoRecord = useCallback(() => {
    if (pendingAutoRecordTimeoutRef.current) {
      window.clearTimeout(pendingAutoRecordTimeoutRef.current);
      pendingAutoRecordTimeoutRef.current = null;
    }

    setPendingAutoRecord(null);
  }, []);

  const cleanupRecordingMonitor = useCallback(() => {
    if (maxRecordingTimerRef.current) {
      window.clearTimeout(maxRecordingTimerRef.current);
      maxRecordingTimerRef.current = null;
    }

    if (silenceCheckIntervalRef.current) {
      window.clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }

    recordingStartedAtRef.current = null;
    speechDetectedRef.current = false;
    lastSpeechAtRef.current = null;

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  const requestMicrophoneAccess = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Audio recording is not supported in this browser.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: AUDIO_CONSTRAINTS,
    });
    stopMediaStream(stream);
    setMicPermission('granted');
  }, []);

  const scheduleAutoRecording = useCallback(
    questionNumber => {
      clearPendingAutoRecord();
      setPendingAutoRecord({
        questionNumber,
        requestedAt: Date.now(),
      });
    },
    [clearPendingAutoRecord],
  );

  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        if (!navigator.permissions?.query) return;

        const result = await navigator.permissions.query({
          name: 'microphone',
        });
        setMicPermission(result.state);

        result.onchange = () => {
          setMicPermission(result.state);
        };
      } catch {
        setMicPermission('prompt');
      }
    };

    checkMicPermission();
  }, []);

  useEffect(() => {
    if (!interview?._id) return undefined;

    const newSocket = io(SOCKET_URL);
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      setIsSocketConnected(true);
      newSocket.emit('join-interview', interview._id);
    });

    newSocket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    newSocket.on('analysis-result', data => {
      if (data?.analysis) {
        setFeedback(data.analysis);
      }
      setIsProcessing(false);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setIsSocketConnected(false);
    };
  }, [interview?._id]);

  useEffect(() => {
    firstQuestionAskedRef.current = false;
    activeAnswerPartsRef.current = [];
    followUpCountRef.current = 0;
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    setFeedback(null);
    setFollowUpPrompt(null);
    setInterimTranscript('');
    clearPendingAutoRecord();
    setInterviewComplete(false);
    setInterviewStarted(false);
    setIsPreparingMic(false);
    setSavingReport(false);
    setSaveError(null);
    setStartedAt(null);
    setSessionError(null);
  }, [clearPendingAutoRecord, interview?._id]);

  useEffect(
    () => () => {
      discardRecordingRef.current = true;
      clearPendingAutoRecord();
      cleanupRecordingMonitor();

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }

      stopMediaStream(mediaStreamRef.current);

      if (audioRef.current) {
        audioRef.current.pause();
      }
    },
    [cleanupRecordingMonitor, clearPendingAutoRecord],
  );

  const startInterview = useCallback(async () => {
    if (!interview?._id || isPreparingMic) return;

    setIsPreparingMic(true);
    setSessionError(null);

    try {
      await requestMicrophoneAccess();
    } catch (error) {
      setMicPermission(
        error?.name === 'NotAllowedError' || error?.name === 'SecurityError'
          ? 'denied'
          : 'prompt',
      );
      setSessionError(getMicrophoneErrorMessage(error));
      setIsPreparingMic(false);
      return;
    }

    setStartedAt(Date.now());
    setInterviewStarted(true);

    try {
      await interviewApi.updateInterview(interview._id, {
        status: 'in-progress',
      });
    } catch (error) {
      setSessionError(
        error.message || 'Interview started, but status could not be updated.',
      );
    } finally {
      setIsPreparingMic(false);
    }
  }, [interview?._id, isPreparingMic, requestMicrophoneAccess]);

  const completeInterview = useCallback(async () => {
    if (savingReport || !interview?._id) return;

    setInterviewComplete(true);
    setSavingReport(true);
    setSaveError(null);
    setSessionError(null);

    const completedQuestions = questions.map(question => {
      const savedAnswer = answers.find(
        answer => answer.questionNumber === question.questionNumber,
      );
      const score = Number(savedAnswer?.analysis?.score);

      return {
        questionNumber: question.questionNumber,
        question: question.question,
        category: question.category,
        expectedAnswer: question.expectedAnswer,
        userAnswer: savedAnswer?.answer || question.userAnswer || '',
        score: Number.isFinite(score) ? score : question.score,
      };
    });

    const answerScores = answers
      .map(answer => Number(answer.analysis?.score))
      .filter(Number.isFinite);
    const score = answerScores.length
      ? Math.round(
          (answerScores.reduce((total, value) => total + value, 0) /
            answerScores.length) *
            10,
        )
      : undefined;
    const duration = startedAt
      ? Math.max(1, Math.round((Date.now() - startedAt) / 60000))
      : undefined;
    const feedbackSummary = answers
      .map(answer => {
        const strengths = answer.analysis?.strengths?.length
          ? ` Strengths: ${answer.analysis.strengths.join('; ')}.`
          : '';
        const improvements = answer.analysis?.improvements?.length
          ? ` Improvements: ${answer.analysis.improvements.join('; ')}.`
          : '';

        return `Question ${answer.questionNumber}: ${
          answer.analysis?.feedback || 'No feedback saved.'
        }${strengths}${improvements}`;
      })
      .join('\n\n');

    try {
      await interviewApi.updateInterview(interview._id, {
        status: 'completed',
        score,
        feedback: feedbackSummary,
        duration,
        questions: completedQuestions,
      });
      navigate(`/profile/reports/${interview._id}`);
    } catch (error) {
      setSaveError(error.message || 'Failed to save interview report.');
    } finally {
      setSavingReport(false);
    }
  }, [
    answers,
    interview?._id,
    navigate,
    questions,
    savingReport,
    startedAt,
  ]);

  const askQuestion = useCallback(
    async index => {
      if (!questions.length) return;

      if (index >= questions.length) {
        await completeInterview();
        return;
      }

      const question = questions[index];
      activeAnswerPartsRef.current = [];
      followUpCountRef.current = 0;
      setCurrentQuestionIndex(index);
      setCurrentAnswer('');
      setFeedback(null);
      setFollowUpPrompt(null);
      setInterimTranscript('');
      setSessionError(null);

      try {
        setIsSpeaking(true);

        const response = await axios.post(`${PYTHON_API_URL}/text-to-speech`, {
          text: question.question,
          language: getTtsLanguageCode(interview?.language),
        });

        if (!response.data?.success) {
          setIsSpeaking(false);
          setSessionError('AI voice could not be generated for this question.');
          return;
        }

        const audioBlob = base64ToBlob(response.data.audio_data, 'audio/mp3');
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!audioRef.current) {
          setIsSpeaking(false);
          return;
        }

        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          socketRef.current?.emit('question-asked', {
            interviewId: interview._id,
            questionNumber: question.questionNumber,
          });
          scheduleAutoRecording(question.questionNumber);
        };

        await audioRef.current.play().catch(error => {
          setIsSpeaking(false);
          setSessionError(
            error.message ||
              'Browser blocked audio playback. You can still answer manually.',
          );
          scheduleAutoRecording(question.questionNumber);
        });
      } catch (error) {
        setIsSpeaking(false);
        setSessionError(error.message || 'Error asking the current question.');
      }
    },
    [
      completeInterview,
      interview?._id,
      interview?.language,
      questions,
      scheduleAutoRecording,
    ],
  );

  useEffect(() => {
    if (
      interviewStarted &&
      questions.length > 0 &&
      !firstQuestionAskedRef.current
    ) {
      firstQuestionAskedRef.current = true;
      askQuestion(0);
    }
  }, [askQuestion, interviewStarted, questions.length]);

  const speakInterviewerPrompt = useCallback(
    async (text, onEnded) => {
      if (!text) return;

      try {
        setIsSpeaking(true);

        const response = await axios.post(`${PYTHON_API_URL}/text-to-speech`, {
          text,
          language: getTtsLanguageCode(interview?.language),
        });

        if (!response.data?.success) {
          setIsSpeaking(false);
          onEnded?.();
          return;
        }

        const audioBlob = base64ToBlob(response.data.audio_data, 'audio/mp3');
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!audioRef.current) {
          setIsSpeaking(false);
          onEnded?.();
          return;
        }

        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          onEnded?.();
        };

        await audioRef.current.play().catch(() => {
          setIsSpeaking(false);
          onEnded?.();
        });
      } catch {
        setIsSpeaking(false);
        onEnded?.();
      }
    },
    [interview?.language],
  );

  const processAnswer = useCallback(
    async answerText => {
      const question = questions[currentQuestionIndex];
      const cleanedAnswer = answerText.trim();

      if (!question) {
        setSessionError('No question is active for this answer.');
        return;
      }

      if (!cleanedAnswer) {
        setSessionError('No speech was detected. Please try again.');
        return;
      }

      const answerParts = [...activeAnswerPartsRef.current, cleanedAnswer];
      const combinedAnswer = answerParts.join('\n').trim();

      try {
        setIsProcessing(true);
        setCurrentAnswer(combinedAnswer);
        setInterimTranscript('');
        setSessionError(null);

        socketRef.current?.emit('answer-submitted', {
          interviewId: interview._id,
          questionNumber: question.questionNumber,
          answer: combinedAnswer,
        });

        const analysisResponse = await axios.post(
          `${PYTHON_API_URL}/analyze-answer`,
          {
            question: question.question,
            answer: combinedAnswer,
            latestAnswer: cleanedAnswer,
            expectedAnswer: question.expectedAnswer,
            followUpCount: followUpCountRef.current,
          },
        );

        if (!analysisResponse.data?.success) {
          setSessionError('Answer analysis did not return a result.');
          return;
        }

        const analysis = analysisResponse.data.analysis;
        const followUpQuestion = analysis.follow_up_question?.trim();
        const canAskFollowUp =
          analysis.needs_follow_up &&
          followUpQuestion &&
          followUpCountRef.current < MAX_FOLLOW_UPS_PER_QUESTION;

        if (canAskFollowUp) {
          activeAnswerPartsRef.current = answerParts;
          followUpCountRef.current += 1;
          setFeedback(null);
          setFollowUpPrompt(followUpQuestion);

          await speakInterviewerPrompt(followUpQuestion, () => {
            scheduleAutoRecording(question.questionNumber);
          });
          return;
        }

        const finalAnalysis = {
          ...analysis,
          needs_follow_up: false,
          follow_up_question: '',
        };

        socketRef.current?.emit('answer-analyzed', {
          interviewId: interview._id,
          questionNumber: question.questionNumber,
          analysis: finalAnalysis,
        });

        const answerRecord = {
          questionNumber: question.questionNumber,
          question: question.question,
          answer: combinedAnswer,
          analysis: finalAnalysis,
        };

        activeAnswerPartsRef.current = [];
        followUpCountRef.current = 0;
        setFollowUpPrompt(null);
        setAnswers(previous => [
          ...previous.filter(
            answer => answer.questionNumber !== question.questionNumber,
          ),
          answerRecord,
        ]);
        setFeedback(finalAnalysis);

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
          await speakInterviewerPrompt('Thanks. Let us continue.', () => {
            askQuestion(nextIndex);
          });
        }
      } catch (error) {
        setSessionError(
          error.message || 'Error processing your answer. Please try again.',
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [
      askQuestion,
      currentQuestionIndex,
      interview?._id,
      questions,
      scheduleAutoRecording,
      speakInterviewerPrompt,
    ],
  );

  const submitRecording = useCallback(
    async audioBlob => {
      const question = questions[currentQuestionIndex];

      if (!question) {
        setSessionError('No question is active for this answer.');
        setInterimTranscript('');
        return;
      }

      if (!audioBlob?.size) {
        setSessionError('No audio was recorded. Please try again.');
        setInterimTranscript('');
        return;
      }

      try {
        setIsProcessing(true);
        setInterimTranscript('Transcribing your answer...');
        setSessionError(null);

        const formData = new FormData();
        const mimeType = audioBlob.type || 'audio/webm';
        const extension = getAudioFileExtension(mimeType);

        formData.append(
          'audio',
          audioBlob,
          `answer-${interview?._id || 'interview'}-${question.questionNumber}.${extension}`,
        );
        formData.append(
          'language',
          getTranscriptionLanguageCode(interview?.language),
        );
        formData.append('interviewId', interview?._id || '');
        formData.append('questionNumber', String(question.questionNumber));

        const response = await axios.post(
          `${PYTHON_API_URL}/speech-to-text`,
          formData,
          {
            timeout: 120000,
          },
        );
        const transcript = response.data?.text?.trim();

        if (!response.data?.success || !transcript) {
          setSessionError('No speech was detected. Please try again.');
          setInterimTranscript('');
          setIsProcessing(false);
          return;
        }

        setInterimTranscript(transcript);
        await processAnswer(transcript);
      } catch (error) {
        setSessionError(
          getApiErrorMessage(
            error,
            'Error transcribing your answer. Please try again.',
          ),
        );
        setInterimTranscript('');
        setIsProcessing(false);
      }
    },
    [
      currentQuestionIndex,
      interview?._id,
      interview?.language,
      processAnswer,
      questions,
    ],
  );

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === 'inactive') return;

    cleanupRecordingMonitor();
    setInterimTranscript('Transcribing your answer...');
    setIsRecording(false);
    recorder.stop();
  }, [cleanupRecordingMonitor]);

  const setupRecordingMonitor = useCallback(
    stream => {
      cleanupRecordingMonitor();
      recordingStartedAtRef.current = Date.now();
      speechDetectedRef.current = false;
      lastSpeechAtRef.current = null;

      maxRecordingTimerRef.current = window.setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_DURATION_MS);

      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 2048;
        const samples = new Uint8Array(analyser.fftSize);
        source.connect(analyser);
        audioContextRef.current = audioContext;

        silenceCheckIntervalRef.current = window.setInterval(() => {
          analyser.getByteTimeDomainData(samples);

          let sum = 0;
          for (let i = 0; i < samples.length; i += 1) {
            const value = (samples[i] - 128) / 128;
            sum += value * value;
          }

          const rms = Math.sqrt(sum / samples.length);
          const now = Date.now();

          if (rms >= SILENCE_RMS_THRESHOLD) {
            speechDetectedRef.current = true;
            lastSpeechAtRef.current = now;
            return;
          }

          const hasMinimumDuration =
            recordingStartedAtRef.current &&
            now - recordingStartedAtRef.current >= MIN_RECORDING_DURATION_MS;
          const hasEnoughSilence =
            speechDetectedRef.current &&
            lastSpeechAtRef.current &&
            now - lastSpeechAtRef.current >= SILENCE_STOP_DELAY_MS;

          if (hasMinimumDuration && hasEnoughSilence) {
            stopRecording();
          }
        }, SILENCE_CHECK_INTERVAL_MS);
      } catch {
        // Recording still works without silence detection; the user can stop manually.
      }
    },
    [cleanupRecordingMonitor, stopRecording],
  );

  const startRecording = useCallback(
    async ({ autoStarted = false } = {}) => {
      const state = sessionStateRef.current;

      try {
        if (
          state.isRecording ||
          state.isProcessing ||
          state.isSpeaking ||
          state.savingReport ||
          state.interviewComplete
        ) {
          return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
          setSessionError(
            'Audio recording is not supported in this browser. Please use a modern browser.',
          );
          return;
        }

        if (!window.MediaRecorder) {
          setSessionError(
            'Media recording is not supported in this browser. Please use Chrome, Edge, or Firefox.',
          );
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: AUDIO_CONSTRAINTS,
        });
        mediaStreamRef.current = stream;

        const mimeType = getSupportedAudioMimeType();
        const recorder = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : undefined,
        );

        audioChunksRef.current = [];
        discardRecordingRef.current = false;

        recorder.onstart = () => {
          setIsRecording(true);
          setInterimTranscript(
            autoStarted ? 'Listening for your answer...' : 'Recording audio...',
          );
          setSessionError(null);
          setMicPermission('granted');
          setupRecordingMonitor(stream);
        };

        recorder.ondataavailable = event => {
          if (event.data?.size) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onerror = event => {
          cleanupRecordingMonitor();
          setIsRecording(false);
          setIsProcessing(false);
          setInterimTranscript('');
          setSessionError(
            event.error?.message || 'Audio recording failed. Please try again.',
          );
          stopMediaStream(stream);
        };

        recorder.onstop = () => {
          cleanupRecordingMonitor();
          setIsRecording(false);

          const chunks = audioChunksRef.current;
          audioChunksRef.current = [];
          stopMediaStream(stream);
          mediaStreamRef.current = null;
          mediaRecorderRef.current = null;

          if (discardRecordingRef.current) {
            discardRecordingRef.current = false;
            setInterimTranscript('');
            return;
          }

          const recordedMimeType = recorder.mimeType || mimeType || 'audio/webm';
          const audioBlob = new Blob(chunks, { type: recordedMimeType });
          submitRecording(audioBlob);
        };

        mediaRecorderRef.current = recorder;
        recorder.start(1000);
      } catch (error) {
        if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
          setMicPermission('denied');
        }

        setSessionError(getMicrophoneErrorMessage(error));
        stopMediaStream(mediaStreamRef.current);
        mediaStreamRef.current = null;
      }
    },
    [cleanupRecordingMonitor, setupRecordingMonitor, submitRecording],
  );

  useEffect(() => {
    if (!pendingAutoRecord) return undefined;

    if (
      !interviewStarted ||
      isSpeaking ||
      isRecording ||
      isProcessing ||
      savingReport ||
      interviewComplete ||
      micPermission === 'denied'
    ) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      pendingAutoRecordTimeoutRef.current = null;
      startRecording({ autoStarted: true });
      setPendingAutoRecord(null);
    }, AUTO_RECORD_DELAY_MS);

    pendingAutoRecordTimeoutRef.current = timeoutId;

    return () => {
      window.clearTimeout(timeoutId);
      if (pendingAutoRecordTimeoutRef.current === timeoutId) {
        pendingAutoRecordTimeoutRef.current = null;
      }
    };
  }, [
    interviewComplete,
    interviewStarted,
    isPreparingMic,
    isProcessing,
    isRecording,
    isSpeaking,
    micPermission,
    pendingAutoRecord,
    savingReport,
    startRecording,
  ]);

  const nextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      askQuestion(nextIndex);
    } else {
      completeInterview();
    }
  }, [askQuestion, completeInterview, currentQuestionIndex, questions.length]);

  const leaveInterview = useCallback(() => {
    discardRecordingRef.current = true;
    clearPendingAutoRecord();
    cleanupRecordingMonitor();

    if (
      mediaRecorderRef.current &&
      isRecording &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    stopMediaStream(mediaStreamRef.current);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    navigate('/profile/interviews');
  }, [clearPendingAutoRecord, cleanupRecordingMonitor, isRecording, navigate]);

  const clearSessionError = useCallback(() => {
    setSessionError(null);
  }, []);

  return {
    audioRef,
    answers,
    clearSessionError,
    completeInterview,
    currentAnswer,
    currentQuestion,
    currentQuestionIndex,
    feedback,
    followUpPrompt,
    interimTranscript,
    interviewComplete,
    interviewStarted,
    isPreparingMic,
    isProcessing,
    isRecording,
    isSocketConnected,
    isSpeaking,
    leaveInterview,
    micPermission,
    nextQuestion,
    questionCount: questions.length,
    saveError,
    savingReport,
    sessionError,
    startInterview,
    startRecording,
    stopRecording,
  };
};
