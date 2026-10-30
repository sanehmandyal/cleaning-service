import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
export const getToken = () => { try { return sessionStorage.getItem('adm_token'); } catch { return null; } };
export const setToken = (t) => { try { t ? sessionStorage.setItem('adm_token', t) : sessionStorage.removeItem('adm_token'); } catch { /* ignore */ } };
api.interceptors.request.use((c) => { const t = getToken(); if (t && c.url.startsWith('/admin')) c.headers.Authorization = `Bearer ${t}`; return c; });
api.interceptors.response.use((r) => r, (e) => { if (e.response?.status === 401 && location.pathname.startsWith('/admin') && !location.pathname.endsWith('/login')) { setToken(null); location.href = '/admin/login'; } return Promise.reject(e); });
// Always fetch fresh published content (server sends no-cache)
export const useFetch = null;
