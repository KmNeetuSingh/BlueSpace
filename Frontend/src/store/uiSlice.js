import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: (localStorage.getItem('theme') || 'dark'),
  language: (localStorage.getItem('lang') || 'en'),
  subItemDone: (() => {
    try { return JSON.parse(localStorage.getItem('subItemDone') || '{}') } catch { return {} }
  })(),
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    initTheme(state) {
      const saved = localStorage.getItem('theme')
      if (saved) state.theme = saved
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', state.theme)
    },
    setLanguage(state, action) {
      state.language = action.payload
      localStorage.setItem('lang', state.language)
    },
    toggleSubItem(state, action) {
      const { taskId, label } = action.payload
      if (!state.subItemDone[taskId]) state.subItemDone[taskId] = {}
      state.subItemDone[taskId][label] = !state.subItemDone[taskId][label]
      localStorage.setItem('subItemDone', JSON.stringify(state.subItemDone))
    },
  },
})

export const { initTheme, toggleTheme, setLanguage, toggleSubItem } = uiSlice.actions
export default uiSlice.reducer


