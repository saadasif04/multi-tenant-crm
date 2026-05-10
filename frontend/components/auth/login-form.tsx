'use client';

import { useState } from 'react';

import { AxiosError } from 'axios';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/auth-context';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

type ErrorResponse = {
  message?: string;
};

export function LoginForm() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await login(email, password);

      router.push('/customers');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message =
          (error.response?.data as ErrorResponse)
            ?.message || 'Login failed';

        setError(message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}