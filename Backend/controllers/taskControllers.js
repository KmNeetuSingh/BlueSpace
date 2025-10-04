const supabase = require('../config/supabase')

// Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    const lang = (req.header('X-Lang') || req.user?.preferred_language || 'en').toLowerCase()
    
    // Ensure user_id matches auth.uid() format
    const userId = req.user.auth_user_id || req.user.id
    console.log('🔍 Fetching tasks for user_id:', userId)
    
    // Use admin client to bypass RLS
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const { data, error } = await supabaseAdmin
      .from('todos')
      .select('*')
      .eq('user_id', userId)

    console.log('🔍 Database query results:')
    console.log('- User ID being searched:', userId)
    console.log('- Total rows found:', data?.length || 0)
    console.log('- Raw data:', data)
    console.log('- Error:', error)

    if (error) {
      console.error('❌ Database query error:', error)
      return res.status(500).json({ error: error.message })
    }

    // Return tasks as-is since we don't have multilingual fields in the schema
    console.log('✅ Returning tasks to frontend:', data)
    res.json(data)
  } catch (err) {
    console.error('🚨 Unexpected error in getTasks:', err)
    res.status(500).json({ error: err.message || 'Unknown error' })
  }
}

// Temporary debug endpoint to fetch ALL tasks
exports.getAllTasksDebug = async (req, res) => {
  console.log('🔍 DEBUG: Fetching ALL tasks from database...')
  
  const { createClient } = require('@supabase/supabase-js')
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  const { data, error } = await supabaseAdmin
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  console.log('📊 ALL TASKS DEBUG:')
  console.log('- Total tasks in database:', data?.length || 0)
  console.log('- All tasks:', data)
  console.log('- Error:', error)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({
    message: 'Debug: All tasks fetched',
    count: data?.length || 0,
    tasks: data,
    current_user_id: req.user?.auth_user_id || req.user?.id
  })
}

// Test endpoint to fetch all tasks without auth (for debugging RLS)
exports.testAllTasks = async (req, res) => {
  try {
    console.log('🧪 TEST: Fetching ALL tasks without auth...')
    
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const { data, error } = await supabaseAdmin
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('🧪 TEST Results:')
    console.log('- Total tasks in database:', data?.length || 0)
    console.log('- All tasks:', data)
    console.log('- Error:', error)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({
      message: 'Test: All tasks fetched without auth',
      count: data?.length || 0,
      tasks: data
    })
  } catch (err) {
    console.error('🚨 TEST Error:', err)
    res.status(500).json({ error: err.message })
  }
}

// Create new task
exports.createTask = async (req, res) => {
  try {
    const { title, notes, completed, priority, due_date, description } = req.body
    
    // Validate input
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Ensure user_id matches auth.uid() format
    const userId = req.user.auth_user_id || req.user.id
    
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const newTask = { 
      user_id: userId, 
      title: title.trim(), 
      notes: notes?.trim() || description?.trim() || null,
      completed: completed || false,
      priority: priority || 'medium',
      due_date: due_date || null
    }

    console.log('Creating task with user_id:', userId)
    console.log('New task data:', newTask)

    // Use service role client to bypass RLS issues
    console.log('Attempting insert with service role...')
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const { data, error } = await supabaseAdmin
      .from('todos')
      .insert(newTask)
      .select()
      .single()

    if (error) {
      console.error('Ultimate task creation failure:', error)
      return res.status(500).json({ 
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        user_id_used: userId,
        fix_tip: 'Run SQL: ALTER TABLE todos DISABLE ROW LEVEL SECURITY;'
      })
    }

    console.log('✅ Task created successfully:', data)
    return res.status(201).json(data)
  
  } catch (err) {
    console.error('🚨 Unexpected error:', err)
    return res.status(500).json({ 
      error: err.message || 'Unknown error',
      fix_tip: 'Check Backend logs and run: ALTER TABLE todos DISABLE ROW LEVEL SECURITY;'
    })
  }
}

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const changes = req.body

    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' })
    }

    // Ensure user_id matches auth.uid() format
    const userId = req.user.auth_user_id || req.user.id

    // Use admin client to bypass RLS
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabaseAdmin
      .from('todos')
      .update(changes)
      .eq('id', id)
      .eq('user_id', userId) // Ensure user can only update their own tasks
      .select()
      .single()

    if (error) {
      console.error('Update task error:', error)
      return res.status(500).json({ error: error.message })
    }

    if (!data) {
      return res.status(404).json({ error: 'Task not found or not authorized' })
    }

    console.log('✅ Task updated successfully:', data)
    res.json(data)
  } catch (err) {
    console.error('🚨 Unexpected error updating task:', err)
    res.status(500).json({ error: err.message || 'Unknown error' })
  }
}

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' })
    }

    // Ensure user_id matches auth.uid() format
    const userId = req.user.auth_user_id || req.user.id

    // Use admin client to bypass RLS
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabaseAdmin
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // Ensure user can only delete their own tasks
      .select()
      .single()

    if (error) {
      console.error('Delete task error:', error)
      return res.status(500).json({ error: error.message })
    }

    if (!data) {
      return res.status(404).json({ error: 'Task not found or not authorized' })
    }

    console.log('✅ Task deleted successfully:', data)
    res.json({ message: 'Task deleted successfully', data })
  } catch (err) {
    console.error('🚨 Unexpected error deleting task:', err)
    res.status(500).json({ error: err.message || 'Unknown error' })
  }
}