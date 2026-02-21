import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleSelect = (role) => {
    setSelected(role);
    setTimeout(() => navigate(`/${role}/login`), 300);
  };

  return (
    <div className="home">
      <div className="home__grid" aria-hidden="true" />

      <div className="home__badge">
        <span className="home__badge-dot" />
        Powered by AI · HIPAA Compliant
      </div>

      <div className="home__hero">
        <h1 className="home__title">
          <span className="home__title-serif">Diagnostic</span>
          <span className="home__title-sans"> Assistant</span>
        </h1>
        <p className="home__subtitle">
          AI-powered clinical documentation and patient care, in one place.
        </p>
      </div>

      <div className="home__cards">
        <button
          className={`home__card home__card--provider ${hovered === 'provider' ? 'is-hovered' : ''} ${selected === 'provider' ? 'is-selected' : ''}`}
          onMouseEnter={() => setHovered('provider')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleSelect('provider')}
          aria-label="Enter as Healthcare Provider"
        >
          <div className="home__card-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
              <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 18l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="home__card-content">
            <div className="home__card-tag">For Clinicians</div>
            <h2 className="home__card-title">Provider Portal</h2>
            <p className="home__card-desc">
              Record consultations, review AI-generated notes, manage medications, and schedule follow-ups.
            </p>
            <ul className="home__card-features">
              <li><span className="home__feature-dot" />Live AI recording & transcription</li>
              <li><span className="home__feature-dot" />Smart medication suggestions</li>
              <li><span className="home__feature-dot" />After-visit note generation</li>
            </ul>
          </div>
          <div className="home__card-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="home__card-shine" aria-hidden="true" />
        </button>

        <div className="home__divider"><span>or</span></div>

        <button
          className={`home__card home__card--patient ${hovered === 'patient' ? 'is-hovered' : ''} ${selected === 'patient' ? 'is-selected' : ''}`}
          onMouseEnter={() => setHovered('patient')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleSelect('patient')}
          aria-label="Enter as Patient"
        >
          <div className="home__card-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
              <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 20v6M13 23h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="home__card-content">
            <div className="home__card-tag">For Patients</div>
            <h2 className="home__card-title">Patient Portal</h2>
            <p className="home__card-desc">
              View your visit summaries, medications, test results, and manage your upcoming appointments.
            </p>
            <ul className="home__card-features">
              <li><span className="home__feature-dot" />Visit summaries in plain language</li>
              <li><span className="home__feature-dot" />Medications & test results</li>
              <li><span className="home__feature-dot" />Book & track appointments</li>
            </ul>
          </div>
          <div className="home__card-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="home__card-shine" aria-hidden="true" />
        </button>
      </div>

      <p className="home__footer">
        © 2026 Axxess · Diagnostic Assistant · All data encrypted & HIPAA compliant
      </p>
    </div>
  );
}