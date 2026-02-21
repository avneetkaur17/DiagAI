import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientDashboard.css';

const visitData = {
  patient: 'Sarah Johnson',
  date: 'Today',
  reason: 'Follow-up',
  summary: 'You came in with a dull aching pain on the left side of your chest that started two days ago, along with some shortness of breath when climbing stairs. Your vitals were stable. Your doctor recommends further evaluation to check your heart.',
  diagnosis: 'Stable angina — possible cardiac origin. An ECG and stress test have been recommended.',
  medication: {
    name: 'Metoprolol 25mg',
    frequency: 'Twice daily',
    reason: 'To help manage your blood pressure and chest pain.',
  },
};

const initialAppointments = [
  { id: 1, doctor: 'Dr. Smith', type: 'Follow-up (booked by doctor)', date: '2026-03-05', time: '10:00 AM', byDoctor: true },
];

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('summary');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [booking, setBooking] = useState({ doctor: '', type: '', date: '', time: '' });
  const [showBooking, setShowBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (!booking.doctor || !booking.type || !booking.date || !booking.time) {
      alert('Please fill in all fields.');
      return;
    }
    setAppointments(prev => [...prev, { id: Date.now(), ...booking, byDoctor: false }]);
    setBooking({ doctor: '', type: '', date: '', time: '' });
    setShowBooking(false);
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  const handleCancel = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="pdash-p">
      <div className="pdash-p__header">
        <div>
          <div className="pdash-p__tag">Patient Portal</div>
          <h1 className="pdash-p__title">Hello, {visitData.patient}</h1>
          <p className="pdash-p__sub">Here is your visit summary from {visitData.date}.</p>
        </div>
        <button className="pdash-p__logout" onClick={() => navigate('/')}>Sign out</button>
      </div>

      <div className="pdash-p__tabs">
        <button className={`pdash-p__tab ${tab === 'summary' ? 'is-active' : ''}`} onClick={() => setTab('summary')}>Visit Summary</button>
        <button className={`pdash-p__tab ${tab === 'appointments' ? 'is-active' : ''}`} onClick={() => setTab('appointments')}>Appointments</button>
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

      {tab === 'appointments' && (
        <div className="pdash-p__body">
          {booked && (
            <div className="pdash-p__banner">✓ Appointment booked successfully!</div>
          )}

          <div className="pdash-p__appt-header">
            <h2 className="pdash-p__section-title">Your Appointments</h2>
            <button className="pdash-p__book-btn" onClick={() => setShowBooking(!showBooking)}>
              {showBooking ? 'Cancel' : '+ Book New'}
            </button>
          </div>

          {showBooking && (
            <div className="pdash-p__card">
              <div className="pdash-p__card-label">Book an Appointment</div>
              <div className="pdash-p__form">
                <div className="pdash-p__field">
                  <label>Doctor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Smith"
                    value={booking.doctor}
                    onChange={e => setBooking({ ...booking, doctor: e.target.value })}
                  />
                </div>
                <div className="pdash-p__field">
                  <label>Type of Visit</label>
                  <input
                    type="text"
                    placeholder="e.g. Checkup, Follow-up"
                    value={booking.type}
                    onChange={e => setBooking({ ...booking, type: e.target.value })}
                  />
                </div>
                <div className="pdash-p__row">
                  <div className="pdash-p__field">
                    <label>Date</label>
                    <input
                      type="date"
                      value={booking.date}
                      onChange={e => setBooking({ ...booking, date: e.target.value })}
                    />
                  </div>
                  <div className="pdash-p__field">
                    <label>Time</label>
                    <input
                      type="time"
                      value={booking.time}
                      onChange={e => setBooking({ ...booking, time: e.target.value })}
                    />
                  </div>
                </div>
                <button className="pdash-p__submit" onClick={handleBook}>Confirm Booking</button>
              </div>
            </div>
          )}

          <div className="pdash-p__appt-list">
            {appointments.length === 0 && (
              <p className="pdash-p__empty">No upcoming appointments.</p>
            )}
            {appointments.map(a => (
              <div key={a.id} className={`pdash-p__appt ${a.byDoctor ? 'pdash-p__appt--doctor' : ''}`}>
                <div className="pdash-p__appt-info">
                  <div className="pdash-p__appt-type">{a.type}</div>
                  <div className="pdash-p__appt-meta">{a.doctor} · {a.date} · {a.time}</div>
                  {a.byDoctor && <div className="pdash-p__appt-tag">Booked by your doctor</div>}
                </div>
                <button className="pdash-p__cancel" onClick={() => handleCancel(a.id)}>Cancel</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}