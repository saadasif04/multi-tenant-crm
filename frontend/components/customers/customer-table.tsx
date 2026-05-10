'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { EditCustomerModal } from './edit-customer-modal';
import { AssignCustomerModal } from './assign-customer-modal';
import { useAuth } from '@/context/auth-context';
import { CustomerDetailsModal } from './customer-details-modal';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  assignedToId?: number | null;
};

type Props = {
  data: Customer[];
  loading?: boolean;
};

export function CustomerTable({
  data,
  loading = false,
}: Props) {
  const { user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

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
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((customer) => {
            const isAssigned = Boolean(customer.assignedToId);

            return (
              <TableRow
                key={customer.id}
                className="hover:bg-muted/50 transition"
              >
                {/* NAME */}
                <TableCell className="font-medium">
                  {customer.name}
                </TableCell>

                {/* EMAIL */}
                <TableCell className="text-muted-foreground">
                  {customer.email}
                </TableCell>

                {/* PHONE */}
                <TableCell className="text-muted-foreground">
                  {customer.phone ?? '-'}
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-right space-x-2">
                  <CustomerDetailsModal customer={customer} />
  <EditCustomerModal customer={customer} />

  {(() => {
    const isAssigned = Boolean(customer.assignedToId);

    return (
      <>
        {/* ADMIN: always see assign + badge */}
        {isAdmin && (
          <AssignCustomerModal customer={customer} />
        )}

        {/* MEMBER: only show assign if NOT assigned */}
        {!isAdmin && !isAssigned && (
          <AssignCustomerModal customer={customer} />
        )}

        {/* BADGE: show if assigned (both roles) */}
        {isAssigned && (
          <Badge variant="secondary">
            Assigned
          </Badge>
        )}
      </>
    );
  })()}
</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}