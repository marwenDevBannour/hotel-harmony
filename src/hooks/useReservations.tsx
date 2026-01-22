import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isProduction } from '@/lib/environment';
import { reservationsApi, ReservationInput } from '@/services/api';
import { supabaseReservationsApi } from '@/services/supabase-api';
import { normalizeReservation, normalizeReservations } from '@/lib/adapters';
import type { UnifiedReservation } from '@/types/unified';

// Export le type unifié
export type Reservation = UnifiedReservation;
export type { ReservationInput };

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async (): Promise<Reservation[]> => {
      if (isProduction()) {
        const data = await supabaseReservationsApi.getAll();
        return normalizeReservations(data);
      }
      const data = await reservationsApi.getAll();
      return normalizeReservations(data);
    },
  });
};

export const useTodayArrivals = () => {
  return useQuery({
    queryKey: ['today-arrivals'],
    queryFn: async (): Promise<Reservation[]> => {
      if (isProduction()) {
        const data = await supabaseReservationsApi.getTodayArrivals();
        return normalizeReservations(data);
      }
      const data = await reservationsApi.getTodayArrivals();
      return normalizeReservations(data);
    },
  });
};

export const useTodayDepartures = () => {
  return useQuery({
    queryKey: ['today-departures'],
    queryFn: async (): Promise<Reservation[]> => {
      if (isProduction()) {
        const data = await supabaseReservationsApi.getTodayDepartures();
        return normalizeReservations(data);
      }
      const data = await reservationsApi.getTodayDepartures();
      return normalizeReservations(data);
    },
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reservation: ReservationInput | any): Promise<Reservation> => {
      if (isProduction()) {
        const result = await supabaseReservationsApi.create({
          check_in: reservation.checkInDate,
          check_out: reservation.checkOutDate,
          guest_id: String(reservation.guestId),
          room_id: String(reservation.roomId),
          reservation_number: `RES-${Date.now()}`,
        });
        return normalizeReservation(result);
      }
      const result = await reservationsApi.create(reservation);
      return normalizeReservation(result);
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
    mutationFn: async ({ id, ...reservation }: any): Promise<Reservation> => {
      if (isProduction()) {
        const result = await supabaseReservationsApi.update(String(id), {
          check_in: reservation.checkInDate,
          check_out: reservation.checkOutDate,
          guest_id: reservation.guestId ? String(reservation.guestId) : undefined,
          room_id: reservation.roomId ? String(reservation.roomId) : undefined,
        });
        return normalizeReservation(result);
      }
      const result = await reservationsApi.update(id, reservation);
      return normalizeReservation(result);
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
    mutationFn: async (id: number | string) => {
      if (isProduction()) {
        return supabaseReservationsApi.delete(String(id));
      }
      return reservationsApi.delete(Number(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['today-arrivals'] });
      queryClient.invalidateQueries({ queryKey: ['today-departures'] });
    },
  });
};
