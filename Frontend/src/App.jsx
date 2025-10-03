import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initTheme, toggleTheme } from './store/uiSlice'
import { selectIsAuthenticated, logout } from './store/authSlice'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TasksPage from './pages/TasksPage'
import LandingPage from './pages/LandingPage'
import LanguageSwitcher from './components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

function App() {
  const dispatch = useDispatch()
  const isAuthed = useSelector(selectIsAuthenticated)
  const user = useSelector(state => state.auth.user)
  const theme = useSelector(state => state.ui.theme)
  const { t } = useTranslation()

  useEffect(() => { dispatch(initTheme()) }, [dispatch])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])

  return (
    <div className="container">
      <header className="space-between" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 16 }}>
          <Link to="/" className="title" style={{ textDecoration: 'none', color: 'inherit' }}>{t('brand_name')}</Link>
          <LanguageSwitcher />
          <button className="btn ghost" onClick={() => dispatch(toggleTheme())}>{theme === 'dark' ? '🌙' : '☀️'}</button>
        </div>
        <div className="row">
          {isAuthed ? (
            <>
              <span className="subtitle">{user?.user_metadata?.full_name || user?.email}</span>
              <button className="btn" onClick={() => dispatch(logout())}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link className="btn ghost" to="/login">{t('login')}</Link>
              <Link className="btn primary" to="/register">{t('register')}</Link>
            </>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={isAuthed ? <TasksPage /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  )
}

export default App
