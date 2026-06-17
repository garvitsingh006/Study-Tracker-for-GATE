import { useState } from 'react'
import { RefreshCw, Bell, Sun, Moon, CheckCircle } from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'resources', label: 'Resources' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'schedule', label: 'Schedule' },
]

export default function TopNav({ currentView, setView, theme, setTheme }) {
  const [showNotifications, setShowNotifications] = useState(false)

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header className="top-nav">
      <div className="top-nav-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`top-tab ${currentView === tab.id ? 'active' : ''}`}
            onClick={() => setView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="sync-btn" 
          onClick={() => window.location.reload()}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <RefreshCw size={12} /> Sync Data
        </button>

        <button 
          className="icon-btn" 
          onClick={toggleTheme}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '6px' }}
          title="Toggle Light/Dark Mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '6px' }}
          >
            <Bell size={18} />
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '6px', height: '6px', background: 'var(--accent-orange)', borderRadius: '50%' }}></span>
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              width: '280px',
              background: 'var(--bg-card-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              marginTop: '8px',
              zIndex: 100,
              padding: '12px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                Notifications
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                  <CheckCircle size={14} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Streak Maintained!</strong>
                    <div style={{ color: 'var(--text-secondary)' }}>You've studied for 12 days in a row.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                  <Bell size={14} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Upcoming Review</strong>
                    <div style={{ color: 'var(--text-secondary)' }}>Probability & Statistics review scheduled for tomorrow.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))' }}></div>
      </div>
    </header>
  )
}
