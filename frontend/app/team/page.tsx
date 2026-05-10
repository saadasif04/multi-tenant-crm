'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/axios';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { CreateUserModal } from '@/components/team/create-user-modal';

import {
  Users,
  ShieldCheck,
  Mail,
} from 'lucide-react';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function TeamPage() {
  const { data, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
  });

  const totalUsers = data?.length ?? 0;

  const admins =
    data?.filter((u) => u.role === 'ADMIN')
      .length ?? 0;

  const members =
    data?.filter((u) => u.role === 'MEMBER')
      .length ?? 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading team...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-gradient-to-br from-background to-muted/40 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-primary/10 p-2">
              <Users className="size-5 text-primary" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Team Management
            </h1>
          </div>

          <p className="max-w-xl text-sm text-muted-foreground">
            Manage your organization members,
            roles, and access levels.
          </p>
        </div>

        <CreateUserModal />
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Total Users
              </p>

              <h2 className="text-3xl font-bold">
                {totalUsers}
              </h2>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <Users className="size-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Admins
              </p>

              <h2 className="text-3xl font-bold">
                {admins}
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3">
              <ShieldCheck className="size-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Members
              </p>

              <h2 className="text-3xl font-bold">
                {members}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-500/10 p-3">
              <Users className="size-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* USERS */}
      <div className="rounded-3xl border bg-background shadow-sm overflow-hidden">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">
            Organization Members
          </h2>

          <p className="text-sm text-muted-foreground">
            All users currently part of your
            organization
          </p>
        </div>

        <div className="divide-y">
          {data?.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-4 px-6 py-5 transition hover:bg-muted/40 md:flex-row md:items-center md:justify-between"
            >
              {/* LEFT */}
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                  {user.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {user.name}
                    </h3>

                    <Badge
                      variant={
                        user.role === 'ADMIN'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-4" />

                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  ID #{user.id}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}