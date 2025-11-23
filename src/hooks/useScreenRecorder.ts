import { useState, useRef, useCallback } from 'react';
import { CursorPosition, ZoomPoint, RecordingSettings } from '../types';

export function useScreenRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cursorPositionsRef = useRef<CursorPosition[]>([]);
  const zoomPointsRef = useRef<ZoomPoint[]>([]);
  const currentZoomRef = useRef({ x: 0, y: 0, scale: 1 });
  const targetZoomRef = useRef({ x: 0, y: 0, scale: 1 });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = useCallback(async (settings: RecordingSettings) => {
    try {
      // Request screen capture
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: settings.fps },
        } as any,
        audio: true,
      });

      streamRef.current = displayStream;

      // Create canvas for effects
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      canvasRef.current = canvas;

      const ctx = canvas.getContext('2d', { alpha: false })!;
      const video = document.createElement('video');
      video.srcObject = displayStream;
      video.muted = true;
      await video.play();
      videoRef.current = video;

      // Setup media recorder with canvas stream
      const canvasStream = canvas.captureStream(settings.fps);

      // Add audio track from original stream
      const audioTracks = displayStream.getAudioTracks();
      audioTracks.forEach(track => canvasStream.addTrack(track));

      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: settings.quality === 'high' ? 8000000 : 5000000,
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `screen-recording-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Start timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Mouse tracking
      const handleMouseMove = (e: MouseEvent) => {
        const timestamp = Date.now();
        cursorPositionsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          timestamp,
        });

        // Keep only last 100 positions
        if (cursorPositionsRef.current.length > 100) {
          cursorPositionsRef.current.shift();
        }

        // AI-powered auto zoom: detect cursor activity
        if (settings.autoZoom) {
          detectAndZoom(canvas.width, canvas.height);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Detect cursor activity and apply intelligent zoom
      const detectAndZoom = (canvasWidth: number, canvasHeight: number) => {
        const recent = cursorPositionsRef.current.slice(-30);
        if (recent.length < 2) return;

        // Calculate cursor movement speed
        let totalDistance = 0;
        for (let i = 1; i < recent.length; i++) {
          const dx = recent[i].x - recent[i - 1].x;
          const dy = recent[i].y - recent[i - 1].y;
          totalDistance += Math.sqrt(dx * dx + dy * dy);
        }

        const avgSpeed = totalDistance / recent.length;
        const latestPos = recent[recent.length - 1];

        // Normalize cursor position to video coordinates
        const normalizedX = (latestPos.x / window.innerWidth) * canvasWidth;
        const normalizedY = (latestPos.y / window.innerHeight) * canvasHeight;

        // Zoom in on slow movements (detailed work)
        // Zoom out on fast movements (navigation)
        if (avgSpeed < 5) {
          // Slow movement - zoom in
          targetZoomRef.current = {
            x: (normalizedX - canvasWidth / 2) * 0.3,
            y: (normalizedY - canvasHeight / 2) * 0.3,
            scale: 1.3,
          };
        } else if (avgSpeed > 20) {
          // Fast movement - zoom out
          targetZoomRef.current = {
            x: 0,
            y: 0,
            scale: 1.0,
          };
        } else {
          // Medium movement - slight zoom
          targetZoomRef.current = {
            x: (normalizedX - canvasWidth / 2) * 0.15,
            y: (normalizedY - canvasHeight / 2) * 0.15,
            scale: 1.15,
          };
        }
      };

      // Start rendering loop
      const render = () => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false })!;

        // Clear canvas
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply zoom and pan
        ctx.save();

        // Smooth zoom transition
        currentZoomRef.current.scale += (targetZoomRef.current.scale - currentZoomRef.current.scale) * 0.05;
        currentZoomRef.current.x += (targetZoomRef.current.x - currentZoomRef.current.x) * 0.05;
        currentZoomRef.current.y += (targetZoomRef.current.y - currentZoomRef.current.y) * 0.05;

        const zoom = currentZoomRef.current;
        const padding = settings.backgroundPadding;

        // Calculate dimensions with padding
        const contentWidth = canvas.width - (padding * 2);
        const contentHeight = canvas.height - (padding * 2);

        // Apply zoom transform
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(zoom.scale, zoom.scale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.translate(-zoom.x, -zoom.y);

        // Draw video with padding
        ctx.drawImage(
          videoRef.current,
          padding,
          padding,
          contentWidth,
          contentHeight
        );

        // Draw cursor effects
        if (settings.cursorEffects && cursorPositionsRef.current.length > 0) {
          const latestCursor = cursorPositionsRef.current[cursorPositionsRef.current.length - 1];

          // Normalize cursor to canvas coordinates
          const cursorX = (latestCursor.x / window.innerWidth) * contentWidth + padding;
          const cursorY = (latestCursor.y / window.innerHeight) * contentHeight + padding;

          if (settings.cursorGlow) {
            // Cursor glow effect
            const gradient = ctx.createRadialGradient(
              cursorX, cursorY, 0,
              cursorX, cursorY, 30
            );
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(cursorX - 30, cursorY - 30, 60, 60);
          }

          if (settings.smoothCursor) {
            // Draw smooth cursor trail
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const recentPositions = cursorPositionsRef.current.slice(-10);
            if (recentPositions.length > 1) {
              ctx.beginPath();
              const firstPos = recentPositions[0];
              const firstX = (firstPos.x / window.innerWidth) * contentWidth + padding;
              const firstY = (firstPos.y / window.innerHeight) * contentHeight + padding;
              ctx.moveTo(firstX, firstY);

              for (let i = 1; i < recentPositions.length; i++) {
                const pos = recentPositions[i];
                const x = (pos.x / window.innerWidth) * contentWidth + padding;
                const y = (pos.y / window.innerHeight) * contentHeight + padding;
                ctx.lineTo(x, y);
              }
              ctx.stroke();
            }
          }

          // Draw custom cursor
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.arc(cursorX, cursorY, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();

        animationFrameRef.current = requestAnimationFrame(render);
      };

      render();

    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        setRecordingTime(0);
      }

      window.removeEventListener('mousemove', () => {});
      cursorPositionsRef.current = [];
      zoomPointsRef.current = [];
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  }, [isRecording, isPaused]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    startRecording,
    stopRecording,
    pauseRecording,
  };
}
