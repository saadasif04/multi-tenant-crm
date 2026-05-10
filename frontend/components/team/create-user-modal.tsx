'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { api } from '@/lib/axios';

export function CreateUserModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
  });

  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      await api.post('/users', form);

      queryClient.invalidateQueries({
        queryKey: ['users'],
      });

      setForm({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
      });

      setOpen(false);
    } catch {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.password.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create User</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Team Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Name</Label>

            <Input
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-1">
            <Label>Email</Label>

            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  email: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>

            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  password: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-1">
            <Label>Role</Label>

            <select
              className="w-full border rounded-md p-2 text-sm"
              value={form.role}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  role: e.target.value,
                }))
              }
            >
              <option value="MEMBER">
                MEMBER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              disabled={!isValid || loading}
              onClick={handleSubmit}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}