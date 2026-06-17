import SubtopicRow from './SubtopicRow'
import { nodeMatchesPaper } from '../utils/progress'

export default function TopicBlock({ topic, paperFilter, progress, materials, onStatusClick, onAddMaterial, onRemoveMaterial }) {
  const subtopics = topic.subtopics.filter((s) => nodeMatchesPaper(s.papers, paperFilter))
  if (subtopics.length === 0) return null

  return (
    <div className="topic-block">
      <div className="topic-title">{topic.name}</div>
      {subtopics.map((s) => (
        <SubtopicRow
          key={s.id}
          subtopic={s}
          status={progress[s.id] || 'UNSTARTED'}
          materials={materials[s.id] || []}
          onStatusClick={onStatusClick}
          onAddMaterial={onAddMaterial}
          onRemoveMaterial={onRemoveMaterial}
        />
      ))}
    </div>
  )
}
