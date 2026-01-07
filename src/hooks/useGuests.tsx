import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guestsApi, Guest as ApiGuest, GuestInput } from '@/services/api';

export const useGuests = () => {
  return useQuery({
    queryKey: ['guests'],
    queryFn: () => guestsApi.getAll(),
  });
};

export const useGuestStats = () => {
  return useQuery({
    queryKey: ['guest-stats'],
    queryFn: async () => {
      const data = await guestsApi.getAll();
      return { 
        total: data.length, 
        vipCount: 0, 
        totalPoints: 0 
      };
    },
  });
};

export const useCreateGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guest: GuestInput) => guestsApi.create(guest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guest-stats'] });
    },
  });
};

export const useUpdateGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...guest }: Partial<GuestInput> & { id: number }) => 
      guestsApi.update(id, guest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guest-stats'] });
    },
  });
};

export const useDeleteGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => guestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guest-stats'] });
    },
  });
};
