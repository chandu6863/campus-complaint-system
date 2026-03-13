import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const s = {
  page: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  card: { width: '100%', maxWidth: '480px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: '20px', padding: '2.5rem', backdropFilter: 'blur(20px)' },
  title: { fontSize: '1.9rem', fontWeight: '800', color: '#e2e0ff', margin: '0 0 0.25rem', letterSpacing: '-1px', textAlign: 'center' },
  sub: { color: '#64748b', fontSize: '0.88rem', margin: '0 0 2rem', textAlign: 'center' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '0.72rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#e2e0ff', fontSize: '0.93rem', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.72rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,28,0.95)', color: '#e2e0ff', fontSize: '0.93rem', outline: 'none', boxSizing: 'border-box' },
  field: { marginBottom: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  btn: { width: '100%', padding: '0.85rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.25rem' },
  err: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.88rem' },
  a: { color: '#a78bfa', textDecoration: 'none', fontWeight: '600' },
}

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'student', department: '', studentId: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register }          = useAuth()
  const navigate              = useNavigate()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>🏛️ Create Account</h1>
        <p style={s.sub}>Join CampusDesk to submit and track complaints</p>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.field}><label style={s.label}>Full Name</label>
            <input style={s.input} value={form.name} onChange={set('name')} required placeholder="Jane Smith" /></div>
          <div style={s.field}><label style={s.label}>Email Address</label>
            <input style={s.input} type="email" value={form.email} onChange={set('email')} required placeholder="jane@campus.edu" /></div>
          <div style={s.field}><label style={s.label}>Password</label>
            <input style={s.input} type="password" value={form.password} onChange={set('password')} required placeholder="Min 6 characters" /></div>
          <div style={s.grid}>
            <div style={s.field}><label style={s.label}>Role</label>
              <select style={s.select} value={form.role} onChange={set('role')}>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select></div>
            <div style={s.field}><label style={s.label}>Department</label>
              <input style={s.input} value={form.department} onChange={set('department')} placeholder="e.g. Computer Sci" /></div>
          </div>
          {form.role === 'student' && (
            <div style={s.field}><label style={s.label}>Student ID</label>
              <input style={s.input} value={form.studentId} onChange={set('studentId')} placeholder="e.g. STU2024001" /></div>
          )}
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <div style={s.footer}>Already have an account? <Link to="/login" style={s.a}>Sign in</Link></div>
      </div>
    </div>
  )
}