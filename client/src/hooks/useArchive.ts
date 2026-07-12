import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { ArchivedSnack } from '../types';

export function useArchive() {
  return useQuery<ArchivedSnack[]>({
    queryKey: ['archive'],
    queryFn: () => api.get('/archive'),
  });
}

export function useDeleteArchived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/archive/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archive'] });
    },
  });
}
