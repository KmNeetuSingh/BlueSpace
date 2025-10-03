import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: { translation: {
    app_title: 'To-Do',
    brand_name: 'BlueSpace',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    full_name: 'Full name',
    language: 'Language',
    add_task: 'Add task',
    title: 'Title',
    notes: 'Notes',
    empty: 'No tasks yet',
    generating: 'Generating…',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    mark_done: 'Mark done',
    mark_undone: 'Mark undone',
    suggestions: 'AI Suggestions',
    attachment_url: 'Attachment URL (optional)',
    search_by_title: 'Search by title',
    hero_badge: 'AI-powered',
    hero_title: 'Focus on what matters. Let your to‑do list think with you.',
    hero_subtitle: 'BlueSpace helps you capture tasks, prioritize effortlessly, and get smart suggestions — all in a clean, fast interface.',
    cta_get_started: 'Get started — it’s free',
    cta_have_account: 'I already have an account',
  }},
  hi: { translation: {
    app_title: 'कार्य-सूची',
    brand_name: 'ब्लूस्पेस',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    full_name: 'पूरा नाम',
    language: 'भाषा',
    add_task: 'कार्य जोड़ें',
    title: 'शीर्षक',
    notes: 'नोट्स',
    empty: 'अभी कोई कार्य नहीं',
    generating: 'बना रहे हैं…',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    mark_done: 'पूर्ण करें',
    mark_undone: 'अपूर्ण करें',
    suggestions: 'एआई सुझाव',
    attachment_url: 'संलग्न लिंक (वैकल्पिक)',
    search_by_title: 'शीर्षक से खोजें',
    hero_badge: 'एआई‑संचालित',
    hero_title: 'महत्त्वपूर्ण काम पर ध्यान दें। आपकी टू‑डू सूची आपके साथ सोचे।',
    hero_subtitle: 'ब्लूस्पेस आपको कार्य कैप्चर करने, आसानी से प्राथमिकता तय करने और स्मार्ट सुझाव पाने में मदद करता है — सब कुछ एक तेज़ और साफ इंटरफ़ेस में।',
    cta_get_started: 'शुरू करें — मुफ़्त है',
    cta_have_account: 'मेरा पहले से खाता है',
  }}
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: localStorage.getItem('lang') || 'en',
    interpolation: { escapeValue: false },
  })

export default i18n


