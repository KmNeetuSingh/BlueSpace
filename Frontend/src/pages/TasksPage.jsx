import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, addTask } from '../store/tasksSlice'
import TaskItem from '../components/TaskItem'
import AISuggestionsEnhanced from '../components/AISuggestionsEnhanced'
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function TasksPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { items, status, error } = useSelector(s => s.tasks)
  const user = useSelector(s => s.auth.user)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('')
  const [activeCategory, setActiveCategory] = useState('inbox')
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    console.log('TasksPage state changed:', { items: items?.length, status, error: error || 'none' })
  }, [items, status, error])

  useEffect(() => { dispatch(fetchTasks()) }, [dispatch])

  async function onAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    
    try {
      const taskData = {
        title: title.trim(),
        notes: description.trim(),
        priority,
        due_date: dueDate || null,
        completed: false
      }
      
      const result = await dispatch(addTask(taskData))
      if (addTask.fulfilled.match(result)) {
        setTitle('')
        setDescription('')
        setPriority('medium')
        setDueDate('')
        setShowTaskForm(false)
        console.log('Task added successfully:', result.payload)
      } else {
        console.error('Failed to add task:', result.payload)
      }
    } catch (error) {
      console.error('Task creation error:', error)
    }
  }

  const filteredTasks = items.filter(task => {
    const matchesFilter = task.title?.toLowerCase().includes(filter.trim().toLowerCase())
    switch (activeCategory) {
      case 'inbox':
        return matchesFilter && !task.completed
      case 'today':
        const today = new Date().toISOString().split('T')[0]
        return matchesFilter && task.due_date?.startsWith(today)
      case 'upcoming':
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return matchesFilter && task.due_date && new Date(task.due_date) > tomorrow
      case 'completed':
        return matchesFilter && task.completed
      default:
        return matchesFilter
    }
  })

  const categories = [
    { id: 'inbox', label: t('inbox'), icon: '📥' },
    { id: 'today', label: t('today'), icon: '📅' },
    { id: 'upcoming', label: t('upcoming'), icon: '⏰' },
    { id: 'completed', label: t('completed'), icon: '✅' }
  ]

  return (
    <div className="tasks-page-container">
      {/* Sidebar */}
      <div className="task-sidebar">
        {/* User Profile */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div className="user-avatar">{user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</div>
            <span className="subtitle">{user?.full_name || user?.email || 'User'}</span>
          </div>
        </div>

        {/* Add Task Button */}
        <button 
          className="btn primary" 
          style={{ width: '100%', marginBottom: '30px' }}
          onClick={() => setShowTaskForm(!showTaskForm)}
        >
          ➕ {t('add_task')}
        </button>

      {/* Categories + AI Assistant */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`nav-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{category.icon}</span>
              {category.label}
            </span>
            <span className="nav-item-count">
              {category.id === 'inbox' && items.filter(t => !t.completed).length}
              {category.id === 'today' && items.filter(t => t.due_date?.startsWith(new Date().toISOString().split('T')[0])).length}
              {category.id === 'upcoming' && items.filter(t => t.due_date && new Date(t.due_date) > new Date(new Date().setDate(new Date().getDate() + 1))).length}
              {category.id === 'completed' && items.filter(t => t.completed).length}
            </span>
          </button>
        ))}
      </div>
    </div>

    {/* Floating AI Assistant outside sidebar */}
    <AISuggestionsEnhanced />

    {/* Main Content */}
      <div className="task-main-content" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            {categories.find(c => c.id === activeCategory)?.label || 'Tasks'}
          </h1>
          {/* <div className="subtitle" style={{ marginTop: '4px' }}>
            {filteredTasks.length} tasks
          </div> */}
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <form onSubmit={onAdd}>
              <div style={{ marginBottom: '16px' }}>
                <input className="input" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} style={{ fontSize: '16px', padding: '12px' }}/>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <textarea className="textarea" placeholder={t('notes')} value={description} onChange={e => setDescription(e.target.value)} rows={3}/>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <select className="select" value={priority} onChange={e => setPriority(e.target.value)} style={{ minWidth: '120px' }}>
                  <option value="low">🟢 {t('low_priority')}</option>
                  <option value="medium">🟡 {t('medium_priority')}</option>
                  <option value="high">🔴 {t('high_priority')}</option>
                </select>
                <input type="date" className="input" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ minWidth: '140px' }}/>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn ghost" onClick={() => setShowTaskForm(false)}>{t('cancel')}</button>
                <button type="submit" className="btn primary">{t('add_task')}</button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <input className="search-input" placeholder={t('search_tasks')} value={filter} onChange={e => setFilter(e.target.value)}/>
        </div>

        {/* Tasks List */}
        {status === 'loading' && <div className="sublabel">Loading…</div>}
        {error && <div className="subtitle error">Error: {error}</div>}
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <div className="subtitle muted">
                {activeCategory === 'inbox' && t('no_tasks_inbox')}
                {activeCategory === 'today' && t('no_tasks_today')}
                {activeCategory === 'upcoming' && t('no_tasks_upcoming')}
                {activeCategory === 'completed' && t('no_tasks_completed')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
