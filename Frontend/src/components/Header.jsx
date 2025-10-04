import React, { useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../store/uiSlice'
import { selectIsAuthenticated, logout } from '../store/authSlice'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import './Header.css'

const Header = React.memo(() => {
  const dispatch = useDispatch()
  const isAuthed = useSelector(selectIsAuthenticated)
  const user = useSelector(state => state.auth.user)
  const theme = useSelector(state => state.ui.theme)
  const { t } = useTranslation()
  const location = useLocation()

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme())
  }, [dispatch])

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return (
    <header className="space-between">
      <div className="row">
        <Link to="/" className="title" style={{ textDecoration: 'none', color: 'inherit' }}>
          {t('brand_name')}
        </Link>
        <LanguageSwitcher />
        <button
          className="btn ghost"
          onClick={handleToggleTheme}
          aria-label={theme === 'dark' ? t('switch_to_light_mode') : t('switch_to_dark_mode')}
          title={theme === 'dark' ? t('switch_to_light_mode') : t('switch_to_dark_mode')}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
      <div className="row">
        {isAuthed ? (
          <>
            <span className="subtitle" aria-label={user?.user_metadata?.full_name || user?.email}>
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <button className="btn" onClick={handleLogout} aria-label={t('logout')}>
              {t('logout')}
            </button>
          </>
        ) : (
          <>
            <Link className="btn ghost" to="/login">
              {t('login')}
            </Link>
            <Link className="btn primary" to="/register">
              {t('register')}
            </Link>
          </>
        )}
      </div>
    </header>
  )
})

export default Header
