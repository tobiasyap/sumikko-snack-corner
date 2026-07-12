import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { Snack, ArchivedSnack } from '../types';

export function useSnacks() {
  return useQuery<Snack[]>({
    queryKey: ['snacks'],
    queryFn: () => api.get('/snacks'),
  });
}

export function useAddSnack() {
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post<Snack>('/snacks', formData),
  });
}

export function useRefreshSnacks() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['snacks'] });
}

export function useEatSnack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }: { id: number; rating?: number }) =>
      api.post<ArchivedSnack>(`/snacks/${id}/eat`, { rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snacks'] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });
    },
  });
}

export function useDeleteSnack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/snacks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snacks'] });
    },
  });
}
