'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            {/* NAV LINKS */}
            <div className="flex items-center gap-2">
              <Link href="/customers">
                <Button variant="ghost" size="sm">
                  Customers
                </Button>
              </Link>

              {/* 👇 TEAM BUTTON (ONLY WHEN LOGGED IN) */}
              <Link href="/team">
                <Button variant="ghost" size="sm">
                  Team
                </Button>
              </Link>
            </div>

            <div className="text-sm text-gray-600 hidden sm:block ml-2">
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