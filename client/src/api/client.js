// client/src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('faa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 globally, clear the token so the app kicks back to /login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/')) {
      localStorage.removeItem('faa_token');
      // Only redirect when we're in the browser & not already on /login.
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// --------- convenience wrappers -------------------------------------
export const auth = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login:    (data) => api.post('/auth/login', data).then((r) => r.data),
  logout:   () => api.post('/auth/logout').then((r) => r.data),
  me:       () => api.get('/auth/me').then((r) => r.data),
  forgot:   (email) => api.post('/auth/password/forgot', { email }).then((r) => r.data),
  reset:    (token, password) => api.post('/auth/password/reset', { token, password }).then((r) => r.data),
};

export const quizzes = {
  exams:       () => api.get('/quizzes/exams').then((r) => r.data),
  topics:      (code) => api.get(`/quizzes/exams/${code}/topics`).then((r) => r.data),
  start:       (payload) => api.post('/quizzes/start', payload).then((r) => r.data),
  mySessions:  () => api.get('/quizzes/sessions').then((r) => r.data),
  session:     (id) => api.get(`/quizzes/sessions/${id}`).then((r) => r.data),
  answer:      (id, payload) => api.post(`/quizzes/sessions/${id}/answer`, payload).then((r) => r.data),
  submit:      (id) => api.post(`/quizzes/sessions/${id}/submit`).then((r) => r.data),
  abandon:     (id) => api.post(`/quizzes/sessions/${id}/abandon`).then((r) => r.data),
};

export const results = {
  dashboard:  () => api.get('/results/dashboard').then((r) => r.data),
  mine:       () => api.get('/results').then((r) => r.data),
  one:        (id) => api.get(`/results/${id}`).then((r) => r.data),
};

export const questions = {
  list:    (params) => api.get('/questions', { params }).then((r) => r.data),
  get:     (id) => api.get(`/questions/${id}`).then((r) => r.data),
  create:  (data) => api.post('/questions', data).then((r) => r.data),
  update:  (id, data) => api.put(`/questions/${id}`, data).then((r) => r.data),
  remove:  (id) => api.delete(`/questions/${id}`).then((r) => r.data),
  upload:  (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/questions/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
};

export const users = {
  list:       (params) => api.get('/users', { params }).then((r) => r.data),
  get:        (id) => api.get(`/users/${id}`).then((r) => r.data),
  update:     (id, data) => api.put(`/users/${id}`, data).then((r) => r.data),
  updateMe:   (data) => api.put('/users/me', data).then((r) => r.data),
  adminStats: () => api.get('/users/admin/stats').then((r) => r.data),
};

export default api;
