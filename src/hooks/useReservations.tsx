import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi, Reservation as ApiReservation, ReservationInput } from '@/services/api';

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsApi.getAll(),
  });
};

export const useTodayArrivals = () => {
  return useQuery({
    queryKey: ['today-arrivals'],
    queryFn: () => reservationsApi.getTodayArrivals(),
  });
};

export const useTodayDepartures = () => {
  return useQuery({
    queryKey: ['today-departures'],
    queryFn: () => reservationsApi.getTodayDepartures(),
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservation: ReservationInput) => reservationsApi.create(reservation),
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
    mutationFn: ({ id, ...reservation }: Partial<ReservationInput> & { id: number }) => 
      reservationsApi.update(id, reservation),
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
    mutationFn: (id: number) => reservationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['today-arrivals'] });
      queryClient.invalidateQueries({ queryKey: ['today-departures'] });
    },
  });
};
