export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';

export type RoomType = 'standard' | 'superior' | 'deluxe' | 'suite' | 'presidential';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  currentGuest?: string;
  checkoutDate?: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  idNumber: string;
  vip: boolean;
  totalStays: number;
  loyaltyPoints: number;
}

export interface Reservation {
  id: string;
  guestId: string;
  guestName: string;
  roomId: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paidAmount: number;
  adults: number;
  children: number;
  specialRequests?: string;
  source: 'direct' | 'website' | 'booking' | 'expedia' | 'phone';
}

export interface DashboardStats {
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  todayArrivals: number;
  todayDepartures: number;
  revenue: number;
  averageRate: number;
}
