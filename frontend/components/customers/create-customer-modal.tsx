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

export function CreateCustomerModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const queryClient = useQueryClient();

  const isValid =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!isValid) {
      setError('Name and email are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.post('/customers', form);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      setForm({ name: '', email: '', phone: '' });
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (state: boolean) => {
    setOpen(state);
    if (!state) {
      setError(null);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">+ New Customer</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm w-[92vw] p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base">Create Customer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Name</Label>
            <Input
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              disabled={loading}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Email</Label>
            <Input
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              disabled={loading}
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Phone</Label>
            <Input
              placeholder="+92..."
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              disabled={loading}
              className="h-8 text-sm"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 h-8"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="flex-1 h-8"
              disabled={loading || !isValid}
            >
              {loading ? '...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}