import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.request.use((config) => {
  console.log('➡️ REQUEST:', config.method, config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log('⬅️ RESPONSE:', res.status, res.data);
    return res;
  },
  (err) => {
    console.error('❌ RESPONSE ERROR:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);