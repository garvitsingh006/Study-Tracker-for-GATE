import { useState } from 'react'
import { ChevronDown, ChevronRight, Paperclip } from 'lucide-react'
import StatusPill from './StatusPill'
import MaterialsPanel from './MaterialsPanel'
import { isOverlapping } from '../utils/progress'

export default function SubtopicRow({ subtopic, status, materials, onStatusClick, onAddMaterial, onRemoveMaterial }) {
  const [open, setOpen] = useState(false)
  const overlap = isOverlapping(subtopic)
  const count = materials.length

  return (
    <div className="subtopic-wrap">
      <div className="subtopic-row">
        <StatusPill status={status} onClick={() => onStatusClick(subtopic.id)} />
        <span className="subtopic-name">{subtopic.name}</span>
        {overlap && <span className="overlap-badge">CSE + DSAI</span>}
        <button
          type="button"
          className="materials-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          <Paperclip size={12} />
          {count > 0 ? count : ''}
        </button>
      </div>

      {open && (
        <MaterialsPanel
          materials={materials}
          onAdd={(material) => onAddMaterial(subtopic.id, material)}
          onRemove={(materialId) => onRemoveMaterial(subtopic.id, materialId)}
        />
      )}
    </div>
  )
}
