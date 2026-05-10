'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { NotesPanel } from '@/components/notes/notes-panel';
import { EditCustomerModal } from './edit-customer-modal';
import { AssignCustomerModal } from './assign-customer-modal';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  assignedTo?: {
    id: number;
    name: string;
  } | null;
};

export function CustomerDetailsModal({
  customer,
}: {
  customer: Customer;
}) {
  const [open, setOpen] = useState(false);

  const isAssigned = !!customer.assignedTo;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-left">
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>

        {/* CUSTOMER INFO */}
        <div className="space-y-3 border rounded-md p-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{customer.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{customer.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{customer.phone ?? '-'}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Status</p>

            {isAssigned ? (
              <Badge variant="secondary">
                Assigned to {customer.assignedTo?.name}
              </Badge>
            ) : (
              <Badge variant="outline">Unassigned</Badge>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-3">
          <EditCustomerModal customer={customer} />

          <AssignCustomerModal customer={customer} />
        </div>

        {/* NOTES SECTION */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">
            Notes
          </h3>

          <NotesPanel customerId={customer.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}