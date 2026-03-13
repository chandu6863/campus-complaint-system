import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const s = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: 'rgba(10,10,20,0.96)', backdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(139,92,246,0.18)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '64px',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' },
  logoIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', flexShrink: 0,
  },
  logoText: { fontSize: '1.1rem', fontWeight: '700', letterSpacing: '-0.5px', color: '#e2e0ff' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  badge: {
    padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.7rem',
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px',
    background: 'rgba(139,92,246,0.18)', color: '#a78bfa',
    border: '1px solid rgba(139,92,246,0.28)',
  },
  userName: { color: '#94a3b8', fontSize: '0.88rem' },
  logoutBtn: {
    padding: '0.42rem 1rem', borderRadius: '8px',
    border: '1px solid rgba(239,68,68,0.28)',
    background: 'rgba(239,68,68,0.08)', color: '#f87171',
    cursor: 'pointer', fontSize: '0.84rem', fontWeight: '500',
  },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={s.nav}>
      <div style={s.logo} onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}>
        <div style={s.logoIcon}>🏛️</div>
        <span style={s.logoText}>CampusDesk</span>
      </div>
      {user && (
        <div style={s.right}>
          <span style={s.userName}>{user.name}</span>
          <span style={s.badge}>{user.role}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </nav>
  )
}