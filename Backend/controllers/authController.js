  const supabase = require("../config/supabase");
  exports.register = async (req, res) => {
    const { email, password, options } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const newEmail = email.trim();
    const full_name = options?.data?.full_name || '';
    const preferred_language = options?.data?.preferred_language || 'en';

    const { data, error } = await supabase.auth.signUp({
      email: newEmail,
      password,
      options: {
        data: {
          full_name,
          preferred_language,
        },
      },
    });

    if (error) {
      console.error("Supabase signUp error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: data.user,
      session: data.session,
    });
  };


  // Login user
  // const supabase = require('../config/supabase');

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1️⃣ Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // 2️⃣ Login via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      const userId = authData.user.id;

      // 3️⃣ Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('full_name, preferred_language')
        .eq('id', userId)
        .single(); // fetch one record

      if (profileError) {
        console.warn('Could not fetch user profile:', profileError.message);
      }

      // 4️⃣ Return combined response
      return res.json({
        message: 'Login successful',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: profile?.full_name || '',
          preferred_language: profile?.preferred_language || 'en',
        },
        access_token: authData.session?.access_token || null,
        refresh_token: authData.session?.refresh_token || null,
        expires_at: authData.session?.expires_at || null,
      });

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
