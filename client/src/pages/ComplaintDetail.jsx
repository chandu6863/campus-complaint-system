import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/StatusBadge.jsx'
import { complaintService } from '../services/api.js'

const s = {
  page:  { minHeight: '100vh', background: '#0a0a0f', paddingTop: '64px', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main:  { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  back:  { background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.46rem 1rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.88rem' },
  card:  { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '2rem', marginBottom: '1.25rem' },
  h1:    { fontSize: '1.75rem', fontWeight: '800', color: '#e2e0ff', margin: '0 0 1rem', lineHeight: 1.3 },
  brow:  { display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  secT:  { color: '#64748b', fontSize: '0.76rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' },
  body:  { color: '#cbd5e1', fontSize: '0.93rem', lineHeight: 1.75, margin: 0 },
  grid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' },
  mItem: { background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' },
  mKey:  { color: '#64748b', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' },
  mVal:  { color: '#e2e0ff', fontSize: '0.88rem' },
  img:   { width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' },
  note:  { marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px' },
  tlRow: { display: 'flex', gap: '1rem', marginBottom: '1.2rem' },
  dot:   (c) => ({ width: '10px', height: '10px', borderRadius: '50%', background: c, marginTop: '5px', flexShrink: 0 }),
  tlS:   { color: '#e2e0ff', fontSize: '0.88rem', fontWeight: '600', textTransform: 'capitalize' },
  tlN:   { color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.15rem' },
  tlD:   { color: '#64748b', fontSize: '0.76rem', marginTop: '0.15rem' },
}

const dotColors = { pending: '#fbbf24', 'in-progress': '#60a5fa', resolved: '#4ade80', rejected: '#f87171' }

export default function ComplaintDetail() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    complaintService.getById(id)
      .then(r => { setComplaint(r.data.complaint); setLoading(false) })
      .catch(() => navigate(-1))
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
      Loading complaint…
    </div>
  )
  if (!complaint) return null

  const meta = [
    ['📍 Location',     complaint.location],
    ['👤 Submitted By', complaint.createdBy?.name],
    ['🆔 Student ID',   complaint.createdBy?.studentId || 'N/A'],
    ['📅 Submitted',    new Date(complaint.createdAt).toLocaleString()],
    ['🔧 Assigned To',  complaint.assignedTo?.name || 'Unassigned'],
    ['✅ Resolved At',  complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : 'N/A'],
  ]

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.main}>
        <button style={s.back} onClick={() => navigate(-1)}>← Back</button>

        <div style={s.card}>
          <h1 style={s.h1}>{complaint.title}</h1>
          <div style={s.brow}>
            <StatusBadge   status={complaint.status}     />
            <PriorityBadge priority={complaint.priority} />
            <CategoryBadge category={complaint.category} />
          </div>
          <div style={s.secT}>Description</div>
          <p style={s.body}>{complaint.description}</p>
          <div style={s.grid}>
            {meta.map(([k, v]) => (
              <div key={k} style={s.mItem}>
                <div style={s.mKey}>{k}</div>
                <div style={s.mVal}>{v}</div>
              </div>
            ))}
          </div>
          {complaint.adminNote && (
            <div style={s.note}>
              <div style={s.secT}>Admin Note</div>
              <p style={{ ...s.body, color: '#a78bfa' }}>{complaint.adminNote}</p>
            </div>
          )}
        </div>

        {complaint.image && (
          <div style={s.card}>
            <div style={s.secT}>Attached Image</div>
            <img src={`http://localhost:5000${complaint.image}`} alt="complaint" style={s.img} />
          </div>
        )}

        {complaint.statusHistory?.length > 0 && (
          <div style={s.card}>
            <div style={s.secT}>Status History</div>
            {[...complaint.statusHistory].reverse().map((h, i) => (
              <div key={i} style={s.tlRow}>
                <div style={s.dot(dotColors[h.status] ?? '#94a3b8')} />
                <div>
                  <div style={s.tlS}>{h.status.replace('-', ' ')}</div>
                  {h.note && <div style={s.tlN}>{h.note}</div>}
                  <div style={s.tlD}>
                    {new Date(h.changedAt).toLocaleString()}
                    {h.changedBy?.name && ` — by ${h.changedBy.name}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}