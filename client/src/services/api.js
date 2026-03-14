import axios from 'axios'

const api = axios.create({ 
  baseURL: 'https://campus-complaint-backend.onrender.com/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const complaintService = {
  create:       (formData) => api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll:       (params)   => api.get('/complaints', { params }),
  getById:      (id)       => api.get(`/complaints/${id}`),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
  delete:       (id)       => api.delete(`/complaints/${id}`),
  getStats:     ()         => api.get('/complaints/stats'),
}

export const authService = {
  getUsers: () => api.get('/auth/users'),
}

export default api