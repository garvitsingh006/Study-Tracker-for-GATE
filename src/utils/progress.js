export const STATUS = {
  UNSTARTED: 'UNSTARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REVISED: 'REVISED',
}

const STATUS_ORDER = [STATUS.UNSTARTED, STATUS.IN_PROGRESS, STATUS.COMPLETED, STATUS.REVISED]

export const STATUS_LABEL = {
  UNSTARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Done',
  REVISED: 'Revised',
}

export function nextStatus(current) {
  const idx = STATUS_ORDER.indexOf(current)
  return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length]
}

/** Flatten the nested syllabus into a single array of subtopics, for aggregation. */
export function flattenSubtopics(syllabus) {
  const out = []
  for (const subject of syllabus) {
    for (const topic of subject.topics) {
      for (const subtopic of topic.subtopics) {
        out.push(subtopic)
      }
    }
  }
  return out
}

export function isOverlapping(subtopic) {
  return subtopic.papers.length > 1
}

/**
 * Recompute the aggregate for one paper from the flat subtopic list and the
 * single progress map. There is nothing to "sync" — both CSE and DSAI read
 * from the same progress[subtopicId] entries, filtered by paper membership.
 * REVISED is treated as done (it implies prior completion), same as the
 * backend's percent_complete formula.
 */
export function computeSummary(flatSubtopics, progress, paperCode) {
  const relevant = flatSubtopics.filter((s) => s.papers.includes(paperCode))
  const total = relevant.length

  let completed = 0
  let revised = 0
  let inProgress = 0

  for (const s of relevant) {
    const status = progress[s.id] || STATUS.UNSTARTED
    if (status === STATUS.COMPLETED) completed += 1
    else if (status === STATUS.REVISED) revised += 1
    else if (status === STATUS.IN_PROGRESS) inProgress += 1
  }

  const done = completed + revised
  const percent = total ? Math.round((done / total) * 1000) / 10 : 0

  return { total, completed, revised, inProgress, percent }
}

export function nodeMatchesPaper(papers, filter) {
  if (filter === 'DUAL') return true
  return papers.includes(filter)
}
