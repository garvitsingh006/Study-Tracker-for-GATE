import { useState, useEffect } from 'react'
import { LayoutDashboard, BookOpen, Layers, Repeat, Github, ExternalLink, Download, Upload, Target, TrendingUp } from 'lucide-react'
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

export default function Sidebar({ currentTrack, setTrack, currentView, setView, isOpen, profile }) {
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
  const displayName = profile?.name?.trim() || 'Student'

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="sidebar-header">
        <div className="logo-box" aria-hidden="true">G</div>
        <div>
          <h2 className="brand-name">GATE Preparation Tracker</h2>
          <span className="brand-sub">CSE &amp; DSAI 2027</span>
        </div>
      </div>

      {profile?.name?.trim() && (
        <div style={{ padding: '0 24px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Hi, <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{displayName}</span>
        </div>
      )}

      <nav className="sidebar-nav">
        {/* Main nav item */}
        <button
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
          aria-current={currentView === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard size={16} aria-hidden="true" />
          <span>Dashboard</span>
        </button>

        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />
        <div className="label-caps" style={{ padding: '4px 12px 8px', fontSize: '9px' }}>ACTIVE TRACK</div>

        <button
          className={`nav-item ${currentView !== 'dashboard' && currentTrack === 'CSE' ? 'active' : ''}`}
          onClick={() => { setTrack('CSE'); setView('syllabus') }}
          aria-current={currentView === 'syllabus' && currentTrack === 'CSE' ? 'page' : undefined}
        >
          <BookOpen size={16} aria-hidden="true" />
          <span>CSE Track</span>
        </button>

        <button
          className={`nav-item ${currentView !== 'dashboard' && currentTrack === 'DSAI' ? 'active' : ''}`}
          onClick={() => { setTrack('DSAI'); setView('syllabus') }}
          aria-current={currentView === 'syllabus' && currentTrack === 'DSAI' ? 'page' : undefined}
        >
          <Layers size={16} aria-hidden="true" />
          <span>DSAI Track</span>
        </button>

        <button
          className={`nav-item ${currentView !== 'dashboard' && currentTrack === 'DUAL' ? 'active' : ''}`}
          onClick={() => { setTrack('DUAL'); setView('syllabus') }}
          aria-current={currentView === 'syllabus' && currentTrack === 'DUAL' ? 'page' : undefined}
        >
          <Repeat size={16} aria-hidden="true" />
          <span>Dual View</span>
        </button>

        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />
        <div className="label-caps" style={{ padding: '4px 12px 8px', fontSize: '9px' }}>EXTRA</div>

        <button
          className={`nav-item ${currentView === 'mocks' ? 'active' : ''}`}
          onClick={() => setView('mocks')}
          aria-current={currentView === 'mocks' ? 'page' : undefined}
        >
          <Target size={16} aria-hidden="true" />
          <span>Mock Tests</span>
        </button>

        <button
          className={`nav-item ${currentView === 'cutoffs' ? 'active' : ''}`}
          onClick={() => setView('cutoffs')}
          aria-current={currentView === 'cutoffs' ? 'page' : undefined}
        >
          <TrendingUp size={16} aria-hidden="true" />
          <span>GATE Stats</span>
        </button>

        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />

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
            aria-label="Export data as JSON"
          >
            <Download size={12} aria-hidden="true" /> Export
          </button>
          <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '7px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
            <Upload size={12} aria-hidden="true" /> Import
            <input type="file" accept=".json" onChange={handleImport} className="sr-only" aria-label="Import data from JSON file" />
          </label>
        </div>

        {/* GitHub Card */}
        <a
          href="https://github.com/garvitsingh006/Study-Tracker-for-GATE"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Github size={16} color="var(--text-primary)" aria-hidden="true" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Study Tracker for GATE</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Open Source</div>
          </div>
          <ExternalLink size={12} color="var(--text-muted)" aria-hidden="true" />
        </a>
      </div>
    </aside>
  )
}
