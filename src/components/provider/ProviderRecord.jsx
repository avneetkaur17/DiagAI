import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderRecord.css';

const mockTranscriptLines = [
  'How are you feeling today?',
  'I have been experiencing chest pain for the past two days.',
  'Can you describe the pain? Is it sharp or dull?',
  'It is more of a dull ache, mostly on the left side.',
  'Any shortness of breath or dizziness?',
  'Some shortness of breath when I climb stairs.',
];

export default function ProviderRecord() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const intervalRef = useRef(null);
  const transcriptRef = useRef(null);
  const lineIndex = useRef(0);

  useEffect(() => {
  if (status === 'recording') {
    intervalRef.current = setInterval(() => {
      setTimer(t => t + 1);
      if (lineIndex.current < mockTranscriptLines.length) {
        setTranscript(prev => [...prev, mockTranscriptLines[lineIndex.current]]);
        lineIndex.current += 1;
        if (lineIndex.current === mockTranscriptLines.length) {
          clearInterval(intervalRef.current);
          setStatus('stopped');
          navigate('/provider/summary');
        }
      }
    }, 2000);
  } else {
    clearInterval(intervalRef.current);
  }
  return () => clearInterval(intervalRef.current);
}, [status, navigate]);

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

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(prev => [...prev, note.trim()]);
    setNote('');
  };

  const handleStop = () => {
    setStatus('stopped');
    navigate('/provider/loading');
  };

  return (
    <div className="prec">
      <div className="prec__header">
        <button className="prec__back" onClick={() => navigate('/provider/dashboard')}>← Back</button>
        <div>
          <div className="prec__tag">Recording Session</div>
          <h1 className="prec__title">Sarah Johnson</h1>
          <p className="prec__sub">Follow-up · DOB: Mar 12, 1990</p>
        </div>
      </div>

      <div className="prec__controls">
        <div className={`prec__timer ${status === 'recording' ? 'is-active' : ''}`}>
          {formatTime(timer)}
        </div>

        <div className="prec__buttons">
          {status === 'idle' && (
            <button className="prec__btn prec__btn--record" onClick={() => setStatus('recording')}>
              ● Start Recording
            </button>
          )}
          {status === 'recording' && (
            <>
              <button className="prec__btn prec__btn--pause" onClick={() => setStatus('paused')}>
                ⏸ Pause
              </button>
              <button className="prec__btn prec__btn--stop" onClick={handleStop}>
                ■ Stop & Generate Summary
              </button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button className="prec__btn prec__btn--record" onClick={() => setStatus('recording')}>
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
          <div className="prec__indicator prec__indicator--paused">
            ⏸ Paused
          </div>
        )}
      </div>

      <div className="prec__body">
        <div className="prec__transcript-wrap">
          <div className="prec__section-label">Live Transcript</div>
          <div className="prec__transcript" ref={transcriptRef}>
            {transcript.length === 0 && (
              <p className="prec__empty">Transcript will appear here once you start recording...</p>
            )}
            {transcript.map((line, i) => (
              <p key={i} className="prec__line">{line}</p>
            ))}
          </div>
        </div>

        <div className="prec__notes-wrap">
          <div className="prec__section-label">Manual Notes</div>
          <div className="prec__notes-list">
            {notes.length === 0 && (
              <p className="prec__empty">No notes added yet.</p>
            )}
            {notes.map((n, i) => (
              <div key={i} className="prec__note">{n}</div>
            ))}
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