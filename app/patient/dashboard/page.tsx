'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const visitData = {
  patient: 'Sarah Johnson',
  date: 'Today',
  reason: 'Follow-up',
  summary: 'You came in with a dull aching pain on the left side of your chest that started two days ago, along with some shortness of breath when climbing stairs. Your vitals were stable. Your doctor recommends further evaluation to check your heart.',
  diagnosis: 'Stable angina — possible cardiac origin. An ECG and stress test have been recommended.',
  medication: { name: 'Metoprolol 25mg', frequency: 'Twice daily', reason: 'To help manage your blood pressure and chest pain.' },
}

const testResults = [
  { id: 1, name: 'ECG (Electrocardiogram)', date: '2026-02-21', result: 'Abnormal', status: 'abnormal', doctorNote: 'Mild ST-segment changes observed. Consistent with possible stable angina. Follow-up stress test recommended.', report: '#' },
  { id: 2, name: 'Blood Pressure', date: '2026-02-21', result: '142/88 mmHg — Slightly elevated', status: 'warning', doctorNote: 'Blood pressure is slightly above normal range. Medication has been prescribed to help manage this.', report: '#' },
  { id: 3, name: 'Complete Blood Count (CBC)', date: '2026-02-21', result: 'Normal', status: 'normal', doctorNote: 'All values within normal range. No concerns.', report: '#' },
]

const initialAppointments = [
  { id: 1, doctor: 'Dr. Smith', type: 'Follow-up (booked by doctor)', date: '2026-03-05', time: '10:00 AM', byDoctor: true },
]

export default function PatientDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState('summary')
  const [appointments, setAppointments] = useState(initialAppointments)
  const [booking, setBooking] = useState({ doctor: '', type: '', date: '', time: '' })
  const [showBooking, setShowBooking] = useState(false)
  const [booked, setBooked] = useState(false)
  const [expandedTest, setExpandedTest] = useState<number | null>(null)

  const handleBook = () => {
    if (!booking.doctor || !booking.type || !booking.date || !booking.time) { alert('Please fill in all fields.'); return }
    setAppointments(prev => [...prev, { id: Date.now(), ...booking, byDoctor: false }])
    setBooking({ doctor: '', type: '', date: '', time: '' })
    setShowBooking(false)
    setBooked(true)
    setTimeout(() => setBooked(false), 3000)
  }

  return (
    <div className="pdash-p">
      <div className="pdash-p__header">
        <div>
          <div className="pdash-p__tag">Patient Portal</div>
          <h1 className="pdash-p__title">Hello, {visitData.patient}</h1>
          <p className="pdash-p__sub">Here is your visit summary from {visitData.date}.</p>
        </div>
        <button className="pdash-p__logout" onClick={() => router.push('/')}>Sign out</button>
      </div>

      <div className="pdash-p__tabs">
        {['summary','results','appointments'].map(t => (
          <button key={t} className={`pdash-p__tab ${tab === t ? 'is-active' : ''}`} onClick={() => setTab(t)}>
            {t === 'summary' ? 'Visit Summary' : t === 'results' ? 'Test Results' : 'Appointments'}
          </button>
        ))}
      </div>

      {tab === 'summary' && (
        <div className="pdash-p__body">
          <div className="pdash-p__card">
            <div className="pdash-p__card-label">Visit Summary</div>
            <p className="pdash-p__text">{visitData.summary}</p>
          </div>
          <div className="pdash-p__card">
            <div className="pdash-p__card-label">Diagnosis</div>
            <p className="pdash-p__text">{visitData.diagnosis}</p>
          </div>
          <div className="pdash-p__card">
            <div className="pdash-p__card-label">Your Medication</div>
            <div className="pdash-p__med">
              <div className="pdash-p__med-top">
                <div className="pdash-p__med-name">{visitData.medication.name}</div>
                <div className="pdash-p__med-freq">{visitData.medication.frequency}</div>
              </div>
              <p className="pdash-p__med-reason">{visitData.medication.reason}</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'results' && (
        <div className="pdash-p__body">
          <h2 className="pdash-p__section-title">Your Test Results</h2>
          {testResults.map(t => (
            <div key={t.id} className={`pdash-p__result pdash-p__result--${t.status}`}>
              <div className="pdash-p__result-top">
                <div className="pdash-p__result-left">
                  <div className="pdash-p__result-name">{t.name}</div>
                  <div className="pdash-p__result-date">{t.date}</div>
                </div>
                <div className={`pdash-p__result-badge pdash-p__result-badge--${t.status}`}>
                  {t.status === 'normal' ? '✓ Normal' : t.status === 'abnormal' ? '✕ Abnormal' : '⚠ Review'}
                </div>
              </div>
              <div className="pdash-p__result-value">{t.result}</div>
              <div className="pdash-p__result-note"><span className="pdash-p__result-note-label">Doctor&apos;s note: </span>{t.doctorNote}</div>
              <div className="pdash-p__result-actions">
                <button className="pdash-p__result-toggle" onClick={() => setExpandedTest(expandedTest === t.id ? null : t.id)}>
                  {expandedTest === t.id ? 'Hide details' : 'View details'}
                </button>
                <a href={t.report} className="pdash-p__result-download">↓ Download Report</a>
              </div>
              {expandedTest === t.id && (
                <div className="pdash-p__result-expanded">
                  <p>Full report details would appear here once connected to the backend. This includes raw values, reference ranges, and lab notes.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'appointments' && (
        <div className="pdash-p__body">
          {booked && <div className="pdash-p__banner">✓ Appointment booked successfully!</div>}
          <div className="pdash-p__appt-header">
            <h2 className="pdash-p__section-title">Your Appointments</h2>
            <button className="pdash-p__book-btn" onClick={() => setShowBooking(!showBooking)}>{showBooking ? 'Cancel' : '+ Book New'}</button>
          </div>
          {showBooking && (
            <div className="pdash-p__card">
              <div className="pdash-p__card-label">Book an Appointment</div>
              <div className="pdash-p__form">
                <div className="pdash-p__field"><label>Doctor</label><input type="text" placeholder="e.g. Dr. Smith" value={booking.doctor} onChange={e => setBooking({ ...booking, doctor: e.target.value })} /></div>
                <div className="pdash-p__field"><label>Type of Visit</label><input type="text" placeholder="e.g. Checkup, Follow-up" value={booking.type} onChange={e => setBooking({ ...booking, type: e.target.value })} /></div>
                <div className="pdash-p__row">
                  <div className="pdash-p__field"><label>Date</label><input type="date" value={booking.date} onChange={e => setBooking({ ...booking, date: e.target.value })} /></div>
                  <div className="pdash-p__field"><label>Time</label><input type="time" value={booking.time} onChange={e => setBooking({ ...booking, time: e.target.value })} /></div>
                </div>
                <button className="pdash-p__submit" onClick={handleBook}>Confirm Booking</button>
              </div>
            </div>
          )}
          <div className="pdash-p__appt-list">
            {appointments.length === 0 && <p className="pdash-p__empty">No upcoming appointments.</p>}
            {appointments.map(a => (
              <div key={a.id} className={`pdash-p__appt ${a.byDoctor ? 'pdash-p__appt--doctor' : ''}`}>
                <div className="pdash-p__appt-info">
                  <div className="pdash-p__appt-type">{a.type}</div>
                  <div className="pdash-p__appt-meta">{a.doctor} · {a.date} · {a.time}</div>
                  {a.byDoctor && <div className="pdash-p__appt-tag">Booked by your doctor</div>}
                </div>
                <button className="pdash-p__cancel" onClick={() => setAppointments(prev => prev.filter(x => x.id !== a.id))}>Cancel</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
