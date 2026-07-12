import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { ArchivedSnack, Snack } from '../types';

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

export function useUndoEat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post<Snack>(`/archive/${id}/undo`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snacks'] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });
    },
  });
}

export function useUpdateRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating }: { id: number; rating: number }) =>
      api.patch<ArchivedSnack>(`/archive/${id}/rating`, { rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archive'] });
    },
  });
}
