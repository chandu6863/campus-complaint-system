import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/StatusBadge.jsx'
import { complaintService, authService } from '../services/api.js'

const s = {
  page:   { minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main:   { maxWidth: '1280px', margin: '0 auto', padding: '2rem' },
  h1:     { fontSize: '2rem', fontWeight: '800', color: '#e2e0ff', margin: '0 0 0.2rem', letterSpacing: '-1px' },
  sub:    { color: '#64748b', fontSize: '0.93rem', margin: '0 0 2rem' },
  grid4:  { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' },
  stat:   (c) => ({ background: 'rgba(255,255,255,0.025)', border: `1px solid ${c}28`, borderRadius: '14px', padding: '1.25rem', borderLeft: `3px solid ${c}` }),
  statN:  (c) => ({ fontSize: '2.2rem', fontWeight: '800', color: c, margin: 0 }),
  statL:  { color: '#64748b', fontSize: '0.76rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  chips:  { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' },
  chip:   (a) => ({ padding: '0.42rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '500', border: `1px solid ${a ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`, background: a ? 'rgba(139,92,246,0.15)' : 'transparent', color: a ? '#a78bfa' : '#64748b' }),
  wrap:   { background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' },
  table:  { width: '100%', borderCollapse: 'collapse' },
  th:     { padding: '0.72rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  td:     { padding: '0.95rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' },
  tname:  { color: '#e2e0ff', fontWeight: '600', fontSize: '0.88rem', marginBottom: '0.15rem' },
  tmeta:  { color: '#64748b', fontSize: '0.76rem' },
  actBtn: { padding: '0.38rem 0.85rem', borderRadius: '7px', border: '1px solid rgba(139,92,246,0.28)', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' },
  overlay:{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' },
  modal:  { background: '#111120', border: '1px solid rgba(139,92,246,0.28)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px' },
  mT:     { fontSize: '1.2rem', fontWeight: '700', color: '#e2e0ff', margin: '0 0 0.5rem' },
  mSub:   { color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 1.5rem' },
  lbl:    { display: 'block', color: '#94a3b8', fontSize: '0.76rem', fontWeight: '600', marginBottom: '0.38rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  sel:    { width: '100%', padding: '0.68rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,15,28,0.95)', color: '#e2e0ff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' },
  ta:     { width: '100%', padding: '0.68rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#e2e0ff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem', resize: 'vertical', minHeight: '78px' },
  btnRow: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  save:   { padding: '0.62rem 1.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: '#fff', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' },
  cancel: { padding: '0.62rem 1.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' },
}

export default function AdminDashboard() {
  const navigate                    = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [stats, setStats]           = useState({})
  const [filter, setFilter]         = useState('')
  const [staff, setStaff]           = useState([])
  const [modal, setModal]           = useState(null)
  const [upd, setUpd]               = useState({ status: '', adminNote: '', assignedTo: '' })
  const [saving, setSaving]         = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [c, st, u] = await Promise.all([
        complaintService.getAll({ limit: 200 }),
        complaintService.getStats(),
        authService.getUsers(),
      ])
      setComplaints(c.data.complaints)
      setStats(st.data.stats)
      setStaff(u.data.users)
    } catch {}
  }

  const openModal = (c) => {
    setModal(c)
    setUpd({ status: c.status, adminNote: c.adminNote ?? '', assignedTo: c.assignedTo?._id ?? '' })
  }

  const handleSave = async () => {
    setSaving(true)
    try { await complaintService.updateStatus(modal._id, upd); setModal(null); fetchAll() } catch {}
    setSaving(false)
  }

  const filtered  = filter ? complaints.filter(c => c.status === filter) : complaints
  const statItems = [
    { label: 'Total',       val: stats.total         ?? 0, color: '#a78bfa' },
    { label: 'Pending',     val: stats.pending        ?? 0, color: '#fbbf24' },
    { label: 'In Progress', val: stats['in-progress'] ?? 0, color: '#60a5fa' },
    { label: 'Resolved',    val: stats.resolved       ?? 0, color: '#4ade80' },
  ]

  return (
    <div style={s.page}>
      <Navbar />

      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.mT}>Update Complaint</h2>
            <p style={s.mSub}>{modal.title}</p>
            <div><label style={s.lbl}>Status</label>
              <select style={s.sel} value={upd.status} onChange={e => setUpd({ ...upd, status: e.target.value })}>
                {['pending','in-progress','resolved','rejected'].map(v => (
                  <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                ))}
              </select></div>
            <div><label style={s.lbl}>Assign to Staff</label>
              <select style={s.sel} value={upd.assignedTo} onChange={e => setUpd({ ...upd, assignedTo: e.target.value })}>
                <option value="">— Unassigned —</option>
                {staff.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
              </select></div>
            <div><label style={s.lbl}>Admin Note</label>
              <textarea style={s.ta} value={upd.adminNote} onChange={e => setUpd({ ...upd, adminNote: e.target.value })} placeholder="Add a note visible to the student…" /></div>
            <div style={s.btnRow}>
              <button style={s.cancel} onClick={() => setModal(null)}>Cancel</button>
              <button style={s.save} onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={s.main}>
        <h1 style={s.h1}>Admin Dashboard</h1>
        <p style={s.sub}>Manage all campus complaints and maintenance requests</p>

        <div style={s.grid4}>
          {statItems.map(({ label, val, color }) => (
            <div key={label} style={s.stat(color)}>
              <div style={s.statN(color)}>{val}</div>
              <div style={s.statL}>{label}</div>
            </div>
          ))}
        </div>

        <div style={s.chips}>
          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Filter:</span>
          {['', 'pending', 'in-progress', 'resolved', 'rejected'].map(f => (
            <button key={f} style={s.chip(filter === f)} onClick={() => setFilter(f)}>
              {f || 'All'} ({f ? stats[f] ?? 0 : stats.total ?? 0})
            </button>
          ))}
        </div>

        <div style={s.wrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['Complaint','Status','Priority','Category','Student','Location','Date','Action'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseOut={e  => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...s.td, cursor: 'pointer' }} onClick={() => navigate(`/complaints/${c._id}`)}>
                    <div style={s.tname}>{c.title.length > 42 ? c.title.slice(0, 42) + '…' : c.title}</div>
                    {c.adminNote && <div style={{ ...s.tmeta, color: '#a78bfa', fontSize: '0.72rem' }}>📝 Note added</div>}
                  </td>
                  <td style={s.td}><StatusBadge   status={c.status}     /></td>
                  <td style={s.td}><PriorityBadge priority={c.priority} /></td>
                  <td style={s.td}><CategoryBadge category={c.category} /></td>
                  <td style={s.td}>
                    <div style={{ color: '#e2e0ff', fontSize: '0.85rem' }}>{c.createdBy?.name}</div>
                    <div style={s.tmeta}>{c.createdBy?.studentId}</div>
                  </td>
                  <td style={{ ...s.td, color: '#94a3b8', fontSize: '0.82rem' }}>📍 {c.location}</td>
                  <td style={{ ...s.td, color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td style={s.td}><button style={s.actBtn} onClick={() => openModal(c)}>Update</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No complaints found.</div>
          )}
        </div>
      </div>
    </div>
  )
}