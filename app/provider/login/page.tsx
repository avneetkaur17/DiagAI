'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProviderLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    router.push('/provider/dashboard')
  }

  return (
    <div className="plog">
      <div className="plog__card">
        <div className="plog__back" onClick={() => router.push('/')}>← Back</div>
        <div className="plog__header">
          <div className="plog__tag">Provider Portal</div>
          <h1 className="plog__title">Welcome back</h1>
          <p className="plog__sub">Sign in to access your dashboard</p>
        </div>
        <form className="plog__form" onSubmit={handleSubmit}>
          <div className="plog__field">
            <label>Email</label>
            <input type="email" placeholder="you@hospital.com" value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setError('') }} />
          </div>
          <div className="plog__field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e as any)} />
          </div>
          {error && <p className="plog__error">{error}</p>}
          <button className="plog__btn" type="submit">Sign In</button>
        </form>
        <p className="plog__forgot">Forgot your password? <span>Reset it</span></p>
      </div>
    </div>
  )
}
