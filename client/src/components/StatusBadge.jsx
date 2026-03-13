import React from 'react'

const statusCfg = {
  pending:      { bg: 'rgba(251,191,36,0.14)',  color: '#fbbf24', border: 'rgba(251,191,36,0.28)',  label: '⏳ Pending'     },
  'in-progress':{ bg: 'rgba(59,130,246,0.14)',  color: '#60a5fa', border: 'rgba(59,130,246,0.28)',  label: '🔧 In Progress' },
  resolved:     { bg: 'rgba(34,197,94,0.14)',   color: '#4ade80', border: 'rgba(34,197,94,0.28)',   label: '✅ Resolved'    },
  rejected:     { bg: 'rgba(239,68,68,0.14)',   color: '#f87171', border: 'rgba(239,68,68,0.28)',   label: '❌ Rejected'    },
}

const priorityCfg = {
  low:    { bg: 'rgba(148,163,184,0.14)', color: '#94a3b8', border: 'rgba(148,163,184,0.28)', label: 'Low'       },
  medium: { bg: 'rgba(251,191,36,0.14)',  color: '#fbbf24', border: 'rgba(251,191,36,0.28)',  label: 'Medium'    },
  high:   { bg: 'rgba(249,115,22,0.14)',  color: '#fb923c', border: 'rgba(249,115,22,0.28)',  label: 'High'      },
  urgent: { bg: 'rgba(239,68,68,0.14)',   color: '#f87171', border: 'rgba(239,68,68,0.28)',   label: '🚨 Urgent' },
}

const catIcons = { electrical:'⚡', plumbing:'🔧', internet:'🌐', furniture:'🪑', cleaning:'🧹', security:'🔒', other:'📋' }

const pill = (cfg) => ({
  padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.74rem',
  fontWeight: '600', background: cfg.bg, color: cfg.color,
  border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap', display: 'inline-block',
})

export function StatusBadge({ status }) {
  const cfg = statusCfg[status] ?? statusCfg.pending
  return <span style={pill(cfg)}>{cfg.label}</span>
}

export function PriorityBadge({ priority }) {
  const cfg = priorityCfg[priority] ?? priorityCfg.medium
  return <span style={{ ...pill(cfg), fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{cfg.label}</span>
}

export function CategoryBadge({ category }) {
  return (
    <span style={{
      padding: '0.22rem 0.65rem', borderRadius: '6px', fontSize: '0.74rem',
      fontWeight: '500', background: 'rgba(139,92,246,0.1)', color: '#a78bfa',
      border: '1px solid rgba(139,92,246,0.22)', display: 'inline-block',
    }}>
      {catIcons[category] ?? '📋'} {category}
    </span>
  )
}