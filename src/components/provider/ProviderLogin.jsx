import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderLogin.css';

export default function ProviderLogin() {
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
    navigate('/provider/dashboard');
  };

  return (
    <div className="plog">
      <div className="plog__card">
        <div className="plog__back" onClick={() => navigate('/')}>← Back</div>

        <div className="plog__header">
          <div className="plog__tag">Provider Portal</div>
          <h1 className="plog__title">Welcome back</h1>
          <p className="plog__sub">Sign in to access your dashboard</p>
        </div>

        <form className="plog__form" onSubmit={handleSubmit}>
          <div className="plog__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@hospital.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="plog__field">
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

          {error && <p className="plog__error">{error}</p>}

          <button className="plog__btn" type="submit">Sign In</button>
        </form>

        <p className="plog__forgot">Forgot your password? <span>Reset it</span></p>
      </div>
    </div>
  );
}