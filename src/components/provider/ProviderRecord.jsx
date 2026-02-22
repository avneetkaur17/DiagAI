import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProviderRecord.css';

const API_URL = 'http://localhost:3000/api/transcribe';

export default function ProviderRecord() {
  const navigate = useNavigate();
  const location = useLocation();
  const isExisting = location.state?.isExisting || false;
  const patient = location.state?.patient || {};

  const [status, setStatus] = useState('idle');
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fullTranscriptRef = useRef('');

  // Timer
  useEffect(() => {
    if (status === 'recording') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  // Auto scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const sendChunk = async (blob) => {
    if (blob.size < 1000) return;
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'chunk.webm');
      const res = await fetch(API_URL, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.transcript?.trim()) {
        fullTranscriptRef.current += ' ' + data.transcript;
        setTranscript(fullTranscriptRef.current.trim());
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError('Transcription failed. Check that the backend is running.');
    }
  };

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      fullTranscriptRef.current = '';

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setStatus('recording');

      // Send chunk every 8 seconds
      intervalRef.current = setInterval(async () => {
        if (!chunksRef.current.length) return;
        recorder.stop();
        await new Promise(r => setTimeout(r, 300));
        const chunk = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        sendChunk(chunk);
        recorder.start();
      }, 8000);

    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.');
    }
  };

  const pauseRecording = () => {
    clearInterval(intervalRef.current);
    mediaRecorderRef.current?.stop();
    setStatus('paused');
  };

  const resumeRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setStatus('recording');

      intervalRef.current = setInterval(async () => {
        if (!chunksRef.current.length) return;
        recorder.stop();
        await new Promise(r => setTimeout(r, 300));
        const chunk = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        sendChunk(chunk);
        recorder.start();
      }, 8000);
    } catch (err) {
      setError('Could not resume recording.');
    }
  };

  const handleStop = async () => {
    setStatus('stopped');
    clearInterval(intervalRef.current);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    await new Promise(r => setTimeout(r, 500));
    if (chunksRef.current.length) {
      await sendChunk(new Blob(chunksRef.current, { type: 'audio/webm' }));
    }
    navigate('/provider/loading', {
      state: { isExisting, patient, transcript: fullTranscriptRef.current.trim() }
    });
  };

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(prev => [...prev, note.trim()]);
    setNote('');
  };

  return (
    <div className="prec">
      <div className="prec__header">
        <button className="prec__back" onClick={() => navigate('/provider/dashboard')}>← Back</button>
        <div>
          <div className="prec__tag">Recording Session</div>
          <h1 className="prec__title">{patient.name || 'New Patient'}</h1>
          <p className="prec__sub">{patient.reason || 'Consultation'} · {patient.dob || ''}</p>
        </div>
      </div>

      <div className="prec__controls">
        <div className={`prec__timer ${status === 'recording' ? 'is-active' : ''}`}>
          {formatTime(timer)}
        </div>

        <div className="prec__buttons">
          {status === 'idle' && (
            <button className="prec__btn prec__btn--record" onClick={startRecording}>
              ● Start Recording
            </button>
          )}
          {status === 'recording' && (
            <>
              <button className="prec__btn prec__btn--pause" onClick={pauseRecording}>
                ⏸ Pause
              </button>
              <button className="prec__btn prec__btn--stop" onClick={handleStop}>
                ■ Stop & Generate Summary
              </button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button className="prec__btn prec__btn--record" onClick={resumeRecording}>
                ● Resume
              </button>
              <button className="prec__btn prec__btn--stop" onClick={handleStop}>
                ■ Stop & Generate Summary
              </button>
            </>
          )}
        </div>

        {status === 'recording' && (
          <div className="prec__indicator">
            <span className="prec__dot" /> Live
          </div>
        )}
        {status === 'paused' && (
          <div className="prec__indicator prec__indicator--paused">⏸ Paused</div>
        )}
      </div>

      {error && <div className="prec__error">{error}</div>}

      <div className="prec__body">
        <div className="prec__transcript-wrap">
          <div className="prec__section-label">Live Transcript</div>
          <div className="prec__transcript" ref={transcriptRef}>
            {!transcript && (
              <p className="prec__empty">Transcript will appear here once you start recording...</p>
            )}
            {transcript && <p className="prec__line">{transcript}</p>}
          </div>
        </div>

        <div className="prec__notes-wrap">
          <div className="prec__section-label">Manual Notes</div>
          <div className="prec__notes-list">
            {notes.length === 0 && <p className="prec__empty">No notes added yet.</p>}
            {notes.map((n, i) => <div key={i} className="prec__note">{n}</div>)}
          </div>
          <div className="prec__note-input">
            <input
              type="text"
              placeholder="Add a note..."
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNote()}
            />
            <button onClick={addNote}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}