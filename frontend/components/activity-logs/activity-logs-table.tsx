'use client';

import { useState } from 'react';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { useAuth } from '@/context/auth-context';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type ActivityLog = {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  createdAt: string;
  performedBy: {
    id: number;
    name: string;
    email: string;
  };
};

const ACTION_STYLES: Record<string, string> = {
  CREATED:  'bg-green-100 text-green-800',
  UPDATED:  'bg-blue-100 text-blue-800',
  DELETED:  'bg-red-100 text-red-800',
  RESTORED: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-indigo-100 text-indigo-800',  // add this
};

const ENTITY_STYLES: Record<string, string> = {
  CUSTOMER: 'bg-purple-100 text-purple-800',
  NOTE:     'bg-orange-100 text-orange-800',
  USER:     'bg-gray-100 text-gray-800',
};

export function ActivityLogsTable() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [cursor, setCursor] = useState<number | undefined>();
  const { data, isLoading, isError } = useActivityLogs(cursor);
  const logs = (data as ActivityLog[]) ?? [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-2">
        <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500 p-4">
        Failed to load activity logs.
      </p>
    );
  }

  if (!logs.length) {
    return (
      <p className="text-sm text-muted-foreground p-4">
        No activity logs yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              {isAdmin && <TableHead>Performed By</TableHead>}
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/50 transition">

                <TableCell>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${ACTION_STYLES[log.action] ?? 'bg-gray-100 text-gray-800'}`}>
                    {log.action}
                  </span>
                </TableCell>

                <TableCell>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${ENTITY_STYLES[log.entityType] ?? 'bg-gray-100 text-gray-800'}`}>
                    {log.entityType}
                  </span>
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  #{log.entityId}
                </TableCell>

                {isAdmin && (
                  <TableCell className="text-sm">
                    {log.performedBy?.name}
                  </TableCell>
                )}

                <TableCell className="text-sm text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500">
          Showing {logs.length} results
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={logs.length < 10}
            onClick={() => {
              const last = logs[logs.length - 1];
              if (last) setCursor(last.id);
            }}
          >
            Next
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCursor(undefined)}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}