import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAISuggestions, createAISuggestion, deleteAISuggestion, toggleCheckbox, clearErrors } from '../store/aiSlice'
import { addTask } from '../store/tasksSlice'
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function AIFloatingWidget() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { suggestions, creating, error, createError, checkedItems } = useSelector(s => s.ai)

  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [responseLength, setResponseLength] = useState('short')
  const [expandedId, setExpandedId] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(document.documentElement.getAttribute('data-theme') === 'dark')

  useEffect(() => {
    if (open) dispatch(fetchAISuggestions())
  }, [open, dispatch])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.getAttribute('data-theme') === 'dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (error || createError) {
      const timer = setTimeout(() => dispatch(clearErrors()), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, createError, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    let enhancedPrompt = prompt.trim()
    if (responseLength === 'short') enhancedPrompt += "\nKeep it short (1-3 points)."
    if (responseLength === 'medium') enhancedPrompt += "\nKeep it medium (3-5 points)."
    if (responseLength === 'long') enhancedPrompt += "\nDetailed points allowed."
    const result = await dispatch(createAISuggestion({ prompt: enhancedPrompt, title: title || undefined }))
    if (createAISuggestion.fulfilled.match(result)) {
      setPrompt(''); setTitle(''); setResponseLength('short')
    }
  }

  const toggleItem = (id, index) => dispatch(toggleCheckbox({ suggestionId: id, itemIndex: index }))
  const isChecked = (id, index) => checkedItems[id]?.[index] || false
  const toggleExpanded = id => setExpandedId(expandedId === id ? null : id)

  const parseItems = text => text.split('\n').filter(l => l.trim()).map(line => ({ text: line.replace(/^[-*0-9.\[\]]+\s*/, ''), original: line }))

  const addAsTask = async (suggestion) => {
    const items = parseItems(suggestion.suggestion)
    const selected = items.filter((_, i) => isChecked(suggestion.id, i)).map(i => i.text).join('\n')
    const allChecked = items.length > 0 && items.every((_, i) => isChecked(suggestion.id, i))
    const taskData = { title: suggestion.title || 'AI Task', notes: selected || suggestion.suggestion, completed: allChecked, reason: 'AI Generated' }
    const result = await dispatch(addTask(taskData))
    if (addTask.fulfilled.match(result)) {
      alert('AI suggestion added as task!')
      setOpen(false)
      // Refresh tasks to update completed category
      dispatch(fetchTasks())
    }
  }

  // New function to check if all checkboxes are checked for a suggestion
  const areAllChecked = (suggestion) => {
    const items = parseItems(suggestion.suggestion)
    return items.length > 0 && items.every((_, i) => isChecked(suggestion.id, i))
  }

  return (
    <>
      {/* Floating logo button */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <button
          onClick={() => setOpen(!open)}
          style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 24 }}
        >
          🤖
        </button>
      </div>

      {/* AI popup */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          right: 24,
          width: 'min(360px, 90vw)',
          maxHeight: '80vh',
          backgroundColor: isDarkTheme ? 'var(--panel)' : '#fff',
          border: '1px solid var(--border)',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          padding: 16,
          overflowY: 'auto',
          zIndex: 1000,
          color: 'var(--text)'
        }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <input placeholder={t('ai_title')} value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', marginBottom: 8 }}/>
            <textarea placeholder="Enter prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} style={{ width: '100%', marginBottom: 8 }} />
            <select value={responseLength} onChange={e => setResponseLength(e.target.value)} style={{ marginBottom: 8, width: '100%' }}>
              <option value="short">{t('short_points')}</option>
              <option value="medium">{t('medium_points')}</option>
              <option value="long">{t('long_points')}</option>
            </select>
            <button type="submit" className="btn primary" disabled={creating} style={{ width: '100%', marginBottom: 8 }}>{creating ? t('generating') : t('generate_suggestion')}</button>
          </form>

          {/* AI Suggestions */}
          {suggestions.map(s => {
            const items = parseItems(s.suggestion)
            return (
              <div key={s.id} style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{s.title || t('ai_suggestion')}</strong>
                  <button className="btn ghost" onClick={() => dispatch(deleteAISuggestion(s.id))}>{t('delete')}</button>
                </div>
                <div style={{ marginTop: 8 }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <input type="checkbox" checked={isChecked(s.id, i)} onChange={() => toggleItem(s.id, i)} style={{ marginRight: 8 }}/>
                      <span style={{ textDecoration: isChecked(s.id, i) ? 'line-through' : 'none' }}>{item.text}</span>
                    </div>
                  ))}
                  {s.suggestion.length > 200 && (
                    <button onClick={() => toggleExpanded(s.id)} style={{ fontSize: 12 }}>{expandedId === s.id ? t('show_less') : t('show_more')}</button>
                  )}
                </div>
                <button 
                  onClick={() => addAsTask(s)} 
                  className="btn primary" 
                  style={{ width: '100%', marginTop: 8 }}
                  disabled={!areAllChecked(s)}
                >
                  {t('add_as_task')}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
