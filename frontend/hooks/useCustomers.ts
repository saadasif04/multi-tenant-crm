import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function useCustomers(cursor?: number, search?: string, showDeleted = false) {
  return useQuery({
    queryKey: ['customers', cursor, search, showDeleted],
    queryFn: async () => {
      const res = await api.get('/customers', {
        params: {
          cursor,
          search,
          limit: 10,
          ...(showDeleted && { showDeleted: true }),
        },
      });
      return res.data;
    },
  });
}