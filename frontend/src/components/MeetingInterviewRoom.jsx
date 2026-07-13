import {
  AlertTriangle,
  Bot,
  Camera,
  CameraOff,
  CheckCircle2,
  CircleDot,
  Loader2,
  LogOut,
  MessageSquareText,
  Mic,
  MicOff,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Volume2,
  WifiOff,
} from 'lucide-react';
import { createElement } from 'react';
import { cn } from '@/lib/utils';
import { useVideoMonitor } from '../hooks/useVideoMonitor';
import { useVoiceInterviewSession } from '../hooks/useVoiceInterviewSession';
import { Button } from './ui/button';

const monitorConfig = {
  off: {
    label: 'Camera off',
    icon: CameraOff,
    className: 'border-slate-200 bg-white text-slate-600',
  },
  connecting: {
    label: 'Connecting',
    icon: Loader2,
    className: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  monitoring: {
    label: 'Monitoring',
    icon: ShieldCheck,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  warning: {
    label: 'Attention',
    icon: ShieldAlert,
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  error: {
    label: 'Monitoring issue',
    icon: WifiOff,
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

const getPhase = session => {
  if (!session.interviewStarted) {
    return {
      label: 'Ready to join',
      icon: CircleDot,
      className: 'border-slate-200 bg-white text-slate-600',
    };
  }

  if (session.isPreparingMic) {
    return {
      label: 'Preparing mic',
      icon: Loader2,
      className: 'border-sky-200 bg-sky-50 text-sky-700',
    };
  }

  if (session.savingReport) {
    return {
      label: 'Saving report',
      icon: Loader2,
      className: 'border-sky-200 bg-sky-50 text-sky-700',
    };
  }

  if (session.isProcessing) {
    return {
      label: 'Analyzing',
      icon: Loader2,
      className: 'border-amber-200 bg-amber-50 text-amber-700',
    };
  }

  if (session.isSpeaking) {
    return {
      label: 'AI speaking',
      icon: Volume2,
      className: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    };
  }

  if (session.isRecording) {
    return {
      label: 'Listening',
      icon: Mic,
      className: 'border-red-200 bg-red-50 text-red-700',
    };
  }

  if (session.feedback) {
    return {
      label: 'Answer captured',
      icon: CheckCircle2,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
  }

  return {
    label: 'Waiting for answer',
    icon: Mic,
    className: 'border-slate-200 bg-white text-slate-600',
  };
};

const StatusPill = ({ config, compact = false }) => {
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-semibold shadow-sm shadow-slate-200/60',
        compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
        config.className,
      )}
    >
      <Icon
        className={cn(
          compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
          config.icon === Loader2 && 'animate-spin',
        )}
      />
      {config.label}
    </span>
  );
};

const ControlButton = ({
  active,
  children,
  className,
  danger,
  disabled,
  icon: Icon,
  label,
  onClick,
  title,
}) => (
  <Button
    type='button'
    aria-label={title || label}
    title={title || label}
    disabled={disabled}
    onClick={onClick}
    variant={danger ? 'destructive' : 'outline'}
    size={children ? 'default' : 'icon'}
    className={cn(
      'h-14 rounded-full border-slate-200 bg-white text-slate-800 shadow-xl shadow-slate-300/50 hover:bg-slate-50 focus-visible:ring-slate-900 disabled:opacity-45',
      children ? 'min-w-[150px] px-5' : 'w-14 px-0',
      active && 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
      danger && 'border-red-500 bg-red-600 text-white hover:bg-red-500',
      className,
    )}
  >
    {createElement(Icon, { className: 'h-5 w-5' })}
    {children || <span className='sr-only'>{label}</span>}
  </Button>
);

const ConversationBubble = ({ meta, text, tone = 'default', title }) => (
  <article
    className={cn(
      'rounded-2xl border p-3 shadow-sm',
      tone === 'ai' && 'border-indigo-100 bg-indigo-50/80',
      tone === 'candidate' && 'border-slate-200 bg-white',
      tone === 'feedback' && 'border-emerald-100 bg-emerald-50/80',
      tone === 'live' && 'border-red-100 bg-red-50/80',
      tone === 'default' && 'border-slate-200 bg-slate-50',
    )}
  >
    <div className='flex items-center justify-between gap-3'>
      <p className='truncate text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
        {title}
      </p>
      {meta && <span className='shrink-0 text-[11px] font-semibold text-slate-400'>{meta}</span>}
    </div>
    <p className='mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700'>
      {text}
    </p>
  </article>
);

const buildConversationItems = session => {
  const currentQuestionNumber = session.currentQuestion?.questionNumber;
  const currentAnswerSaved = session.answers.some(
    answer => answer.questionNumber === currentQuestionNumber,
  );
  const items = [];

  session.answers.forEach(answer => {
    items.push({
      key: `q-${answer.questionNumber}`,
      title: 'AI question',
      meta: `Q${answer.questionNumber}`,
      text: answer.question,
      tone: 'ai',
    });
    items.push({
      key: `a-${answer.questionNumber}`,
      title: 'Candidate answer',
      meta: `Q${answer.questionNumber}`,
      text: answer.answer,
      tone: 'candidate',
    });
  });

  if (session.interviewStarted && session.currentQuestion && !currentAnswerSaved) {
    items.push({
      key: `current-q-${currentQuestionNumber || session.currentQuestionIndex}`,
      title: 'AI question',
      meta: `Q${session.currentQuestionIndex + 1}`,
      text: session.currentQuestion.question,
      tone: 'ai',
    });
  }

  if (session.interimTranscript) {
    items.push({
      key: 'live-transcript',
      title: 'Live transcript',
      meta: 'Now',
      text: session.interimTranscript,
      tone: 'live',
    });
  }

  if (session.currentAnswer && !currentAnswerSaved) {
    items.push({
      key: 'current-answer',
      title: 'Candidate answer',
      meta: 'Submitted',
      text: session.currentAnswer,
      tone: 'candidate',
    });
  }

  if (session.followUpPrompt && !currentAnswerSaved) {
    items.push({
      key: 'current-follow-up',
      title: 'AI follow-up',
      meta: `Q${session.currentQuestionIndex + 1}`,
      text: session.followUpPrompt,
      tone: 'ai',
    });
  }

  if (!items.length) {
    items.push({
      key: 'empty',
      title: 'Conversation',
      meta: 'Lobby',
      text: 'Join the interview to start the conversation. AI questions, your answers, follow-ups, and live transcript will appear here.',
      tone: 'default',
    });
  }

  return items;
};

const MeetingInterviewRoom = ({ interview }) => {
  const video = useVideoMonitor({
    interviewId: interview?._id,
    autoStart: true,
  });
  const session = useVoiceInterviewSession(interview);

  const phase = getPhase(session);
  const monitor = monitorConfig[video.monitorStatus] || monitorConfig.off;
  const progressPercent = session.questionCount
    ? Math.min(
        100,
        Math.round((session.answers.length / session.questionCount) * 100),
      )
    : 0;
  const conversationItems = buildConversationItems(session);
  const hasBlockingError = session.saveError || session.sessionError;
  const micDisabled =
    !session.interviewStarted ||
    session.isSpeaking ||
    session.isPreparingMic ||
    session.isProcessing ||
    session.micPermission === 'denied' ||
    session.savingReport ||
    session.interviewComplete;
  const canAdvance =
    Boolean(session.feedback) && !session.isSpeaking && !session.savingReport;
  const nextActionLabel =
    session.currentQuestionIndex < session.questionCount - 1
      ? 'Next question'
      : 'Finish interview';

  const handleJoin = () => {
    if (!video.isVideoEnabled) {
      video.turnVideoOn();
    }

    session.startInterview();
  };

  const handleMic = () => {
    if (session.isRecording) {
      session.stopRecording();
      return;
    }

    session.startRecording();
  };

  const handleLeave = () => {
    video.turnVideoOff();
    session.leaveInterview();
  };

  return (
    <div className='h-[calc(100dvh-92px)] overflow-hidden bg-slate-50 px-3 py-3 text-slate-950 sm:px-4'>
      <audio ref={session.audioRef} className='hidden' />
      <canvas ref={video.canvasRef} className='hidden' />

      <div className='mx-auto grid h-full max-w-7xl gap-3 lg:grid-cols-[minmax(0,1fr)_390px]'>
        <section className='relative min-h-0 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/50'>
          <div className='absolute inset-0 bg-slate-950'>
            {video.isVideoEnabled ? (
              <video
                ref={video.videoRef}
                className={cn(
                  'h-full w-full scale-x-[-1] object-cover',
                  !video.hasVideoStream && 'opacity-30',
                )}
                muted
                playsInline
                autoPlay
              />
            ) : (
              <div className='flex h-full flex-col items-center justify-center gap-4 bg-slate-100 text-slate-500'>
                <CameraOff className='h-16 w-16 text-slate-400' />
                <p className='text-sm font-semibold'>Camera is off</p>
              </div>
            )}
          </div>

          {video.isVideoEnabled && !video.hasVideoStream && (
            <div className='absolute inset-0 flex items-center justify-center bg-slate-950/40'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-xl shadow-slate-950/20 backdrop-blur'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Starting camera
              </div>
            </div>
          )}

          <header className='absolute left-4 right-4 top-4 z-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div className='max-w-[min(520px,100%)] rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-950/15 backdrop-blur-xl'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-300/60'>
                  <UserRound className='h-5 w-5' />
                </span>
                <div className='min-w-0'>
                  <h1 className='truncate text-base font-semibold text-slate-950 sm:text-lg'>
                    AI Interview Meeting
                  </h1>
                  <p className='truncate text-xs text-slate-500'>
                    {interview?.interviewType || 'Interview'} |{' '}
                    {interview?.language || 'Language not set'} |{' '}
                    {interview?.complexity || 'Complexity not set'}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap gap-2 sm:justify-end'>
              <StatusPill config={phase} />
              <StatusPill config={monitor} />
            </div>
          </header>

          <div className='absolute bottom-24 left-4 z-10 hidden max-w-[420px] rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-950/15 backdrop-blur-xl md:block'>
            <div className='flex items-center justify-between gap-3 text-sm'>
              <div>
                <p className='font-semibold text-slate-950'>Candidate</p>
                <p className='mt-1 text-xs text-slate-500'>
                  Faces detected: {video.facesDetected} | Frames checked: {video.framesSent}
                </p>
              </div>
              <div className='text-right text-xs font-semibold text-slate-500'>
                {session.answers.length}/{session.questionCount || 0} answered
              </div>
            </div>
            <div className='mt-3 h-2 overflow-hidden rounded-full bg-slate-200'>
              <div
                className='h-full rounded-full bg-indigo-600 transition-all duration-500'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className='absolute bottom-24 right-4 z-10 flex h-24 w-24 items-center justify-center rounded-[24px] border border-white/80 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:h-32 sm:w-32'>
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-slate-700 text-white shadow-lg shadow-slate-300/70 sm:h-20 sm:w-20',
                session.isSpeaking && 'ring-4 ring-indigo-200',
                session.isRecording && 'ring-4 ring-red-200',
              )}
              title='AI interviewer'
            >
              <Bot className='h-8 w-8 sm:h-10 sm:w-10' />
            </div>
          </div>

          {video.violations.length > 0 && (
            <div className='absolute right-4 top-24 z-10 max-w-[min(360px,calc(100%-2rem))] rounded-3xl border border-amber-200 bg-amber-50/95 p-4 text-sm text-amber-800 shadow-xl shadow-slate-950/10 backdrop-blur-xl'>
              <div className='mb-1 flex items-center gap-2 font-semibold'>
                <AlertTriangle className='h-4 w-4' />
                Monitoring warning
              </div>
              <p className='line-clamp-2'>{video.violations[0]}</p>
            </div>
          )}

          {hasBlockingError && (
            <div className='absolute left-1/2 top-24 z-20 w-[min(520px,calc(100%-2rem))] -translate-x-1/2 rounded-3xl border border-red-200 bg-red-50/95 p-4 text-sm text-red-800 shadow-xl shadow-slate-950/10 backdrop-blur-xl'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='mt-0.5 h-5 w-5 shrink-0' />
                <div className='min-w-0 flex-1'>
                  <p className='font-semibold'>Action needed</p>
                  <p className='mt-1 line-clamp-2'>{session.saveError || session.sessionError}</p>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {session.sessionError && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={session.clearSessionError}
                      >
                        Dismiss
                      </Button>
                    )}
                    {session.saveError && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={session.completeInterview}
                      >
                        Retry save
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='absolute bottom-4 left-1/2 z-20 w-[min(680px,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-white/80 bg-white/95 px-3 py-3 shadow-2xl shadow-slate-950/20 backdrop-blur-xl'>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <ControlButton
                active={session.isRecording}
                danger={session.isRecording}
                disabled={micDisabled && !session.isRecording}
                icon={session.isRecording ? MicOff : Mic}
                label={session.isRecording ? 'Stop microphone' : 'Microphone'}
                onClick={handleMic}
                title={session.isRecording ? 'Stop recording answer' : 'Start recording answer'}
              />
              <ControlButton
                active={video.isVideoEnabled}
                danger={!video.isVideoEnabled}
                icon={video.isVideoEnabled ? Camera : CameraOff}
                label={video.isVideoEnabled ? 'Camera' : 'Camera off'}
                onClick={video.toggleVideo}
                title={video.isVideoEnabled ? 'Turn camera off' : 'Turn camera on'}
              />

              {video.monitorStatus === 'error' && (
                <ControlButton
                  icon={RefreshCw}
                  label='Retry camera'
                  onClick={video.retryMonitoring}
                  title='Retry camera monitoring'
                />
              )}

              {!session.interviewStarted && (
                <ControlButton
                  active
                  className='border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-500'
                  disabled={session.isPreparingMic}
                  icon={session.isPreparingMic ? Loader2 : Volume2}
                  label='Join interview'
                  onClick={handleJoin}
                  title='Join interview'
                >
                  <span>Join</span>
                </ControlButton>
              )}

              {session.interviewStarted && canAdvance && (
                <ControlButton
                  active
                  className='border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-500'
                  disabled={session.savingReport}
                  icon={session.savingReport ? Loader2 : CheckCircle2}
                  label={nextActionLabel}
                  onClick={session.nextQuestion}
                  title={nextActionLabel}
                >
                  <span>{nextActionLabel}</span>
                </ControlButton>
              )}

              <ControlButton
                danger
                icon={LogOut}
                label='Leave'
                onClick={handleLeave}
                title='Leave interview'
              />
            </div>
          </div>
        </section>

        <aside className='flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/50'>
          <div className='border-b border-slate-200 p-4'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <span className='inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700'>
                  <MessageSquareText className='h-5 w-5' />
                </span>
                <div>
                  <h2 className='text-base font-semibold text-slate-950'>Conversation</h2>
                  <p className='text-xs text-slate-500'>Questions, answers, follow-ups, transcript</p>
                </div>
              </div>
              <StatusPill config={phase} compact />
            </div>

            <div className='mt-4 flex items-center justify-between text-xs font-semibold text-slate-500'>
              <span>
                Question {Math.min(session.currentQuestionIndex + 1, session.questionCount || 1)} of{' '}
                {session.questionCount || 0}
              </span>
              <span>{progressPercent}% complete</span>
            </div>
            <div className='mt-2 h-2 overflow-hidden rounded-full bg-slate-200'>
              <div
                className='h-full rounded-full bg-indigo-600 transition-all duration-500'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className='min-h-0 flex-1 space-y-3 overflow-y-auto p-4'>
            {conversationItems.map(item => (
              <ConversationBubble
                key={item.key}
                meta={item.meta}
                text={item.text}
                title={item.title}
                tone={item.tone}
              />
            ))}
          </div>

          <div className='border-t border-slate-200 p-4 text-xs text-slate-500'>
            <div className='flex items-center justify-between gap-3'>
              <span>{session.isSocketConnected ? 'Interview online' : 'Interview connecting'}</span>
              <span>{monitor.label}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MeetingInterviewRoom;