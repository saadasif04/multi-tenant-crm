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

type SignupResponse = {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: string;
    organizationId: number;
  };
};

export function SignupForm() {
  const router = useRouter();
  const { setSession } = useAuth(); // 👈 IMPORTANT

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const res = await api.post<SignupResponse>(
        '/auth/signup',
        form
      );

      const { access_token, user } = res.data;

      // ✅ correct session setup
      setSession(access_token, user);
      document.cookie = `token=${access_token}; path=/;`;

      // ✅ redirect immediately
      router.push('/customers');

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          (err.response?.data as ErrorResponse)?.message ??
            'Signup failed'
        );
      } else {
        setError('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Full name"
        value={form.name}
        onChange={(e) =>
          setForm((p) => ({ ...p, name: e.target.value }))
        }
      />

      <Input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm((p) => ({ ...p, email: e.target.value }))
        }
      />

      <Input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm((p) => ({ ...p, password: e.target.value }))
        }
      />

      <Input
        placeholder="Organization name"
        value={form.organizationName}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            organizationName: e.target.value,
          }))
        }
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button className="w-full h-11" disabled={loading}>
        {loading ? 'Creating...' : 'Create Workspace'}
      </Button>
    </form>
  );
}