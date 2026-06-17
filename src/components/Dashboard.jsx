import { useState, useEffect, useMemo } from 'react'
import { Zap, BarChart, Flame, FlaskConical, PieChart, Lightbulb } from 'lucide-react'
import SYLLABUS from '../data/syllabus'
import { flattenSubtopics, computeSummary } from '../utils/progress'

export default function Dashboard({ currentTrack, progress, materials = {}, setView }) {
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

  return (
    <div className="dashboard-view" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Hero Countdown */}
      <div style={{ textAlign: 'center', margin: '40px 0 64px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(151, 117, 250, 0.1)', border: '1px solid rgba(151, 117, 250, 0.3)', color: 'var(--accent-purple)', padding: '4px 16px', borderRadius: 'var(--radius-full)', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '24px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
          COUNTDOWN TO EXCELLENCE
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', fontFamily: 'var(--font-sans)', fontWeight: '800' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '120px', lineHeight: '1', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{timeLeft.days}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', marginTop: '16px' }}>DAYS</div>
          </div>
          <div style={{ fontSize: '120px', lineHeight: '1', color: 'var(--border-subtle)', fontWeight: '400' }}>:</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '120px', lineHeight: '1', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{String(timeLeft.hours).padStart(2, '0')}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', marginTop: '16px' }}>HOURS</div>
          </div>
          <div style={{ fontSize: '120px', lineHeight: '1', color: 'var(--border-subtle)', fontWeight: '400' }}>:</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '120px', lineHeight: '1', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.15em', marginTop: '16px' }}>SECONDS</div>
          </div>
        </div>
      </div>

      {/* Mini Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '64px' }}>
        <div className="bento-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(43, 216, 196, 0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} />
          </div>
          <div>
            <div className="label-caps">ACTIVE TOPICS</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{inProgressCount}</div>
          </div>
        </div>
        <div className="bento-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart size={20} />
          </div>
          <div>
            <div className="label-caps">TOTAL PROGRESS</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{overallPercent}%</div>
          </div>
        </div>
        <div className="bento-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245, 166, 35, 0.1)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} />
          </div>
          <div>
            <div className="label-caps">COMPLETED TOPICS</div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Syllabus Streams */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <div className="label-caps" style={{ marginBottom: '8px' }}>SUBJECT MODULES</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em' }}>Core Syllabus Streams</h2>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <button style={{ background: 'var(--bg-card-elevated)', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', fontSize: '10px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}>GRID VIEW</button>
            <button onClick={() => setView('analytics')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '6px 12px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>GRAPH VIEW</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* Card 1 */}
          <div className="bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="tag shared">SHARED CORE</div>
              <FlaskConical size={16} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '32px', lineHeight: '1.3' }}>Algorithms &<br/>Complexity</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>MODULE COMPLETION</span>
              <span style={{ color: 'var(--accent-purple)' }}>{algoStats.percent}%</span>
            </div>
            <div className="progress-track slim" style={{ marginBottom: '16px' }}>
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
              <PieChart size={16} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '32px', lineHeight: '1.3' }}>Probability &<br/>Statistics</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>MODULE COMPLETION</span>
              <span style={{ color: 'var(--accent-primary)' }}>{probStats.percent}%</span>
            </div>
            <div className="progress-track slim" style={{ marginBottom: '16px', background: 'rgba(79, 70, 229, 0.2)' }}>
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
              <Lightbulb size={16} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '32px', lineHeight: '1.3' }}>Machine Learning<br/>Fundamentals</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>MODULE COMPLETION</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{mlStats.percent}%</span>
            </div>
            <div className="progress-track slim" style={{ marginBottom: '16px' }}>
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

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div className="bento-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div className="label-caps" style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>ARCHITECT'S MANIFESTO</div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', lineHeight: '1.2', marginBottom: '24px', position: 'relative', zIndex: 2 }}>
            "Structure defines success. Mastery is the result of focused iteration."
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '13px' }}>— The Architect's Handbook, 2027 Edition</p>
          <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }}></div>
        </div>

        <div className="bento-card" style={{ padding: '32px' }}>
          <div className="label-caps" style={{ marginBottom: '24px' }}>WORKSPACE CONTEXT</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Active Stream</span>
            <span style={{ fontWeight: '600', fontSize: '13px' }}>{currentTrack === 'DUAL' ? 'Dual-Track Sync' : `${currentTrack} Focus`}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Last Local Sync</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: '500', fontSize: '13px' }}>Just now</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Persistence</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)' }}></div>
              CONNECTED
            </span>
          </div>
        </div>
      </div>
      
    </div>
  )
}
