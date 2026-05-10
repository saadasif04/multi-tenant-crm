'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export function useCustomerNotes(customerId?: number) {
  return useQuery({
    queryKey: ['notes', customerId],
    enabled: !!customerId,
    queryFn: async () => {
      const res = await api.get(`/notes/customer/${customerId}`);
      return res.data;
    },
  });
}