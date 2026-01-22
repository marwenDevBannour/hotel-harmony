import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isProduction } from '@/lib/environment';
import { roomsApi, RoomInput } from '@/services/api';
import { supabaseRoomsApi } from '@/services/supabase-api';
import { normalizeRoom, normalizeRooms } from '@/lib/adapters';
import type { UnifiedRoom } from '@/types/unified';

// Export le type unifié
export type Room = UnifiedRoom;
export type { RoomInput };

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async (): Promise<Room[]> => {
      if (isProduction()) {
        const data = await supabaseRoomsApi.getAll();
        return normalizeRooms(data);
      }
      const data = await roomsApi.getAll();
      return normalizeRooms(data);
    },
  });
};

export const useRoomStats = () => {
  return useQuery({
    queryKey: ['room-stats'],
    queryFn: async () => {
      let data: Room[];
      if (isProduction()) {
        const rawData = await supabaseRoomsApi.getAll();
        data = normalizeRooms(rawData);
      } else {
        const rawData = await roomsApi.getAll();
        data = normalizeRooms(rawData);
      }
      
      const total = data.length;
      const occupied = data.filter(r => r.status === 'occupied').length;
      const available = data.filter(r => r.status === 'available').length;
      const cleaning = data.filter(r => r.status === 'cleaning').length;
      const maintenance = data.filter(r => r.status === 'maintenance').length;
      const reserved = data.filter(r => r.status === 'reserved').length;
      
      return {
        total,
        occupied,
        available: isProduction() ? available : total,
        cleaning,
        maintenance,
        reserved,
        occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
      };
    },
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (room: RoomInput | any): Promise<Room> => {
      if (isProduction()) {
        const result = await supabaseRoomsApi.create({
          number: room.number,
          type: room.type,
          capacity: room.capacity,
          price_per_night: room.price,
        });
        return normalizeRoom(result);
      }
      const result = await roomsApi.create(room);
      return normalizeRoom(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...room }: any): Promise<Room> => {
      if (isProduction()) {
        const result = await supabaseRoomsApi.update(String(id), {
          number: room.number,
          type: room.type,
          capacity: room.capacity,
          price_per_night: room.price,
        });
        return normalizeRoom(result);
      }
      const result = await roomsApi.update(id, room);
      return normalizeRoom(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      if (isProduction()) {
        return supabaseRoomsApi.delete(String(id));
      }
      return roomsApi.delete(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
    },
  });
};
