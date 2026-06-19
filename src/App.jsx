import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Dashboard from './components/Dashboard'
import SyllabusExplorer from './components/SyllabusExplorer'
import ResourcesPage from './components/ResourcesPage'
import AnalyticsPage from './components/AnalyticsPage'
import SchedulePage from './components/SchedulePage'
import MockTests from './components/MockTests'
import GateStats from './components/GateStats'
import { useLocalStorage } from './hooks/useLocalStorage'
import { logStatusChange } from './utils/activity'
import './App.css'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTrack, setCurrentTrack] = useLocalStorage('gate-tracker:filter', 'DUAL')
  const [progress, setProgress] = useLocalStorage('gate-tracker:progress', {})
  const [materials, setMaterials] = useLocalStorage('gate-tracker:materials', {})
  const [theme, setTheme] = useLocalStorage('gate-tracker:theme', 'dark')
  const [activity, setActivity] = useLocalStorage('gate-tracker:activity', {})
  const [profile, setProfile] = useLocalStorage('gate-tracker:profile', { name: '', year: '2027' })
  const [schedule, setSchedule] = useLocalStorage('gate-tracker:schedule', {})

  const handleProgressChange = useCallback((subtopicId, newStatus) => {
    setProgress(prev => {
      const from = prev[subtopicId] || 'UNSTARTED'
      setActivity(a => logStatusChange(a, subtopicId, from, newStatus))
      return { ...prev, [subtopicId]: newStatus }
    })
  }, [setProgress, setActivity])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const navigateTo = useCallback((view) => {
    setCurrentView(view)
    setSidebarOpen(false)
  }, [])

  function renderView() {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            currentTrack={currentTrack}
            progress={progress}
            materials={materials}
            activity={activity}
            profile={profile}
            setView={navigateTo}
          />
        )
      case 'syllabus':
        return (
          <SyllabusExplorer
            currentTrack={currentTrack}
            progress={progress}
            setProgress={handleProgressChange}
            materials={materials}
            setMaterials={setMaterials}
          />
        )
      case 'resources':
        return <ResourcesPage materials={materials} setMaterials={setMaterials} />
      case 'analytics':
        return <AnalyticsPage progress={progress} activity={activity} />
      case 'schedule':
        return <SchedulePage schedule={schedule} setSchedule={setSchedule} progress={progress} />
      case 'mocks':
        return <MockTests />
      case 'cutoffs':
        return <GateStats />
      default:
        return (
          <Dashboard
            currentTrack={currentTrack}
            progress={progress}
            materials={materials}
            activity={activity}
            profile={profile}
            setView={navigateTo}
          />
        )
    }
  }

  return (
    <div className="app-container">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        currentTrack={currentTrack}
        setTrack={setCurrentTrack}
        currentView={currentView}
        setView={navigateTo}
        isOpen={sidebarOpen}
        profile={profile}
      />
      <div className="main-wrapper">
        <TopNav 
          currentView={currentView} 
          setView={navigateTo} 
          theme={theme}
          setTheme={setTheme}
          profile={profile}
          setProfile={setProfile}
          activity={activity}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main id="main-content" className="page-content" tabIndex={-1}>
          {renderView()}
        </main>
      </div>
    </div>
  )
}
