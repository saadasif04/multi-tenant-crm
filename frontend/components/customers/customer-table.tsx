'use client';

import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditCustomerModal } from './edit-customer-modal';
import { AssignCustomerModal } from './assign-customer-modal';
import { CustomerDetailsModal } from './customer-details-modal';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/axios';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  assignedToId?: number | null;
  deletedAt?: string | null;
  assignedTo?: {
    id: number;
    name: string;
  } | null;
};

type Props = {
  data: Customer[];
  loading?: boolean;
  onRefresh: () => void;
  onShowDeletedReset?: () => void;
};

export function CustomerTable({
  data,
  loading = false,
  onRefresh,
  onShowDeletedReset,
}: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  async function handleDelete(id: number) {
    setLoadingId(id);
    try {
      await api.patch(`/customers/${id}/delete`);
      onRefresh();
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRestore(id: number) {
    setLoadingId(id);
    try {
      await api.patch(`/customers/${id}/restore`);
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      onShowDeletedReset?.();
    } finally {
      setLoadingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading customers...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        No customers found.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((customer) => {
            const isAssigned = Boolean(customer.assignedToId);
            const isDeleted = Boolean(customer.deletedAt);
            const isProcessing = loadingId === customer.id;

            return (
              <TableRow
                key={customer.id}
                className={`hover:bg-muted/50 transition ${isDeleted ? 'opacity-60' : ''}`}
              >
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                <TableCell className="text-muted-foreground">{customer.phone ?? '-'}</TableCell>

                <TableCell>
                  {isDeleted ? (
                    <Badge variant="destructive">Deleted</Badge>
                  ) : isAssigned ? (
                    <Badge variant="secondary">Assigned</Badge>
                  ) : (
                    <Badge variant="outline">Unassigned</Badge>
                  )}
                </TableCell>

                <TableCell className="text-right space-x-2">
                  {!isDeleted && (
                    <>
                      <CustomerDetailsModal customer={customer} />
                      <EditCustomerModal customer={customer} />
                      {isAdmin && <AssignCustomerModal customer={customer} />}
                      {!isAdmin && !isAssigned && (
                        <AssignCustomerModal customer={customer} />
                      )}
                    </>
                  )}

                  {isDeleted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => handleRestore(customer.id)}
                    >
                      {isProcessing ? 'Restoring...' : 'Restore'}
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => handleDelete(customer.id)}
                    >
                      {isProcessing ? 'Deleting...' : 'Delete'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}