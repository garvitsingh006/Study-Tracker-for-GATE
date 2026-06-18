import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Clock, RotateCcw, Plus, X, ExternalLink, Download } from 'lucide-react'
import SYLLABUS from '../data/syllabus'
import { computeSummary, flattenSubtopics, nextStatus } from '../utils/progress'
import { detectResourceType, makeMaterial } from '../utils/materials'

// --- Status config ---
const STATUS_CONFIG = {
  UNSTARTED: { label: 'Not Started', color: 'var(--text-muted)', bg: 'transparent', icon: Circle, borderColor: 'var(--border-subtle)' },
  IN_PROGRESS: { label: 'In Progress', color: 'var(--accent-orange)', bg: 'rgba(245,166,35,0.1)', icon: Clock, borderColor: 'var(--accent-orange)' },
  COMPLETED: { label: 'Done', color: 'var(--accent-green)', bg: 'rgba(64,192,87,0.1)', icon: CheckCircle2, borderColor: 'var(--accent-green)' },
  REVISED: { label: 'Revised', color: 'var(--accent-primary)', bg: 'rgba(79,70,229,0.1)', icon: RotateCcw, borderColor: 'var(--accent-primary)' },
}

// --- Inline Resource Add Form ---
function AddResourceForm({ subtopicId, onAdd, onClose }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim() || !title.trim()) return
    const type = detectResourceType(url)
    onAdd(subtopicId, makeMaterial({ title, url, type }))
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '12px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label htmlFor={`resource-title-${subtopicId}`} className="sr-only">Resource title</label>
      <input
        id={`resource-title-${subtopicId}`}
        autoFocus
        type="text"
        placeholder="Resource title (e.g. MIT OCW Lecture 1)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ padding: '8px 10px', background: 'var(--bg-card-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
      />
      <label htmlFor={`resource-url-${subtopicId}`} className="sr-only">Resource URL</label>
      <input
        id={`resource-url-${subtopicId}`}
        type="url"
        placeholder="URL (YouTube, PDF, article…)"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ padding: '8px 10px', background: 'var(--bg-card-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
      />
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
        <button type="submit" style={{ background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
      </div>
    </form>
  )
}

// --- Single Subtopic Row ---
function SubtopicRow({ subtopic, status, materials, onCycleStatus, onAddMaterial, onRemoveMaterial }) {
  const [showResources, setShowResources] = useState(false)
  const [addingResource, setAddingResource] = useState(false)

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.UNSTARTED
  const Icon = cfg.icon
  const isDone = status === 'COMPLETED' || status === 'REVISED'
  const subMaterials = materials || []
  const isShared = subtopic.papers.includes('CSE') && subtopic.papers.includes('DSAI')

  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', cursor: 'pointer' }}>
        {/* Status cycle button */}
        <button
          title={`Status: ${cfg.label} — click to cycle`}
          onClick={() => onCycleStatus(subtopic.id)}
          aria-label={`${subtopic.name}: status ${cfg.label}. Click to change.`}
          style={{ background: cfg.bg, border: `1px solid ${cfg.borderColor}`, borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <Icon size={13} color={cfg.color} aria-hidden="true" />
        </button>

        {/* Name */}
        <span
          style={{ fontSize: '13px', fontWeight: '400', flexGrow: 1, lineHeight: '1.4', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}
          onClick={() => onCycleStatus(subtopic.id)}
        >
          {subtopic.name}
        </span>

        {/* Tags */}
        {isShared && (
          <span style={{ fontSize: '8px', background: 'rgba(151,117,250,0.12)', color: 'var(--accent-purple)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', letterSpacing: '0.05em', flexShrink: 0 }}>SHARED</span>
        )}

        {/* Resources toggle */}
        <button
          title="Resources"
          onClick={() => setShowResources(!showResources)}
          aria-expanded={showResources}
          aria-label={`${subMaterials.length} resources for ${subtopic.name}`}
          style={{ background: 'transparent', border: 'none', color: subMaterials.length > 0 ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', flexShrink: 0 }}
        >
          <ExternalLink size={13} aria-hidden="true" />
          {subMaterials.length > 0 && <span style={{ fontWeight: '700' }}>{subMaterials.length}</span>}
        </button>
      </div>

      {/* Resource panel */}
      {showResources && (
        <div style={{ paddingLeft: '34px', paddingBottom: '12px' }}>
          {subMaterials.map(mat => (
            <div key={mat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '9px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '1px 5px', borderRadius: '3px', flexShrink: 0 }}>{mat.type}</span>
              <a href={mat.url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--accent-cyan)', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mat.title}
              </a>
              <button onClick={() => onRemoveMaterial(subtopic.id, mat.id)} aria-label={`Remove resource: ${mat.title}`} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, padding: '0' }}>
                <X size={12} aria-hidden="true" />
              </button>
            </div>
          ))}

          {!addingResource && (
            <button
              onClick={() => setAddingResource(true)}
              aria-label="Add new resource"
              style={{ marginTop: '8px', background: 'transparent', border: '1px dashed var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: '4px', padding: '5px 10px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={12} aria-hidden="true" /> Add Resource
            </button>
          )}

          {addingResource && (
            <AddResourceForm
              subtopicId={subtopic.id}
              onAdd={onAddMaterial}
              onClose={() => setAddingResource(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}

// --- Topic Accordion ---
function TopicAccordion({ topic, visibleSubtopics, progress, materials, onCycleStatus, onAddMaterial, onRemoveMaterial }) {
  const [open, setOpen] = useState(false)

  const totalSubs = visibleSubtopics.length
  const doneSubs = visibleSubtopics.filter(s => {
    const st = progress[s.id]
    return st === 'COMPLETED' || st === 'REVISED'
  }).length
  const pct = totalSubs ? Math.round((doneSubs / totalSubs) * 100) : 0

  return (
    <div className="bento-card" style={{ marginBottom: '12px', padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open) } }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', cursor: 'pointer', background: open ? 'var(--bg-card-hover)' : 'transparent', borderBottom: open ? '1px solid var(--border-subtle)' : 'none' }}
      >
        <div style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--text-secondary)' }}>
          <ChevronDown size={16} aria-hidden="true" />
        </div>
        <span className="label-caps" style={{ flexGrow: 1 }}>{topic.name}</span>
        
        {/* Inline mini progress */}
        <span style={{ fontSize: '11px', color: pct === 100 ? 'var(--accent-green)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{doneSubs}/{totalSubs}</span>
        <div className="progress-track" style={{ width: '64px', height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${topic.name} progress: ${pct}%`}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--accent-green)' : 'linear-gradient(to right, var(--accent-primary), var(--accent-cyan))', borderRadius: '2px', transition: 'width 0.3s' }}></div>
        </div>
      </div>

      {/* Subtopics */}
      {open && (
        <div style={{ padding: '4px 20px 8px' }}>
          {visibleSubtopics.map(sub => (
            <SubtopicRow
              key={sub.id}
              subtopic={sub}
              status={progress[sub.id] || 'UNSTARTED'}
              materials={materials[sub.id]}
              onCycleStatus={onCycleStatus}
              onAddMaterial={onAddMaterial}
              onRemoveMaterial={onRemoveMaterial}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// --- Main SyllabusExplorer ---
export default function SyllabusExplorer({ currentTrack, progress, setProgress, materials, setMaterials }) {
  const flat = useMemo(() => flattenSubtopics(SYLLABUS), [])
  const summaryCSE = useMemo(() => computeSummary(flat, progress, 'CSE'), [flat, progress])
  const summaryDSAI = useMemo(() => computeSummary(flat, progress, 'DSAI'), [flat, progress])

  function handleCycleStatus(subtopicId) {
    setProgress(subtopicId, nextStatus(progress[subtopicId] || 'UNSTARTED'))
  }

  function handleAddMaterial(subtopicId, material) {
    setMaterials(prev => ({ ...prev, [subtopicId]: [...(prev[subtopicId] || []), material] }))
  }

  function handleRemoveMaterial(subtopicId, materialId) {
    setMaterials(prev => ({ ...prev, [subtopicId]: (prev[subtopicId] || []).filter(m => m.id !== materialId) }))
  }

  const visibleSubjects = SYLLABUS.filter(subject =>
    currentTrack === 'DUAL' || subject.topics.some(t => t.subtopics.some(s => s.papers.includes(currentTrack)))
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Unified Syllabus</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          Click the status circle on any topic to cycle: Not Started → In Progress → Done → Revised. Click the link icon to add resources.
        </p>

        {/* Track progress summary */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {(currentTrack === 'DUAL' || currentTrack === 'CSE') && (
            <div className="bento-card" style={{ flex: 1, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="label-caps" style={{ color: 'var(--accent-cyan)' }}>CSE</span>
                <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{summaryCSE.percent}%</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={summaryCSE.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`CSE progress: ${summaryCSE.percent}%`}>
                <div className="progress-fill" style={{ width: `${summaryCSE.percent}%`, background: 'var(--accent-cyan)' }}></div>
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>{summaryCSE.completed + summaryCSE.revised} / {summaryCSE.total} done</div>
            </div>
          )}
          {(currentTrack === 'DUAL' || currentTrack === 'DSAI') && (
            <div className="bento-card" style={{ flex: 1, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="label-caps" style={{ color: 'var(--accent-purple)' }}>DSAI</span>
                <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{summaryDSAI.percent}%</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={summaryDSAI.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`DSAI progress: ${summaryDSAI.percent}%`}>
                <div className="progress-fill" style={{ width: `${summaryDSAI.percent}%`, background: 'var(--accent-purple)' }}></div>
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>{summaryDSAI.completed + summaryDSAI.revised} / {summaryDSAI.total} done</div>
            </div>
          )}
        </div>

        {/* Status legend */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: cfg.color }}>
                <Icon size={12} color={cfg.color} />
                <span>{cfg.label}</span>
              </div>
            )
          })}
        </div>

        {/* Syllabus PDF Downloads */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          {(currentTrack === 'DUAL' || currentTrack === 'CSE') && (
            <a
              href="https://github.com/garvitsingh006/Study-Tracker-for-GATE/raw/main/CSIT_2026_Syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(43, 216, 196, 0.1)', border: '1px solid rgba(43, 216, 196, 0.3)', color: 'var(--accent-cyan)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}
            >
              <Download size={14} aria-hidden="true" /> CSIT 2026 Syllabus
            </a>
          )}
          {(currentTrack === 'DUAL' || currentTrack === 'DSAI') && (
            <a
              href="https://github.com/garvitsingh006/Study-Tracker-for-GATE/raw/main/DSAI_2026_Syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(151, 117, 250, 0.1)', border: '1px solid rgba(151, 117, 250, 0.3)', color: 'var(--accent-purple)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}
            >
              <Download size={14} aria-hidden="true" /> DSAI 2026 Syllabus
            </a>
          )}
        </div>
      </div>

      {/* Subjects */}
      {visibleSubjects.map(subject => (
        <div key={subject.id} style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {subject.name}
            {subject.topics.some(t => t.subtopics.some(s => s.papers.includes('CSE') && s.papers.includes('DSAI'))) && (
              <span style={{ fontSize: '9px', background: 'rgba(151,117,250,0.1)', color: 'var(--accent-purple)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>HAS SHARED</span>
            )}
          </h2>

          {subject.topics.map(topic => {
            const visibleSubtopics = currentTrack === 'DUAL'
              ? topic.subtopics
              : topic.subtopics.filter(s => s.papers.includes(currentTrack))
            if (visibleSubtopics.length === 0) return null
            return (
              <TopicAccordion
                key={topic.id}
                topic={topic}
                visibleSubtopics={visibleSubtopics}
                progress={progress}
                materials={materials}
                onCycleStatus={handleCycleStatus}
                onAddMaterial={handleAddMaterial}
                onRemoveMaterial={handleRemoveMaterial}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
