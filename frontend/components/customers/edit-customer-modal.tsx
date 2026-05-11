'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/axios';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

type Props = {
  customer: Customer;
  trigger?: React.ReactNode;
};

export function EditCustomerModal({ customer, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? '',
  });

  const handleOpenChange = (state: boolean) => {
    setOpen(state);
    if (state) {
      setForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone ?? '',
      });
      setError(null);
    } else {
      setError(null);
      setLoading(false);
    }
  };

  const isValid =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Name and email are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.patch(`/customers/${customer.id}`, form);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline" size="sm">Edit</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              disabled={loading}
            />
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
              onClick={handleSubmit}
              disabled={loading || !isValid}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}