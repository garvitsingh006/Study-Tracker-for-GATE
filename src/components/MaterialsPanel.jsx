import { useState } from 'react'
import { Youtube, FileText, Link2, Plus, X } from 'lucide-react'
import { RESOURCE_TYPE, detectResourceType } from '../utils/materials'

const ICONS = {
  YOUTUBE: Youtube,
  DOCUMENT: FileText,
  OTHER: Link2,
}

function MaterialIcon({ type }) {
  const Icon = ICONS[type] || Link2
  return <Icon size={14} strokeWidth={2} />
}

export default function MaterialsPanel({ materials, onAdd, onRemove }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState(RESOURCE_TYPE.OTHER)
  const [typeTouched, setTypeTouched] = useState(false)

  function handleUrlChange(e) {
    const next = e.target.value
    setUrl(next)
    if (!typeTouched) setType(detectResourceType(next))
  }

  function handleTypeChange(e) {
    setTypeTouched(true)
    setType(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return
    onAdd({ title, url, type })
    setTitle('')
    setUrl('')
    setType(RESOURCE_TYPE.OTHER)
    setTypeTouched(false)
  }

  return (
    <div className="materials-panel">
      {materials.length === 0 && (
        <p className="materials-empty">No materials attached yet.</p>
      )}

      {materials.map((m) => (
        <div className="material-item" key={m.id}>
          <MaterialIcon type={m.type} />
          <a href={m.url} target="_blank" rel="noreferrer">
            {m.title}
          </a>
          <button
            type="button"
            className="material-remove"
            onClick={() => onRemove(m.id)}
            title="Remove material"
          >
            <X size={13} />
          </button>
        </div>
      ))}

      <form className="material-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="title"
          placeholder="Title (e.g. Bayes Theorem Crash Course)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="url"
          placeholder="https://youtube.com/playlist?list=..."
          value={url}
          onChange={handleUrlChange}
        />
        <select value={type} onChange={handleTypeChange}>
          <option value={RESOURCE_TYPE.YOUTUBE}>YouTube</option>
          <option value={RESOURCE_TYPE.DOCUMENT}>Document</option>
          <option value={RESOURCE_TYPE.OTHER}>Other</option>
        </select>
        <button type="submit" className="add-btn">
          <Plus size={13} /> Add
        </button>
      </form>
    </div>
  )
}
