import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const s = {
  page: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  card: { width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)' },
  logo: { textAlign: 'center', marginBottom: '2rem' },
  logoIcon: { fontSize: '2.8rem', display: 'block', marginBottom: '0.5rem' },
  title: { fontSize: '1.9rem', fontWeight: '800', color: '#e2e0ff', margin: '0 0 0.25rem', letterSpacing: '-1px' },
  sub: { color: '#64748b', fontSize: '0.88rem', margin: 0 },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '0.72rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#e2e0ff', fontSize: '0.93rem', outline: 'none', boxSizing: 'border-box' },
  field: { marginBottom: '1.25rem' },
  btn: { width: '100%', padding: '0.85rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.25rem' },
  err: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.88rem' },
  a: { color: '#a78bfa', textDecoration: 'none', fontWeight: '600' },
  demo: { marginTop: '1rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.14)', fontSize: '0.78rem', color: '#64748b', textAlign: 'center', lineHeight: 1.7 },
}

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <span style={s.logoIcon}>🏛️</span>
          <h1 style={s.title}>CampusDesk</h1>
          <p style={s.sub}>Smart Complaint &amp; Maintenance System</p>
        </div>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input style={s.input} type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required placeholder="you@campus.edu" />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required placeholder="••••••••" />
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div style={s.footer}>
          Don't have an account? <Link to="/register" style={s.a}>Register here</Link>
        </div>
        <div style={s.demo}>
          <strong style={{ color: '#a78bfa' }}>Demo accounts</strong><br />
          Admin: admin@campus.edu / admin123<br />
          Student: student@campus.edu / student123
        </div>
      </div>
    </div>
  )
}