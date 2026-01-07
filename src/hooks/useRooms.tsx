import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi, Room } from '@/services/api';

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
export type RoomType = 'standard' | 'superior' | 'deluxe' | 'suite' | 'presidential';

// Re-export Room type with snake_case for compatibility
export interface RoomData {
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

// Transform API response (camelCase) to frontend format (snake_case)
const transformRoom = (room: Room): RoomData => ({
  id: room.id,
  number: room.number,
  floor: room.floor,
  type: room.type,
  status: room.status,
  capacity: room.capacity,
  price_per_night: room.pricePerNight,
  amenities: room.amenities || [],
  description: room.description || null,
  created_at: room.createdAt || new Date().toISOString(),
  updated_at: room.updatedAt || new Date().toISOString(),
});

// Transform frontend format to API format
const transformToApi = (room: Partial<RoomData>): Partial<Room> => ({
  id: room.id,
  number: room.number,
  floor: room.floor,
  type: room.type,
  status: room.status,
  capacity: room.capacity,
  pricePerNight: room.price_per_night,
  amenities: room.amenities || [],
  description: room.description || undefined,
});

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const data = await roomsApi.getAll();
      return data.map(transformRoom);
    },
  });
};

export const useRoomStats = () => {
  return useQuery({
    queryKey: ['room-stats'],
    queryFn: async () => {
      const data = await roomsApi.getAll();
      
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

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (room: Omit<RoomData, 'id' | 'created_at' | 'updated_at'>) => {
      const apiRoom = transformToApi(room) as Omit<Room, 'id'>;
      return roomsApi.create(apiRoom);
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
    mutationFn: async ({ id, ...room }: Partial<RoomData> & { id: string }) => {
      const apiRoom = transformToApi(room);
      return roomsApi.update(id, apiRoom);
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
    mutationFn: (id: string) => roomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
    },
  });
};

// Alias for backward compatibility
export type { RoomData as Room };
