import { useState, useEffect } from 'react'
import { LayoutDashboard, BookOpen, Layers, Repeat, Settings, Download, Upload } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { exportData, importData } from '../utils/backup'

// Countdown helper — computed synchronously so there's no "0" flash
function getTimeLeft() {
  const examDate = new Date('2027-02-06T09:00:00').getTime()
  const distance = examDate - Date.now()
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0}
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
  }
}

export default function Sidebar({ currentTrack, setTrack, currentView, setView }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    importData(file, () => {
      alert('Data imported! Reloading…')
      window.location.reload()
    }, err => alert('Import failed: ' + err))
  }

  const fmt = n => String(n).padStart(2, '0')

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="logo-box">G</div>
        <div>
          <h2 className="brand-name">GATE Preparation Tracker</h2>
          <span className="brand-sub">CSE &amp; DSAI 2027</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Main nav item */}
        <button
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />
        <div className="label-caps" style={{ padding: '4px 12px 8px', fontSize: '9px' }}>ACTIVE TRACK</div>

        <button
          className={`nav-item ${currentView !== 'dashboard' && currentTrack === 'CSE' ? 'active' : ''}`}
          onClick={() => { setTrack('CSE'); setView('syllabus') }}
        >
          <BookOpen size={16} />
          <span>CSE Track</span>
        </button>

        <button
          className={`nav-item ${currentView !== 'dashboard' && currentTrack === 'DSAI' ? 'active' : ''}`}
          onClick={() => { setTrack('DSAI'); setView('syllabus') }}
        >
          <Layers size={16} />
          <span>DSAI Track</span>
        </button>

        <button
          className={`nav-item ${currentView !== 'dashboard' && currentTrack === 'DUAL' ? 'active' : ''}`}
          onClick={() => { setTrack('DUAL'); setView('syllabus') }}
        >
          <Repeat size={16} />
          <span>Dual View</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        {/* Live countdown */}
        <div className="milestone-box">
          <div className="label-caps" style={{ marginBottom: '8px' }}>GATE 2027 COUNTDOWN</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>
            {timeLeft.days}d {fmt(timeLeft.hours)}h {fmt(timeLeft.minutes)}m 
          </div>
        </div>

        {/* Backup */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={exportData}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '7px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
          >
            <Download size={12} /> Export
          </button>
          <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '7px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
            <Upload size={12} /> Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>

        <button
          className="footer-link"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', padding: '4px 0' }}
          onClick={() => setView('analytics')}
        >
          <Settings size={14} /> Settings &amp; Analytics
        </button>
      </div>
    </aside>
  )
}
