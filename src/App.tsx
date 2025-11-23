import React, { useState } from 'react';
import { RecordingControls } from './components/RecordingControls';
import { SettingsPanel } from './components/SettingsPanel';
import { useScreenRecorder } from './hooks/useScreenRecorder';
import { RecordingSettings } from './types';

export function App() {
  const [settings, setSettings] = useState<RecordingSettings>({
    fps: 60,
    quality: 'high',
    cursorEffects: true,
    autoZoom: true,
    backgroundPadding: 40,
    backgroundColor: '#1a1a1a',
    cursorGlow: true,
    smoothCursor: true,
  });

  const {
    isRecording,
    isPaused,
    recordingTime,
    startRecording,
    stopRecording,
    pauseRecording,
  } = useScreenRecorder();

  const handleStart = async () => {
    try {
      await startRecording(settings);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please make sure you granted screen sharing permission.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '8px',
        }}>
          Screen Studio Recorder
        </h1>
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: '#888',
        }}>
          Professional screen recording with AI-powered zoom and cursor tracking
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 900 ? '1fr 400px' : '1fr',
        gap: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Left Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Recording Controls */}
          <RecordingControls
            isRecording={isRecording}
            isPaused={isPaused}
            recordingTime={recordingTime}
            onStart={handleStart}
            onStop={stopRecording}
            onPause={pauseRecording}
          />

          {/* Instructions */}
          {!isRecording && (
            <div style={{
              padding: '20px',
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              border: '2px solid #3B82F6',
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                color: '#3B82F6',
                fontSize: '18px',
              }}>
                How to use:
              </h3>
              <ol style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#fff',
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                <li>Configure your recording settings in the panel →</li>
                <li>Click "Start Recording" button</li>
                <li>Select the screen or window you want to record</li>
                <li>Click "Share" to begin recording</li>
                <li>Move your cursor naturally - AI will track and zoom automatically</li>
                <li>Click "Stop" when finished - video will download automatically</li>
              </ol>
            </div>
          )}

          {/* Features Info */}
          <div style={{
            padding: '20px',
            backgroundColor: '#2a2a2a',
            borderRadius: '12px',
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: '#fff',
              fontSize: '18px',
            }}>
              Features
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 600 ? '1fr 1fr' : '1fr',
              gap: '12px',
            }}>
              {[
                '🎯 Cursor Tracking',
                '✨ Smooth Cursor Effects',
                '🔍 AI-Powered Zoom',
                '📹 Auto Camera Movements',
                '🎨 Custom Backgrounds',
                '📐 Padding & Spacing',
                '🎬 High-Quality Export',
                '⚡ 60 FPS Recording',
              ].map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Browser Compatibility Note */}
          <div style={{
            padding: '16px',
            backgroundColor: '#2a2a2a',
            borderRadius: '12px',
            borderLeft: '4px solid #F59E0B',
          }}>
            <p style={{
              margin: 0,
              color: '#F59E0B',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '4px',
            }}>
              Browser Requirements:
            </p>
            <p style={{
              margin: 0,
              color: '#888',
              fontSize: '12px',
            }}>
              Works best in Chrome, Edge, or Opera. Firefox and Safari have limited support for screen recording.
            </p>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div>
          <SettingsPanel
            settings={settings}
            onSettingsChange={setSettings}
            disabled={isRecording}
          />
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
