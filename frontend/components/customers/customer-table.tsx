'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

type Props = {
  data: Customer[];
  onEdit: (customer: Customer) => void;
  onAssign: (customer: Customer) => void;
};

export function CustomerTable({ data, onEdit, onAssign }: Props) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone ?? '-'}</TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onEdit(customer)}
                >
                  Edit
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => onAssign(customer)}
                >
                  Assign
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}