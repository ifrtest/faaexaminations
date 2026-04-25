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
    authApi.me()
      .then((d) => setUser(d.user))
      .catch(() => { localStorage.removeItem('faa_token'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { user, token } = await authApi.login({ email, password });
    localStorage.setItem('faa_token', token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (email, password, full_name) => {
    const { user, token } = await authApi.register({ email, password, full_name });
    localStorage.setItem('faa_token', token);
    setUser(user);
    return user;
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
