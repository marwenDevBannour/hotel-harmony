import { Room, Reservation, DashboardStats, Guest } from '@/types/hotel';

export const mockRooms: Room[] = [
  { id: 1, number: '101', type: 'standard', capacity: 2, price: 120 },
  { id: 2, number: '102', type: 'standard', capacity: 2, price: 120 },
  { id: 3, number: '103', type: 'superior', capacity: 2, price: 180 },
  { id: 4, number: '201', type: 'deluxe', capacity: 2, price: 250 },
  { id: 5, number: '202', type: 'deluxe', capacity: 2, price: 250 },
  { id: 6, number: '301', type: 'suite', capacity: 4, price: 400 },
];

export const mockGuests: Guest[] = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '+33 6 12 34 56 78' },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@email.com', phone: '+33 6 98 76 54 32' },
  { id: 3, name: 'Ahmed Hassan', email: 'ahmed.hassan@email.com', phone: '+971 50 123 4567' },
];

export const mockReservations: Reservation[] = [
  { id: 1, checkInDate: '2026-01-05', checkOutDate: '2026-01-08', guest: mockGuests[0], room: mockRooms[0] },
  { id: 2, checkInDate: '2026-01-04', checkOutDate: '2026-01-07', guest: mockGuests[1], room: mockRooms[3] },
];

export const mockStats: DashboardStats = {
  occupancyRate: 58,
  totalRooms: 12,
  occupiedRooms: 7,
  availableRooms: 4,
  todayArrivals: 3,
  todayDepartures: 1,
  revenue: 15420,
  averageRate: 245,
};
