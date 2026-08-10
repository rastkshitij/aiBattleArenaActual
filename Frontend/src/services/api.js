import axios from 'axios';

const API = axios.create({
  baseURL: '/',
  withCredentials: true,
});

export const authApi = {
  register: (payload) => API.post('/api/auth/register', payload),
  login: (payload) => API.post('/api/auth/login', payload),
  logout: () => API.post('/api/auth/logout'),
  me: () => API.get('/api/auth/me'),
};

export const chatApi = {
  getAll: () => API.get('/api/chats'),
  create: (payload) => API.post('/api/chats', payload),
  getById: (chatId) => API.get(`/api/chats/${chatId}`),
  delete: (chatId) => API.delete(`/api/chats/${chatId}`),
  addMessage: (chatId, payload) => API.post(`/api/chats/${chatId}/messages`, payload),
};

export const aiApi = {
  invoke: (payload) => API.post('/invoke', payload),
};

export default API;
