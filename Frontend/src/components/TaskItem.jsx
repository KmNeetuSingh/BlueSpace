import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateTask, deleteTask } from '../store/tasksSlice'
import { toggleSubItem } from '../store/uiSlice'  
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function TaskItem({ task }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  // Get subItemDone for this task
  const allSubItems = useSelector(state => state.ui.subItemDone)
  const subItemDone = useMemo(() => {
    return allSubItems[task.id] || {}
  }, [allSubItems, task.id])
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [notes, setNotes] = useState(task.notes || '')

  // Auto-complete task when all subitems are checked
  useEffect(() => {
    if (task.notes) {
      const labels = task.notes.split(',').map(l => l.trim()).filter(l => l)
      const allChecked = labels.length > 0 && labels.every(label => subItemDone[label])
      if (allChecked && !task.completed) {
        dispatch(updateTask({ id: task.id, changes: { completed: true } }))
      }
    }
  }, [subItemDone, task.notes, task.completed, task.id, dispatch])

  function toggleComplete() {
    dispatch(updateTask({ id: task.id, changes: { completed: !task.completed } }))
  }
  function save() {
    dispatch(updateTask({ id: task.id, changes: { title, notes } }))
    setEditing(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
    return date.toLocaleDateString()
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`} style={{ 
      borderLeft: `4px solid ${getPriorityColor(task.priority)}`
    }}>
      <div className="space-between">
        <div style={{ flex: 1 }}>
          {editing ? (
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          ) : (
            <div className="title" style={{ 
              textDecoration: task.completed ? 'line-through' : 'none',
              marginBottom: '4px'
            }}>
              {task.title}
            </div>
          )}
          
          {/* Priority and Due Date */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
            {task.priority && (
              <span className={`priority-indicator priority-${task.priority}`}>
                {getPriorityIcon(task.priority)} {task.priority.toUpperCase()}
              </span>
            )}
            {task.due_date && (
              <span className="date-badge">
                📅 {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
        
        <div className="row">
          {editing ? (
            <>
              <button className="btn" onClick={save}>{t('save')}</button>
              <button className="btn ghost" onClick={()=>setEditing(false)}>{t('cancel')}</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={()=>setEditing(true)}>{t('edit')}</button>
              <button className="btn" onClick={()=>dispatch(deleteTask(task.id))}>{t('delete')}</button>
            </>
          )}
        </div>
      </div>
      {editing ? (
        <textarea className="textarea" value={notes} onChange={e=>setNotes(e.target.value)} />
      ) : (
        (
          task.notes ? (
            <div className="row" style={{ gap: 12, marginTop: 8, alignItems: 'flex-start' }}>
              <div style={{ display: 'grid', gap: 6 }}>
                {task.notes.split(',').map(raw => {
                  const label = raw.trim()
                  if (!label) return null
                  const checked = !!subItemDone[label]
                  return (
                    <label key={label} className="row" style={{ gap: 8 }}>
                      <input type="checkbox" checked={checked} onChange={() => dispatch(toggleSubItem({ taskId: task.id, label }))} />
                      <span className="subtitle" style={{ textDecoration: checked ? 'line-through' : 'none' }}>{label}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
              <input type="checkbox" checked={!!task.completed} onChange={toggleComplete} />
              <div className="subtitle">{t('notes')}</div>
            </div>
          )
        )
      )}
      {!editing && task.attachment_url && (
        <div style={{ marginTop: 8 }}>
          <a className="subtitle" href={task.attachment_url} target="_blank" rel="noreferrer">Attachment</a>
        </div>
      )}
    </div>
  )
}


