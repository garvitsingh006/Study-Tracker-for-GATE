import { STATUS } from './progress'

/**
 * Activity history helpers for tracking status changes with timestamps.
 * This data powers streaks, readiness scoring, velocity tracking, and more.
 */

export function logStatusChange(activity, subtopicId, fromStatus, toStatus) {
  const entry = {
    from: fromStatus || STATUS.UNSTARTED,
    to: toStatus,
    at: new Date().toISOString(),
  }
  const existing = activity[subtopicId] || []
  return { ...activity, [subtopicId]: [...existing, entry] }
}

export function computeStreak(activity) {
  const daySet = new Set()
  for (const entries of Object.values(activity)) {
    for (const e of entries) {
      const day = e.at.slice(0, 10)
      daySet.add(day)
    }
  }
  if (daySet.size === 0) return 0

  const sorted = [...daySet].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  let current = new Date(sorted[0])
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i])
    const diff = (current - prev) / 86400000
    if (diff === 1) {
      streak++
      current = prev
    } else {
      break
    }
  }
  return streak
}

export function getLastActivityTimestamp(activity) {
  let latest = null
  for (const entries of Object.values(activity)) {
    for (const e of entries) {
      if (!latest || e.at > latest) latest = e.at
    }
  }
  return latest
}
