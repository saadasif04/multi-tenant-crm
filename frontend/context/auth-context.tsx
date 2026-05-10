'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AxiosError } from 'axios';
import { api } from '@/lib/axios';

type User = {
  id: number;
  email: string;
  role: string;
  organizationId: number;
};

type LoginResponse = {
  access_token: string;
};

type ErrorResponse = {
  message?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;

  setSession: (token: string, user: User) => void;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // INIT AUTH
  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem('token');

        if (!stored) {
          setLoading(false);
          return;
        }

        setToken(stored);

        const res = await api.get<User>('/auth/me', {
          headers: {
            Authorization: `Bearer ${stored}`,
          },
        });

        setUser(res.data);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  // 🔑 LOGIN
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      const accessToken = res.data.access_token;

      localStorage.setItem('token', accessToken);
      setToken(accessToken);

      const userRes = await api.get<User>('/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(userRes.data);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;

      throw new Error(
        err.response?.data?.message ?? 'Login failed'
      );
    }
  };

  // 🚀 NEW: SESSION SETTER (USED BY SIGNUP)
  const setSession = (accessToken: string, user: User) => {
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    setUser(user);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/';
     document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}