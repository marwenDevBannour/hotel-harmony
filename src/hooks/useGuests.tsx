import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guestsApi, Guest as ApiGuest } from '@/services/api';

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nationality: string | null;
  id_type: string | null;
  id_number: string | null;
  vip: boolean;
  total_stays: number;
  loyalty_points: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Transform API response (camelCase) to frontend format (snake_case)
const transformGuest = (guest: ApiGuest): Guest => ({
  id: guest.id,
  first_name: guest.firstName,
  last_name: guest.lastName,
  email: guest.email,
  phone: guest.phone,
  nationality: guest.nationality || null,
  id_type: guest.idType || null,
  id_number: guest.idNumber || null,
  vip: guest.vip,
  total_stays: guest.totalStays,
  loyalty_points: guest.loyaltyPoints,
  notes: guest.notes || null,
  created_at: guest.createdAt || new Date().toISOString(),
  updated_at: guest.updatedAt || new Date().toISOString(),
});

// Transform frontend format to API format
const transformToApi = (guest: Partial<Guest>): Partial<ApiGuest> => ({
  id: guest.id,
  firstName: guest.first_name,
  lastName: guest.last_name,
  email: guest.email,
  phone: guest.phone,
  nationality: guest.nationality || undefined,
  idType: guest.id_type || undefined,
  idNumber: guest.id_number || undefined,
  vip: guest.vip,
  totalStays: guest.total_stays,
  loyaltyPoints: guest.loyalty_points,
  notes: guest.notes || undefined,
});

export const useGuests = () => {
  return useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const data = await guestsApi.getAll();
      return data.map(transformGuest);
    },
  });
};

export const useGuestStats = () => {
  return useQuery({
    queryKey: ['guest-stats'],
    queryFn: async () => {
      const data = await guestsApi.getAll();
      
      const total = data.length;
      const vipCount = data.filter(g => g.vip).length;
      const totalPoints = data.reduce((acc, g) => acc + (g.loyaltyPoints || 0), 0);
      
      return { total, vipCount, totalPoints };
    },
  });
};

export const useCreateGuest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>) => {
      const apiGuest = transformToApi(guest) as Omit<ApiGuest, 'id'>;
      return guestsApi.create(apiGuest);
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
    mutationFn: async ({ id, ...guest }: Partial<Guest> & { id: string }) => {
      const apiGuest = transformToApi(guest);
      return guestsApi.update(id, apiGuest);
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
    mutationFn: (id: string) => guestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guest-stats'] });
    },
  });
};
