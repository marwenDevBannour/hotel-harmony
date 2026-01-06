import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  // Joined data
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

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          guest:guests(id, first_name, last_name, email, phone, vip),
          room:rooms(id, number, type)
        `)
        .order('check_in', { ascending: false });
      
      if (error) throw error;
      return data as Reservation[];
    },
  });
};

export const useTodayArrivals = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['today-arrivals', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          guest:guests(id, first_name, last_name, email, phone, vip),
          room:rooms(id, number, type)
        `)
        .eq('check_in', today)
        .in('status', ['confirmed', 'pending']);
      
      if (error) throw error;
      return data as Reservation[];
    },
  });
};

export const useTodayDepartures = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['today-departures', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          guest:guests(id, first_name, last_name, email, phone, vip),
          room:rooms(id, number, type)
        `)
        .eq('check_out', today)
        .eq('status', 'checked_in');
      
      if (error) throw error;
      return data as Reservation[];
    },
  });
};
