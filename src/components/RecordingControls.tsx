import React from 'react';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
}

export function RecordingControls({
  isRecording,
  isPaused,
  recordingTime,
  onStart,
  onStop,
  onPause,
}: RecordingControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '20px',
      backgroundColor: '#2a2a2a',
      borderRadius: '12px',
    }}>
      {isRecording && (
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff',
          fontFamily: 'monospace',
          minWidth: '80px',
        }}>
          {formatTime(recordingTime)}
        </div>
      )}

      {!isRecording ? (
        <button
          onClick={onStart}
          style={{
            padding: '12px 32px',
            backgroundColor: '#EF4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#fff',
          }} />
          Start Recording
        </button>
      ) : (
        <>
          <button
            onClick={onPause}
            style={{
              padding: '12px 24px',
              backgroundColor: '#F59E0B',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={onStop}
            style={{
              padding: '12px 24px',
              backgroundColor: '#EF4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Stop
          </button>
        </>
      )}

      {isRecording && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#EF4444',
        }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            Recording
          </span>
        </div>
      )}
    </div>
  );
}
