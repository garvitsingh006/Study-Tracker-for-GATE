import { useState, useEffect, useMemo } from 'react'
import { Zap, BarChart, Flame, FlaskConical, PieChart, Lightbulb, Calendar, Github } from 'lucide-react'
import SYLLABUS from '../data/syllabus'
import { flattenSubtopics, computeSummary } from '../utils/progress'
import { computeStreak } from '../utils/activity'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard({ currentTrack, progress, materials = {}, activity = {}, profile, setView }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const examDate = new Date('2027-02-06T09:00:00').getTime()
    const distance = examDate - Date.now()
    if (distance <= 0) return { days: 0, hours: 0, seconds: 0 }
    return {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      seconds: Math.floor((distance % 60000) / 1000),
    }
  })
  const flat = useMemo(() => flattenSubtopics(SYLLABUS), [])

  const summaryCSE = useMemo(() => computeSummary(flat, progress, 'CSE'), [flat, progress])
  const summaryDSAI = useMemo(() => computeSummary(flat, progress, 'DSAI'), [flat, progress])
  
  const overallPercent = Math.round((summaryCSE.percent + summaryDSAI.percent) / 2) || 0

  const inProgressCount = flat.filter(s => progress[s.id] === 'IN_PROGRESS').length
  const completedCount = flat.filter(s => progress[s.id] === 'COMPLETED' || progress[s.id] === 'REVISED').length
  const streak = computeStreak(activity)

  const getTopicStats = (topicId) => {
    const subs = flat.filter(s => s.id.startsWith(topicId))
    const total = subs.length
    if (total === 0) return { percent: 0, done: 0, total: 0 }
    const done = subs.filter(s => progress[s.id] === 'COMPLETED' || progress[s.id] === 'REVISED').length
    return { percent: Math.round((done / total) * 100), done, total }
  }

  const getTopicMaterials = (topicId) => {
    const subs = flat.filter(s => s.id.startsWith(topicId))
    let videos = 0
    let docs = 0
    subs.forEach(s => {
      const mats = materials[s.id] || []
      videos += mats.filter(m => m.type === 'YOUTUBE').length
      docs += mats.filter(m => m.type === 'DOCUMENT' || m.type === 'PYQ').length
    })
    return { videos, docs }
  }

  const algoStats = getTopicStats('pds-algo')
  const algoMats = getTopicMaterials('pds-algo')

  const probStats = getTopicStats('em-prob')
  const probMats = getTopicMaterials('em-prob')

  const mlStats = getTopicStats('ml-sup')
  const mlMats = getTopicMaterials('ml-sup')

  useEffect(() => {
    const examDate = new Date('2027-02-06T09:00:00').getTime()
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = examDate - now
      if (distance < 0) {
        clearInterval(timer)
        return
      }
      setTimeLeft({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        seconds: Math.floor((distance % 60000) / 1000),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const greeting = getGreeting()
  const displayName = profile?.name?.trim() || null

  return (
    <div className="dashboard-view" style={{ maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* Repo Link */}
      <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '-16px' }}>
        <a
          href="https://github.com/garvitsingh006/Prep-Tracker-for-GATE"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            textDecoration: 'none',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-secondary)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
        >
          <Github size={13} aria-hidden="true" />
          Source Code
        </a>
      </div>

      {/* Hero Countdown */}
      <div style={{ textAlign: 'center', margin: '32px 0 48px' }}>
        {displayName && (
          <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
            {greeting}, {displayName}
          </h1>
        )}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(151, 117, 250, 0.1)', border: '1px solid rgba(151, 117, 250, 0.3)', color: 'var(--accent-purple)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '20px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-purple)' }} aria-hidden="true"></div>
          COUNTDOWN TO EXCELLENCE
        </div>
        
        <div className="dashboard-countdown" style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontFamily: 'var(--font-sans)', fontWeight: '800' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 'clamp(40px, 15vw, 120px)', lineHeight: '1', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{timeLeft.days}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', marginTop: '12px' }}>DAYS</div>
          </div>
          <div aria-hidden="true" style={{ fontSize: 'clamp(40px, 15vw, 120px)', lineHeight: '1', color: 'var(--border-subtle)', fontWeight: '400' }}>:</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 'clamp(40px, 15vw, 120px)', lineHeight: '1', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{String(timeLeft.hours).padStart(2, '0')}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', marginTop: '12px' }}>HOURS</div>
          </div>
          <div aria-hidden="true" style={{ fontSize: 'clamp(40px, 15vw, 120px)', lineHeight: '1', color: 'var(--border-subtle)', fontWeight: '400' }}>:</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 'clamp(40px, 15vw, 120px)', lineHeight: '1', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', marginTop: '12px' }}>SECONDS</div>
          </div>
        </div>

        <div className="sr-only" aria-live="polite">
          {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.seconds} seconds until GATE 2027 exam
        </div>
      </div>

      {/* Mini Stats */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '48px' }}>
        <div className="bento-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(43, 216, 196, 0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="label-caps">ACTIVE TOPICS</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{inProgressCount}</div>
          </div>
        </div>
        <div className="bento-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="label-caps">TOTAL PROGRESS</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{overallPercent}%</div>
          </div>
        </div>
        <div className="bento-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245, 166, 35, 0.1)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="label-caps">STREAK</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>
              {streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Streams */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="label-caps" style={{ marginBottom: '6px' }}>SUBJECT MODULES</div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>Core Syllabus Streams</h2>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <button style={{ background: 'var(--bg-card-elevated)', border: 'none', color: 'var(--text-primary)', padding: '5px 10px', fontSize: '10px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}>GRID VIEW</button>
            <button onClick={() => setView('analytics')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '5px 10px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>GRAPH VIEW</button>
          </div>
        </div>

        <div className="modules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {/* Card 1 */}
          <div className="bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="tag shared">SHARED CORE</div>
              <FlaskConical size={16} color="var(--text-muted)" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '32px', lineHeight: '1.3' }}>Algorithms &<br/>Complexity</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>MODULE COMPLETION</span>
              <span style={{ color: 'var(--accent-purple)' }}>{algoStats.percent}%</span>
            </div>
            <div className="progress-track slim" style={{ marginBottom: '16px' }} role="progressbar" aria-valuenow={algoStats.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${algoStats.percent}%`, background: 'var(--accent-purple)' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>◫ {algoMats.videos} Videos</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📄 {algoMats.docs} PDFs</span>
            </div>
            <button onClick={() => setView('resources')} style={{ marginTop: 'auto', width: '100%', background: 'var(--bg-card-hover)', border: 'none', color: 'var(--text-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', cursor: 'pointer' }}>
              VIEW RESOURCES ➔
            </button>
          </div>

          {/* Card 2 (Active) */}
          <div className="bento-card active" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="tag foundation">FOUNDATION</div>
              <PieChart size={16} color="var(--accent-primary)" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '32px', lineHeight: '1.3' }}>Probability &<br/>Statistics</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>MODULE COMPLETION</span>
              <span style={{ color: 'var(--accent-primary)' }}>{probStats.percent}%</span>
            </div>
            <div className="progress-track slim" style={{ marginBottom: '16px', background: 'rgba(79, 70, 229, 0.2)' }} role="progressbar" aria-valuenow={probStats.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${probStats.percent}%`, background: 'var(--accent-primary)' }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-primary)', marginBottom: '32px', fontWeight: '500' }}>
              {probStats.percent === 100 ? '✓ Mastery Achieved' : `${probStats.done}/${probStats.total} Subtopics Done`}
            </div>
            <button onClick={() => setView('syllabus')} style={{ marginTop: 'auto', width: '100%', background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', cursor: 'pointer' }}>
              REVIEW NOTES ➔
            </button>
          </div>

          {/* Card 3 */}
          <div className="bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="tag dsai">DSAI SPECIAL</div>
              <Lightbulb size={16} color="var(--text-muted)" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '32px', lineHeight: '1.3' }}>Machine Learning<br/>Fundamentals</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>MODULE COMPLETION</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{mlStats.percent}%</span>
            </div>
            <div className="progress-track slim" style={{ marginBottom: '16px' }} role="progressbar" aria-valuenow={mlStats.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${mlStats.percent}%`, background: 'var(--accent-cyan)' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>◫ {mlMats.videos} Videos</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📄 {mlMats.docs} PDFs</span>
            </div>
            <button onClick={() => setView('syllabus')} style={{ marginTop: 'auto', width: '100%', background: 'var(--bg-card-hover)', border: 'none', color: 'var(--text-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', cursor: 'pointer' }}>
              START LEARNING ➔
            </button>
          </div>
        </div>
      </div>

      {/* GATE 2027 Timeline */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Calendar size={18} color="var(--accent-primary)" aria-hidden="true" />
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>GATE 2027 Timeline</h2>
        </div>
        
        <div className="bento-card" style={{ padding: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', minWidth: '700px' }}>
            {[
              { date: 'Nov 2026', title: 'Notification', desc: 'Official notification by IIT' },
              { date: 'Nov-Dec 2026', title: 'Applications', desc: 'Online form available' },
              { date: 'Jan 2027', title: 'Admit Card', desc: 'Download from GOAPS' },
              { date: 'Feb 2027', title: 'Exam Days', desc: 'CBT across India', highlight: true },
              { date: 'Mar 2027', title: 'Answer Key', desc: 'Provisional key released' },
              { date: 'Mar 2027', title: 'Results', desc: 'Score card on GOAPS' },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* Connector line */}
                {i < 5 && (
                  <div style={{ position: 'absolute', top: '8px', left: '50%', right: '-50%', height: '2px', background: 'var(--border-subtle)', zIndex: 0 }} aria-hidden="true"></div>
                )}
                {/* Dot */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: item.highlight ? 'var(--accent-orange)' : 'var(--bg-card)',
                  border: `2px solid ${item.highlight ? 'var(--accent-orange)' : 'var(--border-subtle)'}`,
                  zIndex: 1,
                  marginBottom: '10px',
                }} aria-hidden="true"></div>
                {/* Content */}
                <div style={{ textAlign: 'center', padding: '0 8px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '600', marginBottom: '4px' }}>{item.date}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: item.highlight ? 'var(--accent-orange)' : 'var(--text-primary)', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  )
}
