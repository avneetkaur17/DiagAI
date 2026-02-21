import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientLogin.css';

export default function PatientLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    navigate('/patient/dashboard');
  };

  return (
    <div className="plogin">
      <div className="plogin__card">
        <div className="plogin__back" onClick={() => navigate('/')}>← Back</div>

        <div className="plogin__header">
          <div className="plogin__tag">Patient Portal</div>
          <h1 className="plogin__title">Welcome back</h1>
          <p className="plogin__sub">Sign in to view your visit details</p>
        </div>

        <form className="plogin__form" onSubmit={handleSubmit}>
          <div className="plogin__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="plogin__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          {error && <p className="plogin__error">{error}</p>}

          <button className="plogin__btn" type="submit">Sign In</button>
        </form>

        <p className="plogin__forgot">Forgot your password? <span>Reset it</span></p>
      </div>
    </div>
  );
}