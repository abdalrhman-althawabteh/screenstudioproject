import { useState, useRef } from 'react';
import './App.css';

const WEBHOOK_URL = 'https://n8n.srv965433.hstgr.cloud/webhook/d6809865-6310-4416-a351-3e14de3540cf';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError('');
      setTranscription('');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendToWebhook(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('فشل الوصول للميكروفون. الرجاء السماح بالوصول للميكروفون.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const sendToWebhook = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل إرسال الملف الصوتي');
      }

      const result = await response.json();

      // Handle the response - assuming the webhook returns transcription in 'text' or 'transcription' field
      if (result.text || result.transcription) {
        setTranscription(result.text || result.transcription);
      } else if (typeof result === 'string') {
        setTranscription(result);
      } else {
        setTranscription(JSON.stringify(result, null, 2));
      }

      setIsProcessing(false);
    } catch (err) {
      setError('حدث خطأ أثناء معالجة الصوت. حاول مرة أخرى.');
      setIsProcessing(false);
      console.error('Error sending audio:', err);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>🎙️ تحويل الصوت إلى نص</h1>
          <p className="subtitle">اضغط على الميكروفون وابدأ التحدث</p>
        </div>

        <div className="recorder-section">
          <button
            className={`mic-button ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="spinner"></div>
            ) : (
              <svg
                className="mic-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
          </button>

          <p className="status-text">
            {isProcessing
              ? 'جاري المعالجة...'
              : isRecording
              ? 'جاري التسجيل... اضغط مرة أخرى للإيقاف'
              : 'اضغط للبدء'}
          </p>

          {isRecording && (
            <div className="recording-indicator">
              <span className="pulse"></span>
              <span>جاري التسجيل</span>
            </div>
          )}
        </div>

        {error && (
          <div className="message error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {transcription && (
          <div className="message success">
            <div className="transcription-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <h3>النص المحول:</h3>
            </div>
            <div className="transcription-text">{transcription}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
