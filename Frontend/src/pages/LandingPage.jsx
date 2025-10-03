import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function LandingPage() {
  const { t } = useTranslation()
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', margin: '48px auto' }}>
      <div className="hero">
        <div className="hero-content">
          <div className="badge">{t('hero_badge')}</div>
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-subtitle">{t('hero_subtitle')}</p>
          <div className="cta-row">
            <Link className="btn primary" to="/register">{t('cta_get_started')}</Link>
            <Link className="btn ghost" to="/login">{t('cta_have_account')}</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <div className="video-grid">
            <video className="hero-video" autoPlay muted loop playsInline src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
          </div>
        </div>
      </div>
    </div>
  )
}


