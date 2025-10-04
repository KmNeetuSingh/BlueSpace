import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function LandingPage() {
  const { t } = useTranslation()
  return (
    <div className="card" style={{ padding: '20px', overflow: 'hidden', margin: '40px auto' }}>
      <div className="hero">
        <div className="hero-content">
          <div className="badge">AI-Powered To-Do App</div>
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-subtitle">{t('hero_subtitle')}</p>
          <div className="cta-row">
            <Link className="btn primary" to="/register">{t('cta_get_started')}</Link>
            <Link className="btn ghost" to="/login">{t('cta_have_account')}</Link>
          </div>
          <div className="landing-features" style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <div className="feature-box" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--panel)', color: 'var(--text)' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Smart Task Sorting</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>AI organizes your tasks smartly based on priority and category.</p>
            </div>
            <div className="feature-box" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--panel)', color: 'var(--text)' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Daily Insights</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>Track your daily progress and productivity effortlessly.</p>
            </div>
            <div className="feature-box" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'var(--panel)', color: 'var(--text)' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Private & Secure</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>Your data stays with you — safe and confidential.</p>
            </div>
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <div className="video-grid">
            <video className="hero-video" autoPlay muted loop playsInline src="/Todo.mp4" />
          </div>
        </div>
      </div>
    </div>
  )
}
