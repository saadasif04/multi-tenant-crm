'use client';

import { useState, useEffect } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomerTable } from '@/components/customers/customer-table';
import { CreateCustomerModal } from '@/components/customers/create-customer-modal';

export default function CustomersPage() {
  const [cursor, setCursor] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCursor(undefined);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError } = useCustomers(
    cursor,
    debouncedSearch
  );

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4">Error loading customers</p>;

  const customers = Array.isArray(data) ? data : data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Customers</h1>
        <CreateCustomerModal />
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="p-4">
        <CustomerTable
          data={customers}
          onEdit={(c) => console.log('edit', c)}
          onAssign={(c) => console.log('assign', c)}
        />
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            const last = customers?.[customers.length - 1];
            if (last) setCursor(last.id);
          }}
        >
          Next
        </Button>

        <Button variant="outline" onClick={() => setCursor(undefined)}>
          Reset
        </Button>
      </div>
    </div>
  );
}