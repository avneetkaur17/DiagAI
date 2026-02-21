import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProviderSummary.css';

const aiMedications = [
  { id: 1, name: 'Aspirin 81mg', frequency: 'Once daily', reason: 'Cardiac protection' },
  { id: 2, name: 'Metoprolol 25mg', frequency: 'Twice daily', reason: 'Blood pressure & chest pain' },
  { id: 3, name: 'Nitroglycerin 0.4mg', frequency: 'As needed', reason: 'Acute chest pain relief' },
];

export default function ProviderSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const isExisting = location.state?.isExisting || false;

  const [summary, setSummary] = useState('Patient presented with a dull aching chest pain on the left side lasting two days, accompanied by shortness of breath on exertion. No dizziness reported. Vitals stable. Likely cardiac origin, further evaluation recommended.');
  const [diagnosis, setDiagnosis] = useState('Stable angina — possible cardiac origin. ECG and stress test recommended.');
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [followUp, setFollowUp] = useState({ date: '', time: '', notes: '' });
  const [published, setPublished] = useState(false);

  const toggleMed = (id) => {
    setSelectedMeds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handlePublish = () => {
    if (selectedMeds.length === 0) {
      alert('Please select at least one medication before publishing.');
      return;
    }
    setPublished(true);
  };

  const patientInfoCard = (
    <div className="psum__card">
      <div className="psum__card-label">Patient Information</div>
      <div className="psum__info-grid">
        <div className="psum__info-field">
          <label>Full Name</label>
          <input type="text" defaultValue="Sarah Johnson" />
        </div>
        <div className="psum__info-field">
          <label>Date of Birth</label>
          <input type="date" defaultValue="1990-03-12" />
        </div>
        <div className="psum__info-field">
          <label>Phone Number</label>
          <input type="tel" defaultValue="2145550101" />
        </div>
        <div className="psum__info-field">
          <label>Reason for Visit</label>
          <input type="text" defaultValue="Follow-up" />
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
        {aiMedications.filter(m => editable || selectedMeds.includes(m.id)).map(med => (
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

  if (published) {
    return (
      <div className="psum">
        <div className="psum__header">
          <button className="psum__back" onClick={() => navigate('/provider/dashboard')}>← Back</button>
          <div>
            <div className="psum__tag">Published — Still Editable</div>
            <h1 className="psum__title">Visit Summary</h1>
            <p className="psum__sub">Sarah Johnson · Follow-up · Today</p>
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
          <p className="psum__sub">Sarah Johnson · Follow-up · Today</p>
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