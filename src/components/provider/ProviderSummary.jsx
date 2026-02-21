import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderSummary.css';

const aiMedications = [
  { id: 1, name: 'Aspirin 81mg', frequency: 'Once daily', reason: 'Cardiac protection' },
  { id: 2, name: 'Metoprolol 25mg', frequency: 'Twice daily', reason: 'Blood pressure & chest pain' },
  { id: 3, name: 'Nitroglycerin 0.4mg', frequency: 'As needed', reason: 'Acute chest pain relief' },
];

export default function ProviderSummary() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState('Patient presented with a dull aching chest pain on the left side lasting two days, accompanied by shortness of breath on exertion. No dizziness reported. Vitals stable. Likely cardiac origin, further evaluation recommended.');
  const [diagnosis, setDiagnosis] = useState('Stable angina — possible cardiac origin. ECG and stress test recommended.');
  const [selectedMeds, setSelectedMeds] = useState([]);
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

  if (published) {
  const chosenMeds = aiMedications.filter(m => selectedMeds.includes(m.id));

  return (
    <div className="psum">
      <div className="psum__header">
        <button className="psum__back" onClick={() => navigate('/provider/dashboard')}>← Back to Dashboard</button>
        <div>
          <div className="psum__tag">Published — Still Editable</div>
          <h1 className="psum__title">Visit Summary</h1>
          <p className="psum__sub">Sarah Johnson · Follow-up · Today</p>
        </div>
      </div>

      <div className="psum__published-banner">✓ Published to Patient — You can still edit below</div>

      <div className="psum__body">
        <div className="psum__card">
          <div className="psum__card-label">Visit Summary</div>
          <textarea
            className="psum__textarea"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            rows={4}
          />
        </div>

        <div className="psum__card">
          <div className="psum__card-label">Diagnosis</div>
          <textarea
            className="psum__textarea"
            value={diagnosis}
            onChange={e => setDiagnosis(e.target.value)}
            rows={2}
          />
        </div>

        <div className="psum__card">
          <div className="psum__card-label">Medications — Update selection</div>
          <div className="psum__meds">
            {aiMedications.map(med => (
              <div
                key={med.id}
                className={`psum__med ${selectedMeds.includes(med.id) ? 'is-selected' : ''}`}
                onClick={() => toggleMed(med.id)}
              >
                <div className="psum__med-top">
                  <div className="psum__med-name">{med.name}</div>
                  <div className="psum__med-freq">{med.frequency}</div>
                </div>
                <div className="psum__med-reason">{med.reason}</div>
                <div className="psum__med-check">
                  {selectedMeds.includes(med.id) ? '✓ Selected' : 'Select'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="psum__footer">
        <p className="psum__warning">Any changes will be updated in the patient portal immediately.</p>
        <button className="psum__btn" onClick={() => navigate('/provider/dashboard')}>Done - Return to Main Page</button>
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

        <div className="psum__card">
          <div className="psum__card-label">Visit Summary</div>
          <textarea
            className="psum__textarea"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            rows={4}
          />
        </div>

        <div className="psum__card">
          <div className="psum__card-label">Diagnosis</div>
          <textarea
            className="psum__textarea"
            value={diagnosis}
            onChange={e => setDiagnosis(e.target.value)}
            rows={2}
          />
        </div>

        <div className="psum__card">
          <div className="psum__card-label">Medications — Select all that apply</div>
          <div className="psum__card-hint">AI suggestions based on diagnosis. Select one or more.</div>
          <div className="psum__meds">
            {aiMedications.map(med => (
              <div
                key={med.id}
                className={`psum__med ${selectedMeds.includes(med.id) ? 'is-selected' : ''}`}
                onClick={() => toggleMed(med.id)}
              >
                <div className="psum__med-top">
                  <div className="psum__med-name">{med.name}</div>
                  <div className="psum__med-freq">{med.frequency}</div>
                </div>
                <div className="psum__med-reason">{med.reason}</div>
                <div className="psum__med-check">
                  {selectedMeds.includes(med.id) ? '✓ Selected' : 'Select'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="psum__footer">
        <p className="psum__warning">Review all fields carefully before publishing. The patient will see exactly what is shown here.</p>
        <button className="psum__btn" onClick={handlePublish}>Publish to Patient</button>
      </div>
    </div>
  );
}