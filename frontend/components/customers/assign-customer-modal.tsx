'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/axios';
import { useAuth } from '@/context/auth-context';

type Customer = {
  id: number;
  name: string;
  assignedToId?: number | null;
};

type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  customer: Customer;
};

export function AssignCustomerModal({ customer }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === 'ADMIN';

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // fetch users only when needed
  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
    enabled: isAdmin && open,
  });

  // 🔥 DEFAULT: use assigned user OR fallback to first user
  const defaultUserId =
    isAdmin
      ? customer.assignedToId ?? users?.[0]?.id ?? null
      : user?.id ?? null;

  const effectiveUserId =
    selectedUserId ?? defaultUserId;

  const assign = async () => {
    try {
      setLoading(true);
      setError(null);

      const userIdToAssign = isAdmin
        ? effectiveUserId
        : user?.id;

      if (!userIdToAssign) {
        throw new Error('No user selected');
      }

      await api.patch(
        `/customers/${customer.id}/assign/${userIdToAssign}`
      );

      queryClient.invalidateQueries({
        queryKey: ['customers'],
      });

      setOpen(false);
      setSelectedUserId(null);
    } catch {
      setError('Failed to assign customer');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (state: boolean) => {
    setOpen(state);

    if (!state) {
      setError(null);
      setSelectedUserId(null);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Assign
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
        <DialogHeader>
          <DialogTitle>Assign Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Assign{' '}
            <span className="font-medium">{customer.name}</span>
          </p>

          {/* ADMIN MODE */}
          {isAdmin ? (
            <div className="space-y-2">
              <Label>Select User</Label>

              <select
                className="w-full border rounded-md p-2 text-sm"
                value={effectiveUserId ?? ''}
                onChange={(e) =>
                  setSelectedUserId(Number(e.target.value))
                }
              >
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This customer will be assigned to you
            </p>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* ACTIONS */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              onClick={assign}
              disabled={loading}
            >
              {loading ? 'Assigning...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}