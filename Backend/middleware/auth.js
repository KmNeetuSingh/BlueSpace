const supabase = require('../config/supabase')

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token provided' })

  const token = authHeader.replace('Bearer ', '')
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  // Fetch user profile from user_profiles table using service role to bypass RLS
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
  
  const { data: profileData, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  // If profile doesn't exist, use the user data from auth
  if (profileError) {
    req.user = {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name || data.user.email,
      auth_user_id: data.user.id // Store original auth user ID
    }
  } else {
    req.user = {
      ...profileData,
      auth_user_id: data.user.id // Ensure we have the auth user ID
    }
  }

  console.log('🔐 Auth middleware - User authenticated:')
  console.log('- Auth User ID:', data.user.id)
  console.log('- Final req.user:', req.user)
  next()
}

module.exports = authMiddleware
