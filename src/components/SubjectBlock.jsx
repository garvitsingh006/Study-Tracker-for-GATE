import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import TopicBlock from './TopicBlock'
import { nodeMatchesPaper } from '../utils/progress'

function subjectPapers(subject) {
  const set = new Set()
  for (const topic of subject.topics) {
    for (const s of topic.subtopics) {
      s.papers.forEach((p) => set.add(p))
    }
  }
  return [...set]
}

export default function SubjectBlock({ subject, paperFilter, progress, materials, onStatusClick, onAddMaterial, onRemoveMaterial }) {
  const [expanded, setExpanded] = useState(true)

  const visibleTopics = subject.topics.filter((t) =>
    t.subtopics.some((s) => nodeMatchesPaper(s.papers, paperFilter))
  )
  if (visibleTopics.length === 0) return null

  const papers = subjectPapers(subject)

  return (
    <div className="subject-block">
      <div className="subject-header" onClick={() => setExpanded((v) => !v)}>
        <div className="subject-title">
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          {subject.name}
        </div>
        <div className="subject-papers">
          {papers.map((p) => (
            <span key={p} className={`paper-chip ${p}`}>
              {p}
            </span>
          ))}
        </div>
      </div>

      {expanded &&
        visibleTopics.map((t) => (
          <TopicBlock
            key={t.id}
            topic={t}
            paperFilter={paperFilter}
            progress={progress}
            materials={materials}
            onStatusClick={onStatusClick}
            onAddMaterial={onAddMaterial}
            onRemoveMaterial={onRemoveMaterial}
          />
        ))}
    </div>
  )
}
