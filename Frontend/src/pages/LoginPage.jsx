import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../store/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function LoginPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector(s => s.auth.status)
  const error = useSelector(s => s.auth.error)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    const res = await dispatch(loginThunk({ email, password }))
    if (res.type.endsWith('fulfilled')) navigate('/')
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '48px auto' }}>
      <h2 style={{ marginTop: 0 }}>{t('login')}</h2>
      <form className="column" onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <label className="subtitle">{t('email')}</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <label className="subtitle">{t('password')}</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <div className="subtitle" style={{ color: '#f87171' }}>{error}</div>}
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
          <Link className="btn ghost" to="/register">{t('register')}</Link>
          <button className="btn primary" disabled={status==='loading'}>{status==='loading' ? '...' : t('login')}</button>
        </div>
      </form>
    </div>
  )
}


