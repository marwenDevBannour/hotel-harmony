import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi, Room as ApiRoom, RoomInput } from '@/services/api';

// Frontend Room type
export interface RoomData {
  id: number;
  number: string;
  type: string;
  capacity: number;
  price: number;
  hotelId?: number;
}

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsApi.getAll(),
  });
};

export const useRoomStats = () => {
  return useQuery({
    queryKey: ['room-stats'],
    queryFn: async () => {
      const data = await roomsApi.getAll();
      const total = data.length;
      return {
        total,
        occupied: 0,
        available: total,
        cleaning: 0,
        maintenance: 0,
        reserved: 0,
        occupancyRate: 0,
      };
    },
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (room: RoomInput) => roomsApi.create(room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...room }: Partial<RoomInput> & { id: number }) => 
      roomsApi.update(id, room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => roomsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-stats'] });
    },
  });
};
