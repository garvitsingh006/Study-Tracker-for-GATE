import SubjectBlock from './SubjectBlock'

export default function SyllabusTree({ syllabus, paperFilter, progress, materials, onStatusClick, onAddMaterial, onRemoveMaterial }) {
  return (
    <div className="syllabus-tree">
      {syllabus.map((subject) => (
        <SubjectBlock
          key={subject.id}
          subject={subject}
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
