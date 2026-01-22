// Adaptateurs pour normaliser les données entre Supabase et Spring Boot
import type { Room as ApiRoom, Guest as ApiGuest, Reservation as ApiReservation } from '@/services/api';
import type { SupabaseRoom, SupabaseGuest, SupabaseReservation } from '@/services/supabase-api';
import type { UnifiedRoom, UnifiedGuest, UnifiedReservation } from '@/types/unified';

// =====================
// Room Adapters
// =====================
export const normalizeRoom = (room: ApiRoom | SupabaseRoom): UnifiedRoom => {
  if ('price_per_night' in room) {
    // Supabase room
    return {
      id: room.id,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      price: room.price_per_night,
      floor: room.floor,
      status: room.status,
      description: room.description || undefined,
      amenities: room.amenities || undefined,
    };
  } else {
    // Spring Boot room
    return {
      id: room.id,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      status: 'available',
    };
  }
};

export const normalizeRooms = (rooms: (ApiRoom | SupabaseRoom)[]): UnifiedRoom[] => {
  return rooms.map(normalizeRoom);
};

// =====================
// Guest Adapters
// =====================
export const normalizeGuest = (guest: ApiGuest | SupabaseGuest): UnifiedGuest => {
  if ('first_name' in guest) {
    // Supabase guest
    return {
      id: guest.id,
      name: `${guest.first_name} ${guest.last_name}`.trim(),
      email: guest.email,
      phone: guest.phone,
      firstName: guest.first_name,
      lastName: guest.last_name,
      vip: guest.vip,
      loyaltyPoints: guest.loyalty_points,
      totalStays: guest.total_stays,
      nationality: guest.nationality || undefined,
      notes: guest.notes || undefined,
    };
  } else {
    // Spring Boot guest
    return {
      id: guest.id,
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      vip: false,
      loyaltyPoints: 0,
      totalStays: 0,
    };
  }
};

export const normalizeGuests = (guests: (ApiGuest | SupabaseGuest)[]): UnifiedGuest[] => {
  return guests.map(normalizeGuest);
};

// =====================
// Reservation Adapters
// =====================
export const normalizeReservation = (reservation: any): UnifiedReservation => {
  if ('check_in' in reservation) {
    // Supabase reservation
    return {
      id: reservation.id,
      checkInDate: reservation.check_in,
      checkOutDate: reservation.check_out,
      status: reservation.status,
      adults: reservation.adults,
      children: reservation.children,
      totalAmount: reservation.total_amount,
      paidAmount: reservation.paid_amount,
      specialRequests: reservation.special_requests || undefined,
      guest: reservation.guest ? normalizeGuest(reservation.guest) : undefined,
      room: reservation.room ? normalizeRoom(reservation.room) : undefined,
      guestId: reservation.guest_id,
      roomId: reservation.room_id,
    };
  } else {
    // Spring Boot reservation
    return {
      id: reservation.id,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      guest: reservation.guest ? normalizeGuest(reservation.guest) : undefined,
      room: reservation.room ? normalizeRoom(reservation.room) : undefined,
      guestId: reservation.guest?.id,
      roomId: reservation.room?.id,
    };
  }
};

export const normalizeReservations = (reservations: any[]): UnifiedReservation[] => {
  return reservations.map(normalizeReservation);
};
