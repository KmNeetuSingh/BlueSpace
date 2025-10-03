import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '../store/uiSlice'
import '../i18n'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.ui.language)

  function onChange(e) {
    const value = e.target.value
    dispatch(setLanguage(value))
    i18n.changeLanguage(value)
  }

  return (
    <select
      className="select"
      value={lang}
      onChange={onChange}
      aria-label="Select language"
      style={{ width: 'auto', paddingRight: 28 }}
    >
      <option value="en">English 🇬🇧</option>
      <option value="hi">हिंदी 🇮🇳</option>
    </select>
  )
}


