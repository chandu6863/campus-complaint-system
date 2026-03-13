import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/StatusBadge.jsx'
import { complaintService } from '../services/api.js'

const s = {
  page:  { minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main:  { maxWidth: '1100px', margin: '0 auto', padding: '2rem' },
  h1:    { fontSize: '2rem', fontWeight: '800', color: '#e2e0ff', margin: '0 0 0.2rem', letterSpacing: '-1px' },
  sub:   { color: '#64748b', fontSize: '0.93rem', margin: '0 0 2rem' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' },
  stat:  { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' },
  statN: (c) => ({ fontSize: '2.1rem', fontWeight: '800', color: c, margin: 0 }),
  statL: { color: '#64748b', fontSize: '0.76rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  tabs:  { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab:   (a) => ({ padding: '0.48rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500', border: `1px solid ${a ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`, background: a ? 'rgba(139,92,246,0.15)' : 'transparent', color: a ? '#a78bfa' : '#64748b' }),
  card:  { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.4rem', marginBottom: '0.9rem', cursor: 'pointer', transition: 'border-color 0.18s' },
  cardT: { fontSize: '1rem', fontWeight: '600', color: '#e2e0ff', margin: '0 0 0.5rem' },
  cardM: { color: '#64748b', fontSize: '0.8rem', margin: 0 },
  brow:  { display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.65rem' },
  form:  { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(139,92,246,0.22)', borderRadius: '18px', padding: '2rem', marginBottom: '2rem' },
  formT: { fontSize: '1.2rem', fontWeight: '700', color: '#e2e0ff', margin: '0 0 1.5rem' },
  lbl:   { display: 'block', color: '#94a3b8', fontSize: '0.76rem', fontWeight: '600', marginBottom: '0.38rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  inp:   { width: '100%', padding: '0.68rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#e2e0ff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' },
  sel:   { width: '100%', padding: '0.68rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,28,0.95)', color: '#e2e0ff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' },
  ta:    { width: '100%', padding: '0.68rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#e2e0ff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem', minHeight: '96px', resize: 'vertical' },
  fgrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  btn:   { padding: '0.68rem 1.4rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: '#fff', fontSize: '0.92rem', fontWeight: '600', cursor: 'pointer' },
  ok:    { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.28)', color: '#4ade80', padding: '0.72rem 1rem', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '1rem' },
  err:   { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#f87171', padding: '0.72rem 1rem', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '1rem' },
  empty: { textAlign: 'center', color: '#64748b', padding: '3rem' },
  del:   { padding: '0.32rem 0.72rem', borderRadius: '7px', border: '1px solid rgba(239,68,68,0.28)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '500' },
}

const INIT = { title: '', description: '', location: '', category: 'other', priority: 'medium', image: null }

export default function StudentDashboard() {
  const { user }                    = useAuth()
  const navigate                    = useNavigate()
  const [tab, setTab]               = useState('complaints')
  const [complaints, setComplaints] = useState([])
  const [stats, setStats]           = useState({})
  const [filter, setFilter]         = useState('')
  const [form, setForm]             = useState(INIT)
  const [loading, setLoading]       = useState(false)
  const [msg, setMsg]               = useState({ type: '', text: '' })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [c, st] = await Promise.all([complaintService.getAll(), complaintService.getStats()])
      setComplaints(c.data.complaints)
      setStats(st.data.stats)
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: '', text: '' })
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v && k !== 'image') fd.append(k, v) })
      if (form.image) fd.append('image', form.image)
      await complaintService.create(fd)
      setMsg({ type: 'ok', text: '✅ Complaint submitted successfully!' })
      setForm(INIT)
      setTab('complaints')
      fetchData()
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.message || 'Failed to submit complaint.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this complaint?')) return
    try { await complaintService.delete(id); fetchData() } catch {}
  }

  const filtered = filter ? complaints.filter(c => c.status === filter) : complaints

  const statItems = [
    { label: 'Total',       val: stats.total         ?? 0, color: '#a78bfa' },
    { label: 'Pending',     val: stats.pending        ?? 0, color: '#fbbf24' },
    { label: 'In Progress', val: stats['in-progress'] ?? 0, color: '#60a5fa' },
    { label: 'Resolved',    val: stats.resolved       ?? 0, color: '#4ade80' },
  ]

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <h1 style={s.h1}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p style={s.sub}>Submit and track your campus maintenance complaints</p>

        <div style={s.grid4}>
          {statItems.map(({ label, val, color }) => (
            <div key={label} style={s.stat}>
              <div style={s.statN(color)}>{val}</div>
              <div style={s.statL}>{label}</div>
            </div>
          ))}
        </div>

        <div style={s.tabs}>
          {[['complaints', '📋 My Complaints'], ['submit', '➕ New Complaint']].map(([t, lbl]) => (
            <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>{lbl}</button>
          ))}
        </div>

        {tab === 'submit' && (
          <div style={s.form}>
            <h2 style={s.formT}>Submit New Complaint</h2>
            {msg.text && <div style={msg.type === 'ok' ? s.ok : s.err}>{msg.text}</div>}
            <form onSubmit={handleSubmit}>
              <div><label style={s.lbl}>Title *</label>
                <input style={s.inp} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Brief title of the issue" /></div>
              <div><label style={s.lbl}>Description *</label>
                <textarea style={s.ta} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Describe the problem in detail…" /></div>
              <div style={s.fgrid}>
                <div><label style={s.lbl}>Location *</label>
                  <input style={s.inp} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required placeholder="e.g. Block A, Room 204" /></div>
                <div><label style={s.lbl}>Category</label>
                  <select style={s.sel} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['electrical','plumbing','internet','furniture','cleaning','security','other'].map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select></div>
                <div><label style={s.lbl}>Priority</label>
                  <select style={s.sel} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {['low','medium','high','urgent'].map(p => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select></div>
                <div><label style={s.lbl}>Image (optional)</label>
                  <input style={{ ...s.inp, padding: '0.5rem 1rem' }} type="file" accept="image/*"
                    onChange={e => setForm({ ...form, image: e.target.files[0] })} /></div>
              </div>
              <button style={s.btn} type="submit" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        )}

        {tab === 'complaints' && (
          <>
            <div style={{ ...s.tabs, marginBottom: '1rem' }}>
              {['', 'pending', 'in-progress', 'resolved', 'rejected'].map(f => (
                <button key={f} style={s.tab(filter === f)} onClick={() => setFilter(f)}>
                  {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All'}
                </button>
              ))}
            </div>
            {filtered.length === 0
              ? <div style={s.empty}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div><p>No complaints yet.</p></div>
              : filtered.map(c => (
                <div key={c._id} style={s.card}
                  onClick={() => navigate(`/complaints/${c._id}`)}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.32)'}
                  onMouseOut={e  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={s.cardT}>{c.title}</h3>
                      <div style={s.brow}>
                        <StatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                        <CategoryBadge category={c.category} />
                      </div>
                      <p style={s.cardM}>📍 {c.location} · {new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    {c.status === 'pending' && (
                      <button style={s.del} onClick={e => handleDelete(e, c._id)}>Delete</button>
                    )}
                  </div>
                </div>
              ))
            }
          </>
        )}
      </div>
    </div>
  )
}