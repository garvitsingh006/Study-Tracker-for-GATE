import { useMemo } from 'react'
import SYLLABUS from '../data/syllabus'
import { flattenSubtopics, computeSummary } from '../utils/progress'

const COLORS = {
  UNSTARTED: 'var(--border-subtle)',
  IN_PROGRESS: 'var(--accent-orange)',
  COMPLETED: 'var(--accent-green)',
  REVISED: 'var(--accent-primary)',
}

export default function AnalyticsPage({ progress, activity = {} }) {
  const flat = useMemo(() => flattenSubtopics(SYLLABUS), [])

  const summaryCSE = useMemo(() => computeSummary(flat, progress, 'CSE'), [flat, progress])
  const summaryDSAI = useMemo(() => computeSummary(flat, progress, 'DSAI'), [flat, progress])

  const subjectData = useMemo(() =>
    SYLLABUS.map(subject => {
      const allSubs = subject.topics.flatMap(t => t.subtopics)
      const counts = { UNSTARTED: 0, IN_PROGRESS: 0, COMPLETED: 0, REVISED: 0 }
      for (const sub of allSubs) {
        const st = progress[sub.id] || 'UNSTARTED'
        counts[st]++
      }
      const total = allSubs.length
      const done = counts.COMPLETED + counts.REVISED
      const pct = total ? Math.round((done / total) * 100) : 0

      const isCSEOnly = allSubs.every(s => !s.papers.includes('DSAI'))
      const isDSAIOnly = allSubs.every(s => !s.papers.includes('CSE'))
      const track = isCSEOnly ? 'CSE' : isDSAIOnly ? 'DSAI' : 'SHARED'

      return { id: subject.id, name: subject.name, total, done, pct, counts, track }
    }).sort((a, b) => b.pct - a.pct),
    [progress]
  )

  const totalTopics = flat.length
  const totalDone = flat.filter(s => { const st = progress[s.id]; return st === 'COMPLETED' || st === 'REVISED' }).length
  const totalInProgress = flat.filter(s => progress[s.id] === 'IN_PROGRESS').length
  const overallPct = totalTopics ? Math.round((totalDone / totalTopics) * 100) : 0

  const TRACK_COLOR = { CSE: 'var(--accent-cyan)', DSAI: 'var(--accent-purple)', SHARED: 'var(--accent-primary)' }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Track your completion across both streams.</p>
      </div>

      {/* Top summary cards */}
      <div className="analytics-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'OVERALL', value: `${overallPct}%`, sub: `${totalDone}/${totalTopics} topics`, color: 'var(--accent-primary)' },
          { label: 'CSE', value: `${summaryCSE.percent}%`, sub: `${summaryCSE.completed + summaryCSE.revised}/${summaryCSE.total} done`, color: 'var(--accent-cyan)' },
          { label: 'DSAI', value: `${summaryDSAI.percent}%`, sub: `${summaryDSAI.completed + summaryDSAI.revised}/${summaryDSAI.total} done`, color: 'var(--accent-purple)' },
          { label: 'IN PROGRESS', value: totalInProgress, sub: 'topics active', color: 'var(--accent-orange)' },
        ].map(card => (
          <div key={card.label} className="bento-card" style={{ padding: '16px' }}>
            <div className="label-caps" style={{ marginBottom: '8px', color: card.color }}>{card.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Segmented progress ring (simple bar version) */}
      <div className="bento-card" style={{ marginBottom: '32px', padding: '24px' }}>
        <div className="label-caps" style={{ marginBottom: '16px' }}>OVERALL BREAKDOWN</div>
        <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', gap: '2px' }} role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100} aria-label={`Overall progress: ${overallPct}%`}>
          {(['COMPLETED', 'REVISED', 'IN_PROGRESS', 'UNSTARTED']).map(status => {
            const count = flat.filter(s => (progress[s.id] || 'UNSTARTED') === status).length
            const pct = totalTopics ? (count / totalTopics) * 100 : 0
            if (pct === 0) return null
            return <div key={status} style={{ width: `${pct}%`, background: COLORS[status], transition: 'width 0.5s' }}></div>
          })}
        </div>
        <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
          {Object.entries(COLORS).map(([status, color]) => {
            const count = flat.filter(s => (progress[s.id] || 'UNSTARTED') === status).length
            const labels = { UNSTARTED: 'Not Started', IN_PROGRESS: 'In Progress', COMPLETED: 'Done', REVISED: 'Revised' }
            return (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }}></div>
                {labels[status]}: <strong style={{ color: 'var(--text-primary)' }}>{count}</strong>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-subject breakdown */}
      <div className="label-caps" style={{ marginBottom: '16px' }}>SUBJECT BREAKDOWN</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {subjectData.map(sub => (
          <div key={sub.id} className="bento-card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{sub.name}</div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>✓ {sub.counts.COMPLETED + sub.counts.REVISED} done</span>
                  <span>⌛ {sub.counts.IN_PROGRESS} active</span>
                  <span>○ {sub.counts.UNSTARTED} left</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: TRACK_COLOR[sub.track] }}>{sub.pct}%</div>
                <div style={{ fontSize: '9px', background: sub.track === 'SHARED' ? 'rgba(79,70,229,0.1)' : sub.track === 'CSE' ? 'rgba(43,216,196,0.1)' : 'rgba(151,117,250,0.1)', color: TRACK_COLOR[sub.track], padding: '1px 6px', borderRadius: '3px', fontWeight: '700', marginTop: '4px' }}>{sub.track}</div>
              </div>
            </div>
            {/* Segmented bar */}
            <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', gap: '1px' }} role="progressbar" aria-valuenow={sub.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${sub.name} progress: ${sub.pct}%`}>
              {(['COMPLETED', 'REVISED', 'IN_PROGRESS', 'UNSTARTED']).map(status => {
                const count = sub.counts[status]
                const pct = sub.total ? (count / sub.total) * 100 : 0
                if (pct === 0) return null
                return <div key={status} style={{ width: `${pct}%`, background: COLORS[status] }}></div>
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
