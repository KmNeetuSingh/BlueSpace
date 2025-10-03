import { configureStore } from '@reduxjs/toolkit'
import auth from './authSlice'
import tasks from './tasksSlice'
import ui from './uiSlice'

const store = configureStore({
  reducer: { auth, tasks, ui },
})

export default store


