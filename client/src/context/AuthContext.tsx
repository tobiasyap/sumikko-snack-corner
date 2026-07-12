import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '../utils/api';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.get<{ user: User }>('/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    localStorage.setItem('token', token);
    setUser(user);
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.post<{ token: string; user: User }>('/auth/register', { email, password });
    localStorage.setItem('token', token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
