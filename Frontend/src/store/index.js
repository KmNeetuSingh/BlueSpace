import { configureStore } from '@reduxjs/toolkit'
import auth from './authSlice'
import tasks from './tasksSlice'
import ui from './uiSlice'
import ai from './aiSlice'

const store = configureStore({
  reducer: { auth, tasks, ui, ai },
})

export default store


