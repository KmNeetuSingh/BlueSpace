import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerThunk } from '../store/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function RegisterPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector(s => s.auth.status)
  const error = useSelector(s => s.auth.error)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState(localStorage.getItem('lang') || 'en')

  async function onSubmit(e) {
    e.preventDefault()
    const payload = { email, password, options: { data: { full_name: fullName, preferred_language: preferredLanguage } } }
    const res = await dispatch(registerThunk(payload))
    if (res.type.endsWith('fulfilled')) navigate('/')
  }

  return (
    <div className="card" style={{ maxWidth: 480, margin: '48px auto' }}>
      <h2 style={{ marginTop: 0 }}>{t('register')}</h2>
      <form className="column" onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <label className="subtitle">{t('full_name')}</label>
          <input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <label className="subtitle">{t('email')}</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <label className="subtitle">{t('password')}</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <label className="subtitle">{t('language')}</label>
          <select className="select" value={preferredLanguage} onChange={e=>setPreferredLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
        {error && <div className="subtitle" style={{ color: '#f87171' }}>{error}</div>}
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
          <Link className="btn ghost" to="/login">{t('login')}</Link>
          <button className="btn primary" disabled={status==='loading'}>{status==='loading' ? '...' : t('register')}</button>
        </div>
      </form>
    </div>
  )
}


