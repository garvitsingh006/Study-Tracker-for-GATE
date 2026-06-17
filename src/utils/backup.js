export function exportData() {
  const data = {
    progress: JSON.parse(localStorage.getItem('gate-tracker:progress') || '{}'),
    materials: JSON.parse(localStorage.getItem('gate-tracker:materials') || '{}'),
    schedule: JSON.parse(localStorage.getItem('gate-tracker:schedule') || '{}'),
    profile: JSON.parse(localStorage.getItem('gate-tracker:profile') || '{"name":"","year":"2027"}'),
    theme: JSON.parse(localStorage.getItem('gate-tracker:theme') || '"light"'),
    filter: JSON.parse(localStorage.getItem('gate-tracker:filter') || '"DUAL"'),
    exportDate: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `gate-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importData(file, onSuccess, onError) {
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      // Basic validation
      if (!data.progress || !data.materials) {
        throw new Error("Invalid backup file format.")
      }
      
      if (data.progress) localStorage.setItem('gate-tracker:progress', JSON.stringify(data.progress))
      if (data.materials) localStorage.setItem('gate-tracker:materials', JSON.stringify(data.materials))
      if (data.schedule) localStorage.setItem('gate-tracker:schedule', JSON.stringify(data.schedule))
      if (data.profile) localStorage.setItem('gate-tracker:profile', JSON.stringify(data.profile))
      if (data.theme) localStorage.setItem('gate-tracker:theme', JSON.stringify(data.theme))
      if (data.filter) localStorage.setItem('gate-tracker:filter', JSON.stringify(data.filter))
      
      onSuccess()
    } catch (err) {
      onError(err.message)
    }
  }
  
  reader.readAsText(file)
}
