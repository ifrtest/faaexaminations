// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth as authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, if a token exists, try to fetch the user.
  useEffect(() => {
    fetch('/api/health').catch(() => {});
    const token = localStorage.getItem('faa_token');
    if (!token) { setLoading(false); return; }

    // If the backend is cold-starting (Render free tier), authApi.me() can hang
    // for 30-60s. We bail after 15s so the user sees login instead of spinning forever.
    // We keep the token so the next attempt re-validates it without asking them to retype.
    const timeout = setTimeout(() => setLoading(false), 15000);

    authApi.me()
      .then((d) => setUser(d.user))
      .catch(() => { localStorage.removeItem('faa_token'); setUser(null); })
      .finally(() => { clearTimeout(timeout); setLoading(false); });
  }, []);

  // Keep-alive ping every 10 minutes so Render doesn't go to sleep between visits.
  useEffect(() => {
    const id = setInterval(() => { fetch('/api/health').catch(() => {}); }, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const login = useCallback(async (email, password) => {
    const { user, token } = await authApi.login({ email, password });
    localStorage.setItem('faa_token', token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (email, password, full_name) => {
    const data = await authApi.register({ email, password, full_name });
    localStorage.setItem('faa_token', data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem('faa_token');
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((u) => (u ? { ...u, ...patch } : u));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
