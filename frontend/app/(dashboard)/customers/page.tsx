'use client';

import { useState, useEffect } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/context/auth-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { CustomerTable } from '@/components/customers/customer-table';
import { CreateCustomerModal } from '@/components/customers/create-customer-modal';

export default function CustomersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [cursor, setCursor] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCursor(undefined);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, isError, refetch } = useCustomers(
    cursor,
    debouncedSearch,
    showDeleted,
  );

  const customers = Array.isArray(data) ? data : data?.data ?? [];

  if (isError) {
    return (
      <div className="p-6">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600 font-medium">Failed to load customers</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-gray-500">
            Manage your customers and their details
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => {
                  setShowDeleted(e.target.checked);
                  setCursor(undefined);
                }}
                className="rounded"
              />
              Show deleted
            </label>
          )}
          <CreateCustomerModal />
        </div>
      </div>

      {/* SEARCH BAR */}
      <Card className="p-4 flex items-center gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {search && (
          <Button variant="ghost" onClick={() => setSearch('')}>
            Clear
          </Button>
        )}
      </Card>

      {/* TABLE */}
      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-2">
            <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : (
          <CustomerTable
            data={customers}
            onRefresh={() => refetch()}
          />
        )}
      </Card>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {customers.length} results
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const last = customers?.[customers.length - 1];
              if (last) setCursor(last.id);
            }}
          >
            Next
          </Button>
          <Button variant="ghost" onClick={() => setCursor(undefined)}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}