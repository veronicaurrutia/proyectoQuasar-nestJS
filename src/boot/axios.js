import { boot } from 'quasar/wrappers';
import axios from 'axios';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL_API || 'http://localhost:3000',
});

// Attach JWT from localStorage (tries several common keys)
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      // Redirect to login (simple approach)
      try {
        window.location.href = '/login';
      } catch (e) {}
    }
    return Promise.reject(error);
  },
);

async function register() {
  try {
    const body = {
      email: 'vero@test.com',
      nombre: 'Vero',
      apellido: 'Urrutia',
      password: 'secret123',
    };
    const res = await api.post('/auth/register', body);
    console.log('register res', res.data);
    // guardar token
    localStorage.setItem('token', res.data.access_token);
  } catch (err) {
    console.error('register error', err.response?.data || err.message);
  }
}
async function login() {
  try {
    const body = { email: 'vero@test.com', password: 'secret123' };
    const res = await api.post('/auth/login', body);
    console.log('login res', res.data);
    localStorage.setItem('token', res.data.access_token);
  } catch (err) {
    console.error('login error', err.response?.data || err.message);
  }
}
async function getUsers() {
  try {
    const res = await api.get('/users');
    console.log('users', res.data);
  } catch (err) {
    console.error(
      'users error',
      err.response?.status,
      err.response?.data || err.message,
    );
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = api;
});

export { api };
