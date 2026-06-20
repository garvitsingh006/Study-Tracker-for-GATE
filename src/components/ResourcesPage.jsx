import { useMemo, useState } from 'react'
import { Youtube, FileText, Link2, Search, X, BookOpen, StickyNote } from 'lucide-react'
import SYLLABUS from '../data/syllabus'
import { flattenSubtopics } from '../utils/progress'
import { openUrl } from '../utils/materials'

const TYPE_META = {
  YOUTUBE: { label: 'YouTube', icon: Youtube, color: '#FF4444' },
  DOCUMENT: { label: 'Document', icon: FileText, color: 'var(--accent-cyan)' },
  PYQ: { label: 'PYQ', icon: BookOpen, color: 'var(--accent-orange)' },
  OTHER: { label: 'Link', icon: Link2, color: 'var(--text-secondary)' },
}

function buildLabelMap() {
  const map = {}
  for (const subject of SYLLABUS) {
    map[`subject:${subject.id}`] = { label: subject.name, kind: 'Subject' }
    for (const topic of subject.topics) {
      map[`topic:${topic.id}`] = { label: topic.name, kind: 'Unit' }
    }
  }
  return map
}

export default function ResourcesPage({ materials, setMaterials }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [levelFilter, setLevelFilter] = useState('ALL')
  const flat = useMemo(() => flattenSubtopics(SYLLABUS), [])
  const labelMap = useMemo(() => buildLabelMap(), [])

  const allResources = useMemo(() => {
    const list = []
    for (const [key, items] of Object.entries(materials)) {
      if (!items?.length) continue
      for (const item of items) {
        let subtopicName = ''
        let papers = []
        let kind = 'Subtopic'

        if (key === 'general') {
          subtopicName = 'General Notes'
          papers = ['CSE', 'DSAI']
          kind = 'General'
        } else if (key.startsWith('subject:') || key.startsWith('topic:')) {
          const meta = labelMap[key]
          subtopicName = meta ? meta.label : key
          papers = ['CSE', 'DSAI']
          kind = meta ? meta.kind : 'Unit'
        } else {
          const subtopic = flat.find(s => s.id === key)
          if (!subtopic) continue
          subtopicName = subtopic.name
          papers = subtopic.papers
        }

        list.push({ ...item, materialKey: key, subtopicName, papers, kind })
      }
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [materials, flat, labelMap])

  const filtered = useMemo(() => allResources.filter(res => {
    const s = searchTerm.toLowerCase()
    const matchSearch = !s || res.title.toLowerCase().includes(s) || res.subtopicName.toLowerCase().includes(s)
    const matchType = typeFilter === 'ALL' || res.type === typeFilter
    const matchLevel = levelFilter === 'ALL' || res.kind === levelFilter
    return matchSearch && matchType && matchLevel
  }), [allResources, searchTerm, typeFilter, levelFilter])

  function handleRemove(materialKey, materialId) {
    if (!window.confirm('Remove this resource?')) return
    setMaterials(prev => ({ ...prev, [materialKey]: prev[materialKey].filter(m => m.id !== materialId) }))
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Saved Resources</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>All your bookmarks, notes, videos, and PYQs in one place. Add resources from the Syllabus tab — general, subject, unit, or subtopic level.</p>
      </div>

      {/* Controls */}
      <div className="resource-controls" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', flexGrow: 1, minWidth: '200px' }}>
          <Search size={15} color="var(--text-muted)" aria-hidden="true" />
          <label htmlFor="resource-search" className="sr-only">Search resources</label>
          <input
            id="resource-search"
            type="text"
            placeholder="Search resources or topics…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '13px' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} aria-label="Clear search" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>
        <label htmlFor="resource-type-filter" className="sr-only">Filter by type</label>
        <select
          id="resource-type-filter"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer' }}
        >
          <option value="ALL">All Types</option>
          <option value="YOUTUBE">YouTube</option>
          <option value="DOCUMENT">Documents</option>
          <option value="PYQ">PYQs</option>
          <option value="OTHER">Other Links</option>
        </select>
        <label htmlFor="resource-level-filter" className="sr-only">Filter by level</label>
        <select
          id="resource-level-filter"
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer' }}
        >
          <option value="ALL">All Levels</option>
          <option value="General">General</option>
          <option value="Subject">Subject</option>
          <option value="Unit">Unit</option>
          <option value="Subtopic">Subtopic</option>
        </select>
      </div>

      {/* Stats bar */}
      {allResources.length > 0 && (
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
          {Object.entries(TYPE_META).map(([key, meta]) => {
            const count = allResources.filter(r => r.type === key).length
            const Icon = meta.icon
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: count > 0 ? meta.color : 'var(--text-muted)' }}>
                <Icon size={13} />
                <span style={{ fontWeight: '600' }}>{count}</span> {meta.label}
              </div>
            )
          })}
          <div style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>
            {filtered.length} of {allResources.length} shown
          </div>
        </div>
      )}

      {/* Empty state */}
      {allResources.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
          <BookOpen size={48} color="var(--border-subtle)" style={{ display: 'block', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No resources yet.</h3>
          <p style={{ fontSize: '14px' }}>Go to the <strong>Syllabus</strong> tab, expand any topic, and click the link or note icon to save a resource.</p>
        </div>
      )}

      {/* Resources grid */}
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(res => {
            const meta = TYPE_META[res.type] || TYPE_META.OTHER
            const Icon = meta.icon
            const kindColors = {
              General: 'var(--accent-orange)',
              Subject: 'var(--accent-cyan)',
              Unit: 'var(--accent-purple)',
              Subtopic: 'var(--text-secondary)',
            }
            const kindColor = kindColors[res.kind] || 'var(--text-secondary)'

            return (
              <div
                key={res.id}
                className="bento-card"
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: meta.color, fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em' }}>
                      <Icon size={13} />
                      {meta.label.toUpperCase()}
                    </div>
                    <span style={{ fontSize: '8px', background: `${kindColor}15`, color: kindColor, padding: '2px 6px', borderRadius: '4px', fontWeight: '700', letterSpacing: '0.03em' }}>{res.kind.toUpperCase()}</span>
                  </div>
                  <button onClick={() => handleRemove(res.materialKey, res.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '0' }}>
                    <X size={14} />
                  </button>
                </div>

                <button
                  onClick={() => openUrl(res.url)}
                  style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', textDecoration: 'none', lineHeight: '1.4', display: 'block', background: 'transparent', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', width: '100%' }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-primary)'}
                >
                  {res.title}
                </button>

                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{res.subtopicName}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {res.papers.map(p => (
                      <span key={p} style={{ fontSize: '8px', background: p === 'CSE' ? 'rgba(43,216,196,0.1)' : 'rgba(151,117,250,0.1)', color: p === 'CSE' ? 'var(--accent-cyan)' : 'var(--accent-purple)', padding: '2px 5px', borderRadius: '3px', fontWeight: '700' }}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* No search results */}
      {allResources.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
          <p>No resources match your search.</p>
          <button onClick={() => { setSearchTerm(''); setTypeFilter('ALL'); setLevelFilter('ALL') }} style={{ marginTop: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer' }}>Clear filters</button>
        </div>
      )}
    </div>
  )
}
