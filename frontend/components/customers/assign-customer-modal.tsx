'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
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

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
    enabled: isAdmin && open,
  });

  async function assignToSelf() {
    try {
      setLoading(true);
      await api.patch(`/customers/${customer.id}/assign/${user?.id}`);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    } catch {
      console.error('Failed to assign');
    } finally {
      setLoading(false);
    }
  }

  async function assignAsAdmin() {
    const userIdToAssign = selectedUserId ?? users?.[0]?.id;
    if (!userIdToAssign) return;

    try {
      setLoading(true);
      setError(null);
      await api.patch(`/customers/${customer.id}/assign/${userIdToAssign}`);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      setOpen(false);
      setSelectedUserId(null);
    } catch {
      setError('Failed to assign customer');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenChange = (state: boolean) => {
    setOpen(state);
    if (!state) {
      setError(null);
      setSelectedUserId(null);
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={loading}
        onClick={assignToSelf}
      >
        {loading ? 'Assigning...' : 'Assign to me'}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">Assign</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
        <DialogHeader>
          <DialogTitle>Assign Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Assign <span className="font-medium">{customer.name}</span> to a team member
          </p>

          <div className="space-y-2">
            <Label>Select User</Label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={selectedUserId ?? users?.[0]?.id ?? ''}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
            >
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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
              onClick={assignAsAdmin}
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