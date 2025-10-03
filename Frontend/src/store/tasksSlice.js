import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const fetchTasks = createAsyncThunk('tasks/fetch', async (_, { rejectWithValue }) => {
  try { const res = await api.get('/tasks'); return res.data } catch (e) { return rejectWithValue(e.response?.data?.error || 'Fetch failed') }
})
export const addTask = createAsyncThunk('tasks/add', async (payload, { rejectWithValue }) => {
  try { const res = await api.post('/tasks', payload); return res.data } catch (e) { return rejectWithValue(e.response?.data?.error || 'Create failed') }
})
export const updateTask = createAsyncThunk('tasks/update', async ({ id, changes }, { rejectWithValue }) => {
  try { const res = await api.put(`/tasks/${id}`, changes); return res.data } catch (e) { return rejectWithValue(e.response?.data?.error || 'Update failed') }
})
export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/tasks/${id}`); return id } catch (e) { return rejectWithValue(e.response?.data?.error || 'Delete failed') }
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, s => { s.status = 'loading'; s.error = null })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload })
      .addCase(fetchTasks.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload })
      .addCase(addTask.fulfilled, (s, a) => { s.items.unshift(a.payload) })
      .addCase(updateTask.pending, (s, a) => {
        const { id, changes } = a.meta.arg || {}
        const index = s.items.findIndex(t => t.id === id)
        if (index >= 0) {
          s.items[index] = { ...s.items[index], ...changes }
        }
      })
      .addCase(updateTask.fulfilled, (s, a) => { const i = s.items.findIndex(t => t.id === a.payload.id); if (i>=0) s.items[i] = a.payload })
      .addCase(deleteTask.fulfilled, (s, a) => { s.items = s.items.filter(t => t.id !== a.payload) })
  }
})

export default tasksSlice.reducer


