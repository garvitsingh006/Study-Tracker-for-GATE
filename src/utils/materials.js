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
