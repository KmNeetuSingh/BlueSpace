import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateTask, deleteTask } from '../store/tasksSlice'
import { toggleSubItem } from '../store/uiSlice'
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function TaskItem({ task }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const subItemDone = useSelector(s => s.ui.subItemDone[task.id] || {})
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [notes, setNotes] = useState(task.notes || '')

  function toggleComplete() {
    dispatch(updateTask({ id: task.id, changes: { is_completed: !task.is_completed } }))
  }
  function save() {
    dispatch(updateTask({ id: task.id, changes: { title, notes } }))
    setEditing(false)
  }

  return (
    <div className="card">
      <div className="space-between">
        {editing ? (
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
        ) : (
          <div className="title" style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>{task.title}</div>
        )}
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
              <input type="checkbox" checked={!!task.is_completed} onChange={toggleComplete} />
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


