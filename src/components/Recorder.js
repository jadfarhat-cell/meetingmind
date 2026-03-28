import React, { useState, useRef, useEffect } from 'react';
import './Recorder.css';
import AudioRecorder from '../services/audioRecorder';
import TranscriptionService from '../services/transcriptionService';
import AIService from '../services/aiService';
import DatabaseService from '../services/databaseService';

function Recorder({ onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState('Ready to record');
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('openai_api_key') || '',
    anthropic: localStorage.getItem('anthropic_api_key') || ''
  });
  const [showSettings, setShowSettings] = useState(false);

  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const dbServiceRef = useRef(null);

  useEffect(() => {
    recorderRef.current = new AudioRecorder();
    dbServiceRef.current = new DatabaseService();
    dbServiceRef.current.initialize().catch(err => console.error('DB init error:', err));

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      await recorderRef.current.startRecording();
      setIsRecording(true);
      setStatus('Recording...');
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      setStatus('Error: ' + error.message);
    }
  };

  const handleStopRecording = async () => {
    try {
      clearInterval(timerRef.current);
      setIsRecording(false);
      setIsProcessing(true);
      setStatus('Processing recording...');

      const audioFile = await recorderRef.current.stopRecording();
      setStatus('Transcribing audio...');

      // Transcribe
      const transcriptionService = new TranscriptionService(apiKeys.openai);
      const transcriptionResult = await transcriptionService.transcribeAudio(audioFile);

      setStatus('Generating summary...');

      // Generate AI summary
      const aiService = new AIService(apiKeys.anthropic);
      const summaryResult = await aiService.generateMeetingSummary(transcriptionResult.text);

      // Combine results
      const results = {
        transcript: transcriptionResult.text,
        duration: recordingTime,
        timestamp: new Date(),
        ...summaryResult
      };

      // Save to database
      setStatus('Saving to database...');
      try {
        await dbServiceRef.current.saveMeeting(results);
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue even if save fails
      }

      setStatus('Complete!');
      setIsProcessing(false);
      onComplete(results);
    } catch (error) {
      setStatus('Error: ' + error.message);
      setIsProcessing(false);
    }
  };

  const handleSaveApiKeys = () => {
    localStorage.setItem('openai_api_key', apiKeys.openai);
    localStorage.setItem('anthropic_api_key', apiKeys.anthropic);
    setShowSettings(false);
  };

  const needsApiKeys = !apiKeys.openai || !apiKeys.anthropic;

  return (
    <div className="recorder-container">
      <div className="recorder-card">
        {showSettings || needsApiKeys ? (
          <div className="settings-panel">
            <h2>API Settings</h2>
            <p className="settings-description">
              Enter your API keys to enable transcription and summarization
            </p>

            <div className="input-group">
              <label>OpenAI API Key (for Whisper)</label>
              <input
                type="password"
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                placeholder="sk-..."
              />
            </div>

            <div className="input-group">
              <label>Anthropic API Key (for Claude)</label>
              <input
                type="password"
                value={apiKeys.anthropic}
                onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                placeholder="sk-ant-..."
              />
            </div>

            <button className="save-button" onClick={handleSaveApiKeys}>
              Save API Keys
            </button>
          </div>
        ) : (
          <>
            <div className="recorder-visual">
              <div className={`recording-indicator ${isRecording ? 'active' : ''}`}>
                {isRecording ? '🔴' : '⏸️'}
              </div>
              <div className="recording-time">{formatTime(recordingTime)}</div>
            </div>

            <div className="status-text">{status}</div>

            <div className="controls">
              {!isRecording && !isProcessing && (
                <button className="record-button" onClick={handleStartRecording}>
                  Start Recording
                </button>
              )}

              {isRecording && (
                <button className="stop-button" onClick={handleStopRecording}>
                  Stop Recording
                </button>
              )}

              {isProcessing && (
                <div className="processing-spinner">Processing...</div>
              )}
            </div>

            <button className="settings-link" onClick={() => setShowSettings(true)}>
              ⚙️ API Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Recorder;
