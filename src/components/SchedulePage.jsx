import { useState } from 'react'
import { Plus, X, Calendar } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_COLORS = ['var(--accent-primary)', 'var(--accent-cyan)', 'var(--accent-purple)', 'var(--accent-orange)', 'var(--accent-green)', '#f472b6', '#fb923c']

const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

export default function SchedulePage() {
  const [schedule, setSchedule] = useLocalStorage('gate-tracker:schedule', {})
  const [newTask, setNewTask] = useState('')
  const [selectedDay, setSelectedDay] = useState(today in schedule || DAYS.includes(today) ? today : 'Monday')

  function handleAddTask(e) {
    e.preventDefault()
    if (!newTask.trim()) return
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), { id: Date.now().toString(), text: newTask.trim() }]
    }))
    setNewTask('')
  }

  function handleRemoveTask(day, taskId) {
    setSchedule(prev => ({ ...prev, [day]: prev[day].filter(t => t.id !== taskId) }))
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Weekly Schedule</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Plan your study sessions for the week. Today is <strong style={{ color: 'var(--accent-primary)' }}>{today}</strong>.</p>
      </div>

      {/* Add task */}
      <div className="bento-card" style={{ marginBottom: '40px' }}>
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
            style={{ background: 'var(--bg-card-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input
            type="text"
            placeholder="e.g. Linear Algebra – 2 hrs, COA practice, Algo PYQs…"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            style={{ flexGrow: 1, background: 'var(--bg-card-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', outline: 'none' }}
          />
          <button
            type="submit"
            style={{ background: 'var(--accent-primary)', border: 'none', color: 'white', padding: '10px 18px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            <Plus size={15} /> Add
          </button>
        </form>
      </div>

      {/* Weekly grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {DAYS.map((day, i) => {
          const tasks = schedule[day] || []
          const isToday = day === today
          const color = DAY_COLORS[i]

          return (
            <div
              key={day}
              className="bento-card"
              style={{ padding: 0, overflow: 'hidden', border: isToday ? `1px solid ${color}` : '1px solid var(--border-subtle)', boxShadow: isToday ? `0 0 12px ${color}22` : 'none' }}
            >
              {/* Day header */}
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', background: isToday ? `${color}10` : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={13} color={isToday ? color : 'var(--text-muted)'} />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: isToday ? color : 'var(--text-secondary)', letterSpacing: '0.05em' }}>{day.toUpperCase()}</span>
                </div>
                {isToday && <span style={{ fontSize: '9px', background: `${color}20`, color, padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>TODAY</span>}
                {tasks.length > 0 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tasks.length}</span>}
              </div>

              {/* Tasks */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '80px' }}>
                {tasks.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', padding: '8px 0' }}>No sessions planned</div>
                ) : (
                  tasks.map(task => (
                    <div
                      key={task.id}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-base)', borderRadius: '4px', padding: '8px 10px', gap: '8px' }}
                    >
                      <span style={{ fontSize: '12px', lineHeight: '1.4', color: 'var(--text-primary)', flexGrow: 1 }}>{task.text}</span>
                      <button
                        onClick={() => handleRemoveTask(day, task.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, padding: '0', display: 'flex' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
