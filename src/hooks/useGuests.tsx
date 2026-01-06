import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export const useGuests = () => {
  return useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('last_name');
      
      if (error) throw error;
      return data as Guest[];
    },
  });
};

export const useGuestStats = () => {
  return useQuery({
    queryKey: ['guest-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('vip, loyalty_points');
      
      if (error) throw error;
      
      const total = data.length;
      const vipCount = data.filter(g => g.vip).length;
      const totalPoints = data.reduce((acc, g) => acc + (g.loyalty_points || 0), 0);
      
      return { total, vipCount, totalPoints };
    },
  });
};
