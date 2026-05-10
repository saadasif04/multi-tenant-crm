'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { useAuth } from '@/context/auth-context';

export function AuthCard() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace('/customers');
    }
  }, [user, router]);

  return (
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-md rounded-2xl">
      <CardHeader className="text-center space-y-3">
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome back' : 'Create your workspace'}
        </CardTitle>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => setMode('login')}
            className={`px-3 py-1 rounded-md text-sm ${
              mode === 'login' ? 'bg-black text-white' : 'text-gray-500'
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode('signup')}
            className={`px-3 py-1 rounded-md text-sm ${
              mode === 'signup' ? 'bg-black text-white' : 'text-gray-500'
            }`}
          >
            Sign up
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {mode === 'login' ? <LoginForm /> : <SignupForm />}
      </CardContent>
    </Card>
  );
}