import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi, Reservation as ApiReservation } from '@/services/api';

export type ReservationStatus = 'confirmed' | 'pending' | 'checked_in' | 'checked_out' | 'cancelled';
export type ReservationSource = 'direct' | 'website' | 'booking' | 'expedia' | 'phone';

export interface Reservation {
  id: string;
  reservation_number: string;
  guest_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: ReservationStatus;
  adults: number;
  children: number;
  total_amount: number;
  paid_amount: number;
  source: ReservationSource;
  special_requests: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  guest?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    vip: boolean;
  };
  room?: {
    id: string;
    number: string;
    type: string;
  };
}

// Transform API response (camelCase) to frontend format (snake_case)
const transformReservation = (res: ApiReservation): Reservation => ({
  id: res.id,
  reservation_number: res.reservationNumber,
  guest_id: res.guestId,
  room_id: res.roomId,
  check_in: res.checkIn,
  check_out: res.checkOut,
  status: res.status,
  adults: res.adults,
  children: res.children,
  total_amount: res.totalAmount,
  paid_amount: res.paidAmount,
  source: res.source,
  special_requests: res.specialRequests || null,
  created_by: null,
  created_at: res.createdAt || new Date().toISOString(),
  updated_at: res.updatedAt || new Date().toISOString(),
  guest: res.guest ? {
    id: res.guest.id,
    first_name: res.guest.firstName,
    last_name: res.guest.lastName,
    email: res.guest.email,
    phone: res.guest.phone,
    vip: res.guest.vip,
  } : undefined,
  room: res.room ? {
    id: res.room.id,
    number: res.room.number,
    type: res.room.type,
  } : undefined,
});

// Transform frontend format to API format
const transformToApi = (res: Partial<Reservation>): Partial<ApiReservation> => ({
  id: res.id,
  reservationNumber: res.reservation_number,
  guestId: res.guest_id,
  roomId: res.room_id,
  checkIn: res.check_in,
  checkOut: res.check_out,
  status: res.status,
  adults: res.adults,
  children: res.children,
  totalAmount: res.total_amount,
  paidAmount: res.paid_amount,
  source: res.source,
  specialRequests: res.special_requests || undefined,
});

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const data = await reservationsApi.getAll();
      return data.map(transformReservation);
    },
  });
};

export const useTodayArrivals = () => {
  return useQuery({
    queryKey: ['today-arrivals'],
    queryFn: async () => {
      const data = await reservationsApi.getTodayArrivals();
      return data.map(transformReservation);
    },
  });
};

export const useTodayDepartures = () => {
  return useQuery({
    queryKey: ['today-departures'],
    queryFn: async () => {
      const data = await reservationsApi.getTodayDepartures();
      return data.map(transformReservation);
    },
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at' | 'reservation_number'>) => {
      const apiRes = transformToApi(reservation) as Omit<ApiReservation, 'id'>;
      return reservationsApi.create(apiRes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['today-arrivals'] });
      queryClient.invalidateQueries({ queryKey: ['today-departures'] });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...reservation }: Partial<Reservation> & { id: string }) => {
      const apiRes = transformToApi(reservation);
      return reservationsApi.update(id, apiRes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['today-arrivals'] });
      queryClient.invalidateQueries({ queryKey: ['today-departures'] });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reservationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['today-arrivals'] });
      queryClient.invalidateQueries({ queryKey: ['today-departures'] });
    },
  });
};
