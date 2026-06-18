import { useState, useEffect, useRef } from 'react'
import { RefreshCw, Bell, Sun, Moon, CheckCircle, Menu, X, Flame, Clock, AlertTriangle } from 'lucide-react'
import { computeStreak, getLastActivityTimestamp } from '../utils/activity'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'resources', label: 'Resources' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'mocks', label: 'PYQs' },
]

function generateNotifications(activity) {
  const notifications = []
  const streak = computeStreak(activity)
  if (streak > 0) {
    notifications.push({
      id: 'streak',
      icon: Flame,
      color: 'var(--accent-orange)',
      title: `${streak}-Day Streak!`,
      message: `You've studied for ${streak} consecutive day${streak > 1 ? 's' : ''}.`,
    })
  }

  const lastActivity = getLastActivityTimestamp(activity)
  if (lastActivity) {
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / 86400000)
    if (daysSince >= 3) {
      notifications.push({
        id: 'inactive',
        icon: AlertTriangle,
        color: 'var(--accent-orange)',
        title: 'Study Streak at Risk',
        message: `You haven't updated progress in ${daysSince} days.`,
      })
    }
  }

  const examDate = new Date('2027-02-06T09:00:00').getTime()
  const daysLeft = Math.ceil((examDate - Date.now()) / 86400000)
  if (daysLeft > 0 && daysLeft <= 60) {
    notifications.push({
      id: 'urgency',
      icon: Clock,
      color: 'var(--accent-orange)',
      title: 'Exam Approaching',
      message: `${daysLeft} days until GATE 2027. Stay focused!`,
    })
  }

  return notifications
}

function ProfileModal({ profile, setProfile, onClose }) {
  const [name, setName] = useState(profile?.name || '')
  const [year, setYear] = useState(profile?.year || '2027')

  function handleSave() {
    setProfile({ name: name.trim(), year })
    onClose()
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Edit profile">
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <h3>Edit Profile</h3>
        <label htmlFor="profile-name">Your Name</label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          autoFocus
        />
        <label htmlFor="profile-year">Target Year</label>
        <input
          id="profile-year"
          type="text"
          value={year}
          onChange={e => setYear(e.target.value)}
          placeholder="e.g. 2027"
        />
        <div className="profile-modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default function TopNav({ currentView, setView, theme, setTheme, profile, setProfile, activity, onMenuToggle }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [readNotifications, setReadNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('readNotifications') || '[]') } catch { return [] }
  })
  const notifRef = useRef(null)

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const notifications = generateNotifications(activity)
  const initials = profile?.name?.trim() ? profile.name.trim().charAt(0).toUpperCase() : 'G'
  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id)).length

  function openNotifications() {
    setShowNotifications(prev => {
      if (!prev) {
        const allIds = notifications.map(n => n.id)
        const updated = [...new Set([...readNotifications, ...allIds])]
        setReadNotifications(updated)
        localStorage.setItem('readNotifications', JSON.stringify(updated))
      }
      return !prev
    })
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') {
        setShowNotifications(false)
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <>
      <header className="top-nav" role="banner">
        <div className="top-nav-tabs" role="tablist" aria-label="Main navigation">
          <button
            className="hamburger-btn"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'none', alignItems: 'center', padding: '6px', marginRight: '8px' }}
          >
            <Menu size={20} />
          </button>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`top-tab ${currentView === tab.id ? 'active' : ''}`}
              onClick={() => setView(tab.id)}
              role="tab"
              aria-selected={currentView === tab.id}
              aria-current={currentView === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="sync-btn sync-btn-desktop"
            onClick={() => window.location.reload()}
            aria-label="Refresh data"
          >
            <RefreshCw size={12} aria-hidden="true" /> Sync Data
          </button>

          <button 
            className="icon-btn" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>

          <div style={{ position: 'relative' }} ref={notifRef}>
            <button 
              className="icon-btn" 
              onClick={openNotifications}
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              aria-expanded={showNotifications}
            >
              <Bell size={18} aria-hidden="true" />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: 'var(--accent-orange)', borderRadius: '50%', border: '2px solid var(--bg-base)' }} aria-hidden="true"></span>
              )}
            </button>

            {showNotifications && (
              <div
                className="bento-card"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  width: '300px',
                  marginTop: '8px',
                  zIndex: 100,
                  padding: '12px',
                  animation: 'fadeIn 0.15s ease',
                }}
                role="menu"
              >
                <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '16px 0', textAlign: 'center' }}>
                    No notifications yet
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map(n => {
                      const Icon = n.icon
                      return (
                        <div key={n.id} style={{ display: 'flex', gap: '10px', fontSize: '11px' }} role="menuitem">
                          <Icon size={14} color={n.color} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                          <div>
                            <strong style={{ color: 'var(--text-primary)' }}>{n.title}</strong>
                            <div style={{ color: 'var(--text-secondary)' }}>{n.message}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="avatar avatar-initials"
            onClick={() => setShowProfile(true)}
            aria-label="Edit profile"
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))', border: 'none', cursor: 'pointer' }}
          >
            {initials}
          </button>
        </div>
      </header>

      {showProfile && (
        <ProfileModal
          profile={profile}
          setProfile={setProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  )
}
