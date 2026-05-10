import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export function useCustomers(cursor?: number, search?: string) {
  return useQuery({
    queryKey: ['customers', cursor, search],
    queryFn: async () => {
      const res = await api.get('/customers', {
        params: {
          cursor,
          search,
          limit: 10,
        },
      });

      console.log('response', res)

      return res.data;
    },
  });
}
