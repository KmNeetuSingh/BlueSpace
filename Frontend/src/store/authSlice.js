import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

const stored = JSON.parse(localStorage.getItem('auth') || 'null')

export const loginThunk = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed')
  }
})

export const registerThunk = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Registration failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored?.user || null,
    access_token: stored?.access_token || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.access_token = null
      localStorage.removeItem('auth')
      api.setToken(null)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => { state.status = 'loading'; state.error = null })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.access_token = action.payload.access_token
        localStorage.setItem('auth', JSON.stringify({ user: state.user, access_token: state.access_token }))
        api.setToken(state.access_token)
      })
      .addCase(loginThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
      .addCase(registerThunk.pending, state => { state.status = 'loading'; state.error = null })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.access_token = action.payload.session?.access_token || null
        localStorage.setItem('auth', JSON.stringify({ user: state.user, access_token: state.access_token }))
        api.setToken(state.access_token)
      })
      .addCase(registerThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  }
})

export const selectIsAuthenticated = state => Boolean(state.auth.access_token)
export const { logout } = authSlice.actions
export default authSlice.reducer


