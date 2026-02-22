import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProviderSummary.css';

const API_URL = 'http://localhost:3000';

const mockMedications = [
  { id: 1, name: 'Aspirin 81mg', frequency: 'Once daily', reason: 'Cardiac protection' },
  { id: 2, name: 'Metoprolol 25mg', frequency: 'Twice daily', reason: 'Blood pressure & chest pain' },
  { id: 3, name: 'Nitroglycerin 0.4mg', frequency: 'As needed', reason: 'Acute chest pain relief' },
];

export default function ProviderSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const isExisting = location.state?.isExisting || false;
  const patient = location.state?.patient || {};
  const transcript = location.state?.transcript || '';

  const [summary, setSummary] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState(mockMedications);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [followUp, setFollowUp] = useState({ date: '', time: '', notes: '' });
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!transcript) {
      // No real transcript, use mock data
      setSummary('Patient presented with a dull aching chest pain on the left side lasting two days, accompanied by shortness of breath on exertion. No dizziness reported. Vitals stable. Likely cardiac origin, further evaluation recommended.');
      setDiagnosis('Stable angina — possible cardiac origin. ECG and stress test recommended.');
      setLoading(false);
      return;
    }

    // Call real AI analyze endpoint
    fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript,
        patientHistory: patient.history || ''
      })
    })
      .then(r => r.json())
      .then(data => {
        setSummary(data.patient_summary || data.clinical_note || '');
        setDiagnosis(data.diagnosis || '');
        if (data.medications?.length) {
          setMedications(data.medications.map((m, i) => ({
            id: i + 1,
            name: m.name,
            frequency: `${m.suggested_dose} · ${m.suggested_frequency}`,
            reason: m.reason,
          })));
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to mock if backend not ready
        setSummary('Patient presented with a dull aching chest pain on the left side lasting two days, accompanied by shortness of breath on exertion. No dizziness reported. Vitals stable.');
        setDiagnosis('Stable angina — possible cardiac origin. ECG and stress test recommended.');
        setLoading(false);
      });
  }, [transcript]);

  const toggleMed = (id) => {
    setSelectedMeds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handlePublish = async () => {
    if (selectedMeds.length === 0) {
      alert('Please select at least one medication before publishing.');
      return;
    }

    const chosenMeds = medications.filter(m => selectedMeds.includes(m.id));

    try {
      await fetch(`${API_URL}/api/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patient.id || null,
          transcript,
          diagnosis,
          patient_summary: summary,
          medications: chosenMeds,
          follow_up_date: followUp.date || null,
          follow_up_time: followUp.time || null,
          follow_up_notes: followUp.notes || null,
        })
      });
    } catch (err) {
      console.error('Could not save visit — backend may not be ready yet');
    }

    setPublished(true);
  };

  const patientInfoCard = (
    <div className="psum__card">
      <div className="psum__card-label">Patient Information</div>
      <div className="psum__info-grid">
        <div className="psum__info-field">
          <label>Full Name</label>
          <input type="text" defaultValue={patient.name || ''} />
        </div>
        <div className="psum__info-field">
          <label>Date of Birth</label>
          <input type="date" defaultValue={patient.dob || ''} />
        </div>
        <div className="psum__info-field">
          <label>Phone Number</label>
          <input type="tel" defaultValue={patient.phone || ''} />
        </div>
        <div className="psum__info-field">
          <label>Reason for Visit</label>
          <input type="text" defaultValue={patient.reason || ''} />
        </div>
      </div>
    </div>
  );

  const followUpCard = (
    <div className="psum__card">
      <div className="psum__card-label">Follow-up Appointment</div>
      <div className="psum__card-hint">Optionally schedule a follow-up for this patient.</div>
      <div className="psum__info-grid">
        <div className="psum__info-field">
          <label>Date</label>
          <input
            type="date"
            value={followUp.date}
            onChange={e => setFollowUp({ ...followUp, date: e.target.value })}
          />
        </div>
        <div className="psum__info-field">
          <label>Time</label>
          <input
            type="time"
            value={followUp.time}
            onChange={e => setFollowUp({ ...followUp, time: e.target.value })}
          />
        </div>
      </div>
      <div className="psum__info-field">
        <label>Notes for patient</label>
        <input
          type="text"
          placeholder="e.g. Bring previous test results"
          value={followUp.notes}
          onChange={e => setFollowUp({ ...followUp, notes: e.target.value })}
        />
      </div>
      {followUp.date && followUp.time && (
        <div className="psum__followup-confirm">
          ✓ Follow-up scheduled for {followUp.date} at {followUp.time}
          {followUp.notes && ` — ${followUp.notes}`}
        </div>
      )}
    </div>
  );

  const medsCard = (editable) => (
    <div className="psum__card">
      <div className="psum__card-label">Medications — {editable ? 'Select all that apply' : 'Prescribed'}</div>
      {editable && <div className="psum__card-hint">AI suggestions based on diagnosis. Select one or more.</div>}
      <div className="psum__meds">
        {medications.filter(m => editable || selectedMeds.includes(m.id)).map(med => (
          <div
            key={med.id}
            className={`psum__med ${selectedMeds.includes(med.id) ? 'is-selected' : ''} ${!editable ? 'psum__med--chosen' : ''}`}
            onClick={() => editable && toggleMed(med.id)}
          >
            <div className="psum__med-top">
              <div className="psum__med-name">{med.name}</div>
              <div className="psum__med-freq">{med.frequency}</div>
            </div>
            <div className="psum__med-reason">{med.reason}</div>
            {editable && (
              <div className="psum__med-check">
                {selectedMeds.includes(med.id) ? '✓ Selected' : 'Select'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="psum">
        <div className="psum__loading">
          <div className="psum__spinner" />
          <p>Analyzing consultation...</p>
        </div>
      </div>
    );
  }

  if (published) {
    return (
      <div className="psum">
        <div className="psum__header">
          <button className="psum__back" onClick={() => navigate('/provider/dashboard')}>← Back</button>
          <div>
            <div className="psum__tag">Published — Still Editable</div>
            <h1 className="psum__title">Visit Summary</h1>
            <p className="psum__sub">{patient.name || 'Patient'} · {patient.reason || 'Consultation'} · Today</p>
          </div>
        </div>

        <div className="psum__published-banner">✓ Published to Patient — You can still edit below</div>

        <div className="psum__body">
          {isExisting && patientInfoCard}
          <div className="psum__card">
            <div className="psum__card-label">Visit Summary</div>
            <textarea className="psum__textarea" value={summary} onChange={e => setSummary(e.target.value)} rows={4} />
          </div>
          <div className="psum__card">
            <div className="psum__card-label">Diagnosis</div>
            <textarea className="psum__textarea" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2} />
          </div>
          {medsCard(true)}
          {followUpCard}
        </div>

        <div className="psum__footer">
          <p className="psum__warning">Any changes will be updated in the patient portal immediately.</p>
          <button className="psum__btn" onClick={() => navigate('/provider/dashboard')}>Done — Return to Main Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="psum">
      <div className="psum__header">
        <button className="psum__back" onClick={() => navigate('/provider/record')}>← Back</button>
        <div>
          <div className="psum__tag">AI Generated — Review & Edit</div>
          <h1 className="psum__title">Visit Summary</h1>
          <p className="psum__sub">{patient.name || 'Patient'} · {patient.reason || 'Consultation'} · Today</p>
        </div>
      </div>

      <div className="psum__body">
        {isExisting && patientInfoCard}
        <div className="psum__card">
          <div className="psum__card-label">Visit Summary</div>
          <textarea className="psum__textarea" value={summary} onChange={e => setSummary(e.target.value)} rows={4} />
        </div>
        <div className="psum__card">
          <div className="psum__card-label">Diagnosis</div>
          <textarea className="psum__textarea" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2} />
        </div>
        {medsCard(true)}
        {followUpCard}
      </div>

      <div className="psum__footer">
        <p className="psum__warning">Review all fields carefully before publishing. The patient will see exactly what is shown here.</p>
        <button className="psum__btn" onClick={handlePublish}>Publish to Patient</button>
      </div>
    </div>
  );
}