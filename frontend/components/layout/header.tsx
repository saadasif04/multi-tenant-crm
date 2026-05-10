'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full border-b px-6 py-3 flex items-center justify-between bg-white">
      <div className="font-semibold text-lg">CRM Dashboard</div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-gray-600">
            {user.email} • {user.role}
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}