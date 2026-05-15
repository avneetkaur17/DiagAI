'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function ProviderRecord() {
  const router = useRouter()
  const [patient, setPatient] = useState<any>({})
  const [isExisting, setIsExisting] = useState(false)
  const [status, setStatus] = useState<'idle'|'recording'|'paused'|'stopped'>('idle')
  const [timer, setTimer] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState<string[]>([])
  const [error, setError] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const fullTranscriptRef = useRef('')

  useEffect(() => {
    const p = sessionStorage.getItem('diagPatient')
    const ex = sessionStorage.getItem('diagIsExisting')
    if (p) setPatient(JSON.parse(p))
    if (ex) setIsExisting(ex === 'true')
  }, [])

  useEffect(() => {
    if (status === 'recording') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [status])

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
  }, [transcript])

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  const sendChunk = async (blob: Blob) => {
    if (blob.size < 1000) return
    try {
      const fd = new FormData()
      fd.append('audio', blob, 'chunk.webm')
      const res = await fetch('/api/transcribe', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.transcript?.trim()) {
        fullTranscriptRef.current += ' ' + data.transcript
        setTranscript(fullTranscriptRef.current.trim())
      }
    } catch { setError('Transcription failed. Check that the backend is running.') }
  }

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = recorder
      chunksRef.current = []
      fullTranscriptRef.current = ''
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.start()
      setStatus('recording')
      intervalRef.current = setInterval(async () => {
        if (!chunksRef.current.length) return
        recorder.stop()
        await new Promise(r => setTimeout(r, 300))
        const chunk = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = []
        sendChunk(chunk)
        recorder.start()
      }, 8000)
    } catch { setError('Microphone access denied. Please allow microphone access and try again.') }
  }

  const pauseRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    mediaRecorderRef.current?.stop()
    setStatus('paused')
  }

  const resumeRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.start()
      setStatus('recording')
      intervalRef.current = setInterval(async () => {
        if (!chunksRef.current.length) return
        recorder.stop()
        await new Promise(r => setTimeout(r, 300))
        const chunk = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = []
        sendChunk(chunk)
        recorder.start()
      }, 8000)
    } catch { setError('Could not resume recording.') }
  }

  const handleStop = async () => {
    setStatus('stopped')
    if (intervalRef.current) clearInterval(intervalRef.current)
    mediaRecorderRef.current?.stop()
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop())
    await new Promise(r => setTimeout(r, 500))
    if (chunksRef.current.length) await sendChunk(new Blob(chunksRef.current, { type: 'audio/webm' }))
    sessionStorage.setItem('diagTranscript', fullTranscriptRef.current.trim())
    router.push('/provider/loading')
  }

  const addNote = () => {
    if (!note.trim()) return
    setNotes(prev => [...prev, note.trim()])
    setNote('')
  }

  return (
    <div className="prec">
      <div className="prec__header">
        <button className="prec__back" onClick={() => router.push('/provider/dashboard')}>← Back</button>
        <div>
          <div className="prec__tag">Recording Session</div>
          <h1 className="prec__title">{patient.name || 'New Patient'}</h1>
          <p className="prec__sub">{patient.reason || 'Consultation'} · {patient.dob || ''}</p>
        </div>
      </div>
      <div className="prec__controls">
        <div className={`prec__timer ${status === 'recording' ? 'is-active' : ''}`}>{fmt(timer)}</div>
        <div className="prec__buttons">
          {status === 'idle' && <button className="prec__btn prec__btn--record" onClick={startRecording}>● Start Recording</button>}
          {status === 'recording' && <>
            <button className="prec__btn prec__btn--pause" onClick={pauseRecording}>⏸ Pause</button>
            <button className="prec__btn prec__btn--stop" onClick={handleStop}>■ Stop &amp; Generate Summary</button>
          </>}
          {status === 'paused' && <>
            <button className="prec__btn prec__btn--record" onClick={resumeRecording}>● Resume</button>
            <button className="prec__btn prec__btn--stop" onClick={handleStop}>■ Stop &amp; Generate Summary</button>
          </>}
        </div>
        {status === 'recording' && <div className="prec__indicator"><span className="prec__dot" /> Live</div>}
        {status === 'paused' && <div className="prec__indicator prec__indicator--paused">⏸ Paused</div>}
      </div>
      {error && <div className="prec__error">{error}</div>}
      <div className="prec__body">
        <div className="prec__transcript-wrap">
          <div className="prec__section-label">Live Transcript</div>
          <div className="prec__transcript" ref={transcriptRef}>
            {!transcript && <p className="prec__empty">Transcript will appear here once you start recording...</p>}
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
            <input type="text" placeholder="Add a note..." value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNote()} />
            <button onClick={addNote}>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}
