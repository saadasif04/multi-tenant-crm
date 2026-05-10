'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="w-full border-b px-6 py-3 flex items-center justify-between bg-white">
      {/* LEFT */}
      <div className="font-semibold text-lg tracking-tight">
        CRM Dashboard
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* LOADING STATE */}
        {loading && (
          <div className="text-xs text-gray-400 animate-pulse">
            syncing session...
          </div>
        )}

        {/* LOGGED IN */}
        {user ? (
          <>
            <div className="text-sm text-gray-600 hidden sm:block">
              <span className="font-medium text-gray-900">
                {user.email}
              </span>{' '}
              • {user.role}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          /* LOGGED OUT */
          <Button
            size="sm"
            onClick={() => (window.location.href = '/')}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}