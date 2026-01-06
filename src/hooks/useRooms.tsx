import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
export type RoomType = 'standard' | 'superior' | 'deluxe' | 'suite' | 'presidential';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('number');
      
      if (error) throw error;
      return data as Room[];
    },
  });
};

export const useRoomStats = () => {
  return useQuery({
    queryKey: ['room-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('status');
      
      if (error) throw error;
      
      const total = data.length;
      const occupied = data.filter(r => r.status === 'occupied').length;
      const available = data.filter(r => r.status === 'available').length;
      const cleaning = data.filter(r => r.status === 'cleaning').length;
      const maintenance = data.filter(r => r.status === 'maintenance').length;
      const reserved = data.filter(r => r.status === 'reserved').length;
      
      return {
        total,
        occupied,
        available,
        cleaning,
        maintenance,
        reserved,
        occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
      };
    },
  });
};
