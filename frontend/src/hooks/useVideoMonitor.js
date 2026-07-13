import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const PYTHON_SERVICE_URL =
  import.meta.env.VITE_PYTHON_SERVICE_URL ||
  import.meta.env.VITE_PDF_SERVICE_URL ||
  'http://localhost:8000';

const FRAME_INTERVAL_MS = 1000;
const FRAME_WIDTH = 320;
const JPEG_QUALITY = 0.62;

const buildMonitoringUrl = baseUrl => {
  const normalizedBase = /^https?:\/\//i.test(baseUrl)
    ? baseUrl
    : `http://${baseUrl}`;
  const url = new URL(normalizedBase);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/ws/monitor';
  url.search = '';
  url.hash = '';
  return url.toString();
};

export const useVideoMonitor = ({ interviewId, autoStart = true }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const frameTimerRef = useRef(null);
  const pingTimerRef = useRef(null);
  const awaitingAnalysisRef = useRef(false);
  const videoEnabledRef = useRef(autoStart);

  const [isVideoEnabled, setIsVideoEnabled] = useState(autoStart);
  const [hasVideoStream, setHasVideoStream] = useState(false);
  const [monitorStatus, setMonitorStatus] = useState(
    autoStart ? 'connecting' : 'off',
  );
  const [message, setMessage] = useState(
    autoStart ? 'Requesting camera access...' : 'Camera is off.',
  );
  const [facesDetected, setFacesDetected] = useState(0);
  const [violations, setViolations] = useState([]);
  const [framesSent, setFramesSent] = useState(0);
  const [retryToken, setRetryToken] = useState(0);

  const monitoringUrl = useMemo(() => buildMonitoringUrl(PYTHON_SERVICE_URL), []);

  useEffect(() => {
    videoEnabledRef.current = isVideoEnabled;
  }, [isVideoEnabled]);

  const stopConnection = useCallback(
    (updateState = true) => {
      if (frameTimerRef.current) {
        window.clearInterval(frameTimerRef.current);
        frameTimerRef.current = null;
      }

      if (pingTimerRef.current) {
        window.clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }

      const socket = socketRef.current;
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;

        try {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'stop_monitoring', interviewId }));
          }
          socket.close();
        } catch {
          // The socket may already be closed by the browser or server.
        }

        socketRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      awaitingAnalysisRef.current = false;

      if (updateState) {
        setHasVideoStream(false);
      }
    },
    [interviewId],
  );

  const captureFrame = useCallback(() => {
    const socket = socketRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !socket ||
      socket.readyState !== WebSocket.OPEN ||
      !video ||
      !canvas ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
      awaitingAnalysisRef.current
    ) {
      return;
    }

    const ratio =
      video.videoWidth && video.videoHeight
        ? video.videoHeight / video.videoWidth
        : 9 / 16;
    canvas.width = FRAME_WIDTH;
    canvas.height = Math.round(FRAME_WIDTH * ratio);

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

    try {
      awaitingAnalysisRef.current = true;
      setFramesSent(count => count + 1);
      socket.send(
        JSON.stringify({
          type: 'video_frame',
          interviewId,
          data: frame,
        }),
      );
    } catch {
      awaitingAnalysisRef.current = false;
      setMonitorStatus('error');
      setMessage('Could not send camera frame to monitoring service.');
    }
  }, [interviewId]);

  useEffect(() => {
    let cancelled = false;

    if (!isVideoEnabled) {
      stopConnection();
      setMonitorStatus('off');
      setMessage('Camera is off.');
      setFacesDetected(0);
      setViolations([]);
      return undefined;
    }

    const startMonitoring = async () => {
      stopConnection();
      setMonitorStatus('connecting');
      setMessage('Requesting camera access...');
      setFacesDetected(0);
      setViolations([]);
      setFramesSent(0);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera access is not supported in this browser.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
            width: { ideal: 960 },
            height: { ideal: 540 },
          },
        });

        if (cancelled || !videoEnabledRef.current) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        setHasVideoStream(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }

        setMessage('Connecting to monitoring service...');
        const socket = new WebSocket(monitoringUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          if (cancelled || socketRef.current !== socket) return;

          socket.send(JSON.stringify({ type: 'start_monitoring', interviewId }));
          setMonitorStatus('monitoring');
          setMessage('Camera monitoring is active.');
          frameTimerRef.current = window.setInterval(
            captureFrame,
            FRAME_INTERVAL_MS,
          );
          pingTimerRef.current = window.setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: 'ping', interviewId }));
            }
          }, 15000);
        };

        socket.onmessage = event => {
          if (cancelled || socketRef.current !== socket) return;

          try {
            const response = JSON.parse(event.data);

            if (response.type === 'analysis_result') {
              awaitingAnalysisRef.current = false;
              const result = response.data || {};
              setFacesDetected(result.faces_detected || 0);
              setViolations(result.violations || []);
              setMessage(result.message || 'Monitoring active.');

              if (result.status === 'WARNING') {
                setMonitorStatus('warning');
              } else if (result.status === 'ERROR') {
                setMonitorStatus('error');
              } else {
                setMonitorStatus('monitoring');
              }
            } else if (response.type === 'error') {
              awaitingAnalysisRef.current = false;
              setMonitorStatus('error');
              setMessage(response.message || 'Monitoring service returned an error.');
            }
          } catch {
            awaitingAnalysisRef.current = false;
            setMonitorStatus('error');
            setMessage('Monitoring service sent an invalid response.');
          }
        };

        socket.onerror = () => {
          if (cancelled || socketRef.current !== socket) return;
          awaitingAnalysisRef.current = false;
          setMonitorStatus('error');
          setMessage('Could not connect to the monitoring service.');
        };

        socket.onclose = () => {
          if (
            cancelled ||
            socketRef.current !== socket ||
            !videoEnabledRef.current
          ) {
            return;
          }

          awaitingAnalysisRef.current = false;
          setMonitorStatus('error');
          setMessage('Monitoring service disconnected.');
        };
      } catch (error) {
        if (cancelled) return;
        setHasVideoStream(false);
        setMonitorStatus('error');
        setMessage(
          error.message || 'Camera permission or monitoring setup failed.',
        );
      }
    };

    startMonitoring();

    return () => {
      cancelled = true;
      stopConnection(false);
    };
  }, [
    captureFrame,
    interviewId,
    isVideoEnabled,
    monitoringUrl,
    retryToken,
    stopConnection,
  ]);

  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(enabled => !enabled);
  }, []);

  const turnVideoOn = useCallback(() => {
    setIsVideoEnabled(true);
  }, []);

  const turnVideoOff = useCallback(() => {
    setIsVideoEnabled(false);
  }, []);

  const retryMonitoring = useCallback(() => {
    if (!isVideoEnabled) {
      setIsVideoEnabled(true);
      return;
    }

    setRetryToken(token => token + 1);
  }, [isVideoEnabled]);

  return {
    videoRef,
    canvasRef,
    monitorStatus,
    message,
    facesDetected,
    violations,
    framesSent,
    hasVideoStream,
    isVideoEnabled,
    toggleVideo,
    turnVideoOn,
    turnVideoOff,
    retryMonitoring,
  };
};
