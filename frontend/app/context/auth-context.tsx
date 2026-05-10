'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/axios';

type User = {
  id: number;
  email: string;
  role: string;
  organizationId: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', {
      email,
      password,
    });

    const accessToken = res.data.access_token;

    localStorage.setItem('token', accessToken);
    setToken(accessToken);

    // optionally fetch user profile here later
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}