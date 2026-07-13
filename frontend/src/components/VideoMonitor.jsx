import {
  AlertTriangle,
  Camera,
  CameraOff,
  Loader2,
  RefreshCw,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { useVideoMonitor } from '../hooks/useVideoMonitor';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const statusConfig = {
  off: {
    icon: CameraOff,
    label: 'Camera off',
    className: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  connecting: {
    icon: Loader2,
    label: 'Connecting',
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  monitoring: {
    icon: ShieldCheck,
    label: 'Monitoring active',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Attention needed',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  error: {
    icon: WifiOff,
    label: 'Monitoring issue',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

const VideoMonitor = ({ interviewId }) => {
  const video = useVideoMonitor({ interviewId, autoStart: true });
  const config = statusConfig[video.monitorStatus] || statusConfig.off;
  const StatusIcon = config.icon;

  return (
    <Card className='bg-white'>
      <CardHeader className='gap-3 p-5 pb-3 sm:p-5 sm:pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Camera className='h-5 w-5' />
              Video Monitoring
            </CardTitle>
            <CardDescription>Live face presence check</CardDescription>
          </div>
          <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>
            <StatusIcon className={`h-3.5 w-3.5 ${video.monitorStatus === 'connecting' ? 'animate-spin' : ''}`} />
            {config.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4 p-5 pt-0 sm:p-5 sm:pt-0'>
        <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950'>
          {video.isVideoEnabled ? (
            <video
              ref={video.videoRef}
              className='aspect-video w-full scale-x-[-1] object-cover'
              muted
              playsInline
              autoPlay
            />
          ) : (
            <div className='flex aspect-video w-full flex-col items-center justify-center gap-2 text-slate-300'>
              <CameraOff className='h-8 w-8' />
              <span className='text-sm'>Camera is off</span>
            </div>
          )}
          <div className='absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white backdrop-blur'>
            Faces: {video.facesDetected}
          </div>
        </div>

        <canvas ref={video.canvasRef} className='hidden' />

        <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
          <p className='text-sm font-medium text-slate-900'>{video.message}</p>
          <p className='mt-1 text-xs text-slate-500'>Frames checked: {video.framesSent}</p>
          {video.violations.length > 0 && (
            <ul className='mt-3 space-y-1 text-sm text-amber-700'>
              {video.violations.map(item => (
                <li key={item} className='flex gap-2'>
                  <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='grid gap-2 sm:grid-cols-2'>
          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={video.toggleVideo}
          >
            {video.isVideoEnabled ? <CameraOff className='h-4 w-4' /> : <Camera className='h-4 w-4' />}
            {video.isVideoEnabled ? 'Turn camera off' : 'Turn camera on'}
          </Button>
          {video.monitorStatus === 'error' && (
            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={video.retryMonitoring}
            >
              <RefreshCw className='h-4 w-4' />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoMonitor;
