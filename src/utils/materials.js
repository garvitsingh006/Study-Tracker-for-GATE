export const RESOURCE_TYPE = {
  YOUTUBE: 'YOUTUBE',
  DOCUMENT: 'DOCUMENT',
  OTHER: 'OTHER',
}

/** Best-effort auto-detection so the user usually doesn't have to pick a type manually. */
export function detectResourceType(url) {
  const lower = url.toLowerCase()
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return RESOURCE_TYPE.YOUTUBE
  if (
    lower.includes('drive.google.com') ||
    lower.includes('docs.google.com') ||
    lower.endsWith('.pdf')
  ) {
    return RESOURCE_TYPE.DOCUMENT
  }
  return RESOURCE_TYPE.OTHER
}

export function isLocalPath(url) {
  return /^[a-zA-Z]:\\/.test(url) || /^\//.test(url)
}

export function toFileUrl(url) {
  if (url.startsWith('file://')) return url
  if (/^[a-zA-Z]:\\/.test(url)) return 'file:///' + url.replace(/\\/g, '/')
  if (/^\//.test(url)) return 'file://' + url
  return url
}

export function openUrl(url) {
  if (isLocalPath(url)) {
    window.open(toFileUrl(url), '_blank', 'noopener,noreferrer')
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

function randomId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID()
  return `mat_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function makeMaterial({ title, url, type }) {
  return {
    id: randomId(),
    title: title.trim(),
    url: url.trim(),
    type,
    createdAt: new Date().toISOString(),
  }
}
