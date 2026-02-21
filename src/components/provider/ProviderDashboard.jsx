import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderDashboard.css';

const todaysPatients = [
  { id: 1, name: 'Sarah Johnson', dob: '1990-03-12', phone: '2145550101', time: '9:00 AM', reason: 'Follow-up', history: [
    { date: '2025-11-10', reason: 'Chest pain', diagnosis: 'Stable angina', medication: 'Aspirin 81mg' },
    { date: '2025-08-22', reason: 'Annual checkup', diagnosis: 'Healthy', medication: 'None' },
  ]},
  { id: 2, name: 'Marcus Lee', dob: '1972-07-25', phone: '2145550182', time: '9:45 AM', reason: 'Chest pain', history: [
    { date: '2025-06-14', reason: 'Blood pressure', diagnosis: 'Hypertension', medication: 'Metoprolol 25mg' },
  ]},
  { id: 3, name: 'Priya Patel', dob: '1996-11-04', phone: '2145550143', time: '10:30 AM', reason: 'Annual checkup', history: [] },
  { id: 4, name: 'David Kim', dob: '1963-01-18', phone: '2145550167', time: '11:15 AM', reason: 'Diabetes review', history: [
    { date: '2025-12-01', reason: 'Diabetes review', diagnosis: 'Type 2 Diabetes', medication: 'Metformin 500mg' },
    { date: '2025-09-15', reason: 'Follow-up', diagnosis: 'Type 2 Diabetes', medication: 'Metformin 500mg' },
  ]},
  { id: 5, name: 'Linda Torres', dob: '1979-06-30', phone: '2145550199', time: '2:00 PM', reason: 'Back pain', history: [
    { date: '2025-10-03', reason: 'Back pain', diagnosis: 'Lumbar strain', medication: 'Ibuprofen 400mg' },
  ]},
];

const newPatientTemplate = { name: '', dob: '', phone: '', reason: '' };

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [search, setSearch] = useState({ name: '', dob: '', phone: '' });
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newPatient, setNewPatient] = useState(newPatientTemplate);

  const handleSearch = () => {
    const found = todaysPatients.find(p =>
      p.name.toLowerCase().includes(search.name.toLowerCase().trim()) &&
      p.dob === search.dob &&
      p.phone.includes(search.phone.replace(/\D/g, '').trim())
    );
    if (found) {
      setResult(found);
      setNotFound(false);
      setShowHistory(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div className="pdash">
      <div className="pdash__header">
        <div>
          <div className="pdash__tag">Provider Portal</div>
          <h1 className="pdash__title">Good morning, Dr. Smith</h1>
          <p className="pdash__sub">What would you like to do?</p>
        </div>
        <button className="pdash__logout" onClick={() => navigate('/')}>Sign out</button>
      </div>

      {!mode && (
        <div className="pdash__options">
          <button className="pdash__option pdash__option--new" onClick={() => setMode('new')}>
            <div className="pdash__option-icon">＋</div>
            <div>
              <div className="pdash__option-title">New Patient</div>
              <div className="pdash__option-desc">Register a new patient and start recording</div>
            </div>
          </button>
          <button className="pdash__option pdash__option--existing" onClick={() => setMode('existing')}>
            <div className="pdash__option-icon">☰</div>
            <div>
              <div className="pdash__option-title">Existing Patient</div>
              <div className="pdash__option-desc">Look up a patient by name, date of birth, and phone number</div>
            </div>
          </button>
        </div>
      )}

      {mode === 'new' && (
        <div className="pdash__section">
          <button className="pdash__back" onClick={() => setMode(null)}>← Back</button>
          <h2 className="pdash__section-title">New Patient</h2>
          <p className="pdash__section-sub">Enter patient details before starting the consultation.</p>
          <div className="pdash__form">
            <div className="pdash__field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={newPatient.name}
                onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
              />
            </div>
            <div className="pdash__row">
              <div className="pdash__field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={newPatient.dob}
                  onChange={e => setNewPatient({ ...newPatient, dob: e.target.value })}
                />
              </div>
              <div className="pdash__field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 2145550101"
                  value={newPatient.phone}
                  onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="pdash__field">
              <label>Reason for Visit</label>
              <input
                type="text"
                placeholder="e.g. Chest pain"
                value={newPatient.reason}
                onChange={e => setNewPatient({ ...newPatient, reason: e.target.value })}
              />
            </div>
            <button className="pdash__btn" onClick={() => navigate('/provider/record', { state: { isExisting: false, patient: newPatient } })}>
              Start Recording
            </button>
          </div>
        </div>
      )}

      {mode === 'existing' && (
        <div className="pdash__section">
          <button className="pdash__back" onClick={() => { setMode(null); setResult(null); setNotFound(false); setShowHistory(false); }}>← Back</button>
          <h2 className="pdash__section-title">Find Patient</h2>
          <p className="pdash__section-sub">Enter the patient's full name, date of birth, and phone number.</p>
          <div className="pdash__form">
            <div className="pdash__field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah Johnson"
                value={search.name}
                onChange={e => setSearch({ ...search, name: e.target.value })}
              />
            </div>
            <div className="pdash__row">
              <div className="pdash__field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={search.dob}
                  onChange={e => setSearch({ ...search, dob: e.target.value })}
                />
              </div>
              <div className="pdash__field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 2145550101"
                  value={search.phone}
                  onChange={e => setSearch({ ...search, phone: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <button className="pdash__btn" onClick={handleSearch}>Look Up Patient</button>
          </div>

          {notFound && (
            <div className="pdash__notfound">
              No patient found. Double-check the details or register as a new patient.
            </div>
          )}

          {result && (
            <div className="pdash__result">
              <div className="pdash__patient">
                <div className="pdash__patient-avatar">{result.name.charAt(0)}</div>
                <div className="pdash__patient-info">
                  <div className="pdash__patient-name">{result.name}</div>
                  <div className="pdash__patient-meta">DOB: {result.dob} · {result.phone}</div>
                  <div className="pdash__patient-meta">{result.time} · {result.reason}</div>
                </div>
                <div className="pdash__patient-actions">
                  <button className="pdash__action pdash__action--history" onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? 'Hide History' : 'History'}
                  </button>
                  <button className="pdash__action pdash__action--record" onClick={() => navigate('/provider/record', { state: { isExisting: true, patient: result } })}>
                    Record
                  </button>
                </div>
              </div>

              {showHistory && (
                <div className="pdash__history">
                  <div className="pdash__history-title">Visit History</div>
                  {result.history.length === 0 && (
                    <p className="pdash__history-empty">No previous visits on record.</p>
                  )}
                  {result.history.map((h, i) => (
                    <div key={i} className="pdash__history-item">
                      <div className="pdash__history-date">{h.date}</div>
                      <div className="pdash__history-reason">{h.reason}</div>
                      <div className="pdash__history-meta">Diagnosis: {h.diagnosis}</div>
                      <div className="pdash__history-meta">Medication: {h.medication}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}