'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { api } from '@/lib/axios';
import { useAuth } from '@/context/auth-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ErrorResponse = {
  message?: string;
};

type LoginResponse = {
  access_token: string;
};

export function LoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      // 1. login
      const res = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      const token = res.data.access_token;

      // 2. get user
      const userRes = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 3. set session (SINGLE SOURCE OF TRUTH)
      setSession(token, userRes.data);
      document.cookie = `token=${token}; path=/;`;
console.log('here')
      // 4. redirect
      router.push('/customers');

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          (err.response?.data as ErrorResponse)?.message ??
            'Login failed'
        );
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button className="w-full h-11" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}