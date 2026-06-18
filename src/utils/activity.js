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

export function computeHeatmapData(activity, days = 90) {
  const dayCounts = {}
  for (const entries of Object.values(activity)) {
    for (const e of entries) {
      const day = e.at.slice(0, 10)
      dayCounts[day] = (dayCounts[day] || 0) + 1
    }
  }

  const result = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    result.push({ date: key, count: dayCounts[key] || 0 })
  }
  return result
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

export function computeVelocity(activity, flat, weeks = 4) {
  const cutoff = Date.now() - weeks * 7 * 86400000
  const weeklyCounts = new Array(weeks).fill(0)

  for (const entries of Object.values(activity)) {
    for (const e of entries) {
      if (e.to !== STATUS.COMPLETED && e.to !== STATUS.REVISED) continue
      const ts = new Date(e.at).getTime()
      if (ts < cutoff) continue
      const weekIdx = Math.floor((Date.now() - ts) / (7 * 86400000))
      if (weekIdx < weeks) weeklyCounts[weeks - 1 - weekIdx]++
    }
  }

  const avg = weeklyCounts.reduce((a, b) => a + b, 0) / weeks
  const remaining = flat.filter(s => {
    const st = s._status
    return st !== STATUS.COMPLETED && st !== STATUS.REVISED
  }).length

  const estimatedWeeks = avg > 0 ? remaining / avg : Infinity

  return { weeklyCounts, avgVelocity: avg, remaining, estimatedWeeks }
}
