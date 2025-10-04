import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initTheme } from './store/uiSlice'
import { selectIsAuthenticated } from './store/authSlice'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TasksPage from './pages/TasksPage'
import LandingPage from './pages/LandingPage'
import Header from './components/Header'

function App() {
  const dispatch = useDispatch()
  const isAuthed = useSelector(selectIsAuthenticated)
  const theme = useSelector(state => state.ui.theme)
  const location = useLocation()

  useEffect(() => {
    dispatch(initTheme())
  }, [dispatch])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className={location.pathname === '/' ? '' : 'container'}>
      <Header />
      <Routes>
        <Route path="/" element={isAuthed ? <TasksPage /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  )
}

export default App
