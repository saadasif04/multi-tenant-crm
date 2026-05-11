import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export function useActivityLogs(cursor?: number) {
  return useQuery({
    queryKey: ['activity-logs', cursor],
    queryFn: async () => {
      const res = await api.get('/activity-logs', {
        params: {
          cursor,
          limit: 10,
        },
      });
      return res.data;
    },
  });
}