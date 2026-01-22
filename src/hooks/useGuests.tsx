import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isProduction } from '@/lib/environment';
import { guestsApi, GuestInput } from '@/services/api';
import { supabaseGuestsApi } from '@/services/supabase-api';
import { normalizeGuest, normalizeGuests } from '@/lib/adapters';
import type { UnifiedGuest } from '@/types/unified';

// Export le type unifié
export type Guest = UnifiedGuest;
export type { GuestInput };

export const useGuests = () => {
  return useQuery({
    queryKey: ['guests'],
    queryFn: async (): Promise<Guest[]> => {
      if (isProduction()) {
        const data = await supabaseGuestsApi.getAll();
        return normalizeGuests(data);
      }
      const data = await guestsApi.getAll();
      return normalizeGuests(data);
    },
  });
};

export const useGuestStats = () => {
  return useQuery({
    queryKey: ['guest-stats'],
    queryFn: async () => {
      let data: Guest[];
      if (isProduction()) {
        const rawData = await supabaseGuestsApi.getAll();
        data = normalizeGuests(rawData);
      } else {
        const rawData = await guestsApi.getAll();
        data = normalizeGuests(rawData);
      }
      
      return { 
        total: data.length, 
        vipCount: data.filter(g => g.vip).length, 
        totalPoints: data.reduce((acc, g) => acc + (g.loyaltyPoints || 0), 0),
      };
    },
  });
};

export const useCreateGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (guest: GuestInput | any): Promise<Guest> => {
      if (isProduction()) {
        // Supabase utilise first_name/last_name
        const names = guest.name?.split(' ') || ['', ''];
        const result = await supabaseGuestsApi.create({
          first_name: guest.firstName || names[0],
          last_name: guest.lastName || names.slice(1).join(' '),
          email: guest.email,
          phone: guest.phone,
        });
        return normalizeGuest(result);
      }
      const result = await guestsApi.create(guest);
      return normalizeGuest(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guest-stats'] });
    },
  });
};

export const useUpdateGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...guest }: any): Promise<Guest> => {
      if (isProduction()) {
        const names = guest.name?.split(' ') || [];
        const result = await supabaseGuestsApi.update(String(id), {
          first_name: guest.firstName || names[0],
          last_name: guest.lastName || names.slice(1).join(' '),
          email: guest.email,
          phone: guest.phone,
        });
        return normalizeGuest(result);
      }
      const result = await guestsApi.update(id, guest);
      return normalizeGuest(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guest-stats'] });
    },
  });
};

export const useDeleteGuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      if (isProduction()) {
        return supabaseGuestsApi.delete(String(id));
      }
      return guestsApi.delete(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guest-stats'] });
    },
  });
};
