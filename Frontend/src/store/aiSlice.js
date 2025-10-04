import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { aiSuggestionsAPI } from '../utils/api'

// Async thunks for AI suggestions
export const fetchAISuggestions = createAsyncThunk(
  'ai/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await aiSuggestionsAPI.getSuggestions()
      return res.data
    } catch (err) {
      console.error('Fetch AI suggestions error:', err.response?.data || err.message)
      return rejectWithValue(err.response?.data?.error || err.message || 'Failed to fetch AI suggestions')
    }
  }
)

export const createAISuggestion = createAsyncThunk(
  'ai/createSuggestion',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await aiSuggestionsAPI.createSuggestion(payload)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create AI suggestion')
    }
  }
)

export const deleteAISuggestion = createAsyncThunk(
  'ai/deleteSuggestion',
  async (id, { rejectWithValue }) => {
    try {
      await aiSuggestionsAPI.deleteSuggestion(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete AI suggestion')
    }
  }
)

const initialState = {
  suggestions: [],
  status: 'idle', // 'idle' | 'loading' | 'failed' | 'succeeded'
  creating: false,
  error: null,
  createError: null,
  checkedItems: (() => {
    try { 
      return JSON.parse(localStorage.getItem('aiCheckedItems') || '{}') 
    } catch { 
      return {} 
    }
  })(), // Track checked items by suggestion ID and item index
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null
      state.createError = null
    },
    toggleCheckbox: (state, action) => {
      const { suggestionId, itemIndex } = action.payload
      if (!state.checkedItems[suggestionId]) {
        state.checkedItems[suggestionId] = {}
      }
      state.checkedItems[suggestionId][itemIndex] = !state.checkedItems[suggestionId][itemIndex]
      
      // Save to localStorage
      localStorage.setItem('aiCheckedItems', JSON.stringify(state.checkedItems))
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch suggestions
      .addCase(fetchAISuggestions.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAISuggestions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.suggestions = action.payload.data || []
      })
      .addCase(fetchAISuggestions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      
      // Create suggestion
      .addCase(createAISuggestion.pending, (state) => {
        state.creating = true
        state.createError = null
      })
      .addCase(createAISuggestion.fulfilled, (state, action) => {
        state.creating = false
        state.suggestions.unshift(action.payload.data)
      })
      .addCase(createAISuggestion.rejected, (state, action) => {
        state.creating = false
        state.createError = action.payload
      })
      
      // Delete suggestion
      .addCase(deleteAISuggestion.fulfilled, (state, action) => {
        state.suggestions = state.suggestions.filter(s => s.id !== action.payload)
      })
  },
})

export const { clearErrors, toggleCheckbox } = aiSlice.actions
export default aiSlice.reducer
