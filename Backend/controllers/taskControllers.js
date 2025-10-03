const supabase = require('../config/supabase')

// Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  const lang = (req.header('X-Lang') || req.user?.preferred_language || 'en').toLowerCase()
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  // Prefer multilingual fields if present
  const localized = data.map(t => ({
    ...t,
    title: (lang === 'hi' ? (t.title_hi || t.title) : (t.title_en || t.title)),
    notes: (lang === 'hi' ? (t.notes_hi || t.notes) : (t.notes_en || t.notes)),
  }))

  res.json(localized)
}

// Create new task
exports.createTask = async (req, res) => {
  const { title, notes, title_en, title_hi, notes_en, notes_hi } = req.body
  const newTask = { user_id: req.user.id, title, notes, title_en, title_hi, notes_en, notes_hi }

  const { data, error } = await supabase
    .from('todos')
    .insert(newTask)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
}

// Update task
exports.updateTask = async (req, res) => {
  const { id } = req.params
  const changes = req.body

  const { data, error } = await supabase
    .from('todos')
    .update(changes)
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// Delete task
exports.deleteTask = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
}
