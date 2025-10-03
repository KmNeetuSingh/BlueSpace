const supabase = require('../config/supabase')

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token provided' })

  const token = authHeader.replace('Bearer ', '')
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  // Fetch user profile from user_profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (profileError) {
    return res.status(401).json({ error: 'User profile not found' })
  }

  req.user = profileData
  next()
}

module.exports = authMiddleware
