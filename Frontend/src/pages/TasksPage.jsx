import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, addTask } from '../store/tasksSlice'
import TaskItem from '../components/TaskItem'
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function TasksPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items, status, error } = useSelector(s => s.tasks)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => { dispatch(fetchTasks()) }, [dispatch])

  function onAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    // attachmentUrl is currently UI-only until backend supports it
    dispatch(addTask({ title: title.trim(), notes: notes.trim() }))
    setTitle(''); setNotes('')
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <form className="card" onSubmit={onAdd}>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <input className="input" placeholder={t('title')} value={title} onChange={e=>setTitle(e.target.value)} />
        </div>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <textarea className="textarea" placeholder={t('notes')} value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <button className="btn primary">{t('add_task')}</button>
        </div>
      </form>

      <div className="card">
        <input className="input" placeholder={t('search_by_title') || 'Search by title'} value={filter} onChange={e=>setFilter(e.target.value)} />
      </div>

      {status === 'loading' && <div className="subtitle">Loading…</div>}
      {error && <div className="subtitle" style={{ color: '#f87171' }}>{error}</div>}
      {status === 'succeeded' && items.length === 0 && <div className="subtitle">{t('empty')}</div>}
      <div style={{ display: 'grid', gap: 12 }}>
        {items
          .filter(task => task.title?.toLowerCase().includes(filter.trim().toLowerCase()))
          .map(task => <TaskItem key={task.id} task={task} />)}
      </div>
    </div>
  )
}


