import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Dashboard from './components/Dashboard'
import SyllabusExplorer from './components/SyllabusExplorer'
import ResourcesPage from './components/ResourcesPage'
import AnalyticsPage from './components/AnalyticsPage'
import SchedulePage from './components/SchedulePage'
import { useLocalStorage } from './hooks/useLocalStorage'
import './App.css'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentTrack, setCurrentTrack] = useLocalStorage('gate-tracker:filter', 'DUAL')
  const [progress, setProgress] = useLocalStorage('gate-tracker:progress', {})
  const [materials, setMaterials] = useLocalStorage('gate-tracker:materials', {})
  const [theme, setTheme] = useLocalStorage('gate-tracker:theme', 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function renderView() {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            currentTrack={currentTrack}
            progress={progress}
            setView={setCurrentView}
          />
        )
      case 'syllabus':
        return (
          <SyllabusExplorer
            currentTrack={currentTrack}
            progress={progress}
            setProgress={setProgress}
            materials={materials}
            setMaterials={setMaterials}
          />
        )
      case 'resources':
        return <ResourcesPage materials={materials} setMaterials={setMaterials} />
      case 'analytics':
        return <AnalyticsPage progress={progress} />
      case 'schedule':
        return <SchedulePage />
      default:
        return (
          <Dashboard
            currentTrack={currentTrack}
            progress={progress}
            setView={setCurrentView}
          />
        )
    }
  }

  return (
    <div className="app-container">
      <Sidebar
        currentTrack={currentTrack}
        setTrack={setCurrentTrack}
        currentView={currentView}
        setView={setCurrentView}
      />
      <div className="main-wrapper">
        <TopNav 
          currentView={currentView} 
          setView={setCurrentView} 
          theme={theme}
          setTheme={setTheme}
        />
        <main className="page-content">
          {renderView()}
        </main>
      </div>
    </div>
  )
}
