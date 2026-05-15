'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PatientLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    router.push('/patient/dashboard')
  }

  return (
    <div className="plogin">
      <div className="plogin__card">
        <div className="plogin__back" onClick={() => router.push('/')}>← Back</div>
        <div className="plogin__header">
          <div className="plogin__tag">Patient Portal</div>
          <h1 className="plogin__title">Welcome back</h1>
          <p className="plogin__sub">Sign in to view your visit details</p>
        </div>
        <form className="plogin__form" onSubmit={handleSubmit}>
          <div className="plogin__field">
            <label>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setError('') }} />
          </div>
          <div className="plogin__field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e as any)} />
          </div>
          {error && <p className="plogin__error">{error}</p>}
          <button className="plogin__btn" type="submit">Sign In</button>
        </form>
        <p className="plogin__forgot">Forgot your password? <span>Reset it</span></p>
      </div>
    </div>
  )
}
