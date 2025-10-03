const supabase = require('../config/supabase')

// Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// Create new task
exports.createTask = async (req, res) => {
  const { title, notes } = req.body
  const newTask = { user_id: req.user.id, title, notes }

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
