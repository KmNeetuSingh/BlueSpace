import axios from 'axios'

const api = axios.create({
baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000'
})
api.interceptors.request.use(config => {
  try {
    const lang = localStorage.getItem('lang') || 'en'
    config.headers['X-Lang'] = lang
  } catch {
    console.log("error")
  }
  return config
})

api.setToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// initialize from localStorage
try {
  const stored = JSON.parse(localStorage.getItem('auth') || 'null')
  if (stored?.access_token) api.setToken(stored.access_token)
} catch {console.log}

// AI Suggestions API
export const aiSuggestionsAPI = {
  // Get all AI suggestions for current user
  getSuggestions: () => api.get('/ai'),
  
  // Create new AI suggestion
  createSuggestion: (data) => api.post('/ai', data),
  
  // Delete AI suggestion
  deleteSuggestion: (id) => api.delete(`/ai/${id}`)
}

export default api


