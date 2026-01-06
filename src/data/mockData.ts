import { Room, Reservation, DashboardStats, Guest } from '@/types/hotel';

export const mockRooms: Room[] = [
  { id: '1', number: '101', floor: 1, type: 'standard', status: 'occupied', capacity: 2, pricePerNight: 120, amenities: ['WiFi', 'TV', 'Mini-bar'], currentGuest: 'Jean Dupont', checkoutDate: '2026-01-08' },
  { id: '2', number: '102', floor: 1, type: 'standard', status: 'available', capacity: 2, pricePerNight: 120, amenities: ['WiFi', 'TV', 'Mini-bar'] },
  { id: '3', number: '103', floor: 1, type: 'superior', status: 'cleaning', capacity: 2, pricePerNight: 180, amenities: ['WiFi', 'TV', 'Mini-bar', 'Balcony'] },
  { id: '4', number: '104', floor: 1, type: 'superior', status: 'occupied', capacity: 3, pricePerNight: 180, amenities: ['WiFi', 'TV', 'Mini-bar', 'Balcony'], currentGuest: 'Marie Martin', checkoutDate: '2026-01-07' },
  { id: '5', number: '201', floor: 2, type: 'deluxe', status: 'available', capacity: 2, pricePerNight: 250, amenities: ['WiFi', 'TV', 'Mini-bar', 'Balcony', 'Sea View'] },
  { id: '6', number: '202', floor: 2, type: 'deluxe', status: 'occupied', capacity: 2, pricePerNight: 250, amenities: ['WiFi', 'TV', 'Mini-bar', 'Balcony', 'Sea View'], currentGuest: 'Ahmed Hassan', checkoutDate: '2026-01-09' },
  { id: '7', number: '203', floor: 2, type: 'deluxe', status: 'reserved', capacity: 3, pricePerNight: 250, amenities: ['WiFi', 'TV', 'Mini-bar', 'Balcony', 'Sea View'] },
  { id: '8', number: '204', floor: 2, type: 'suite', status: 'maintenance', capacity: 4, pricePerNight: 400, amenities: ['WiFi', 'TV', 'Mini-bar', 'Balcony', 'Sea View', 'Jacuzzi'] },
  { id: '9', number: '301', floor: 3, type: 'suite', status: 'occupied', capacity: 4, pricePerNight: 400, amenities: ['WiFi', 'TV', 'Mini-bar', 'Balcony', 'Sea View', 'Jacuzzi'], currentGuest: 'Sophie Leblanc', checkoutDate: '2026-01-10' },
  { id: '10', number: '302', floor: 3, type: 'presidential', status: 'available', capacity: 6, pricePerNight: 800, amenities: ['WiFi', 'TV', 'Mini-bar', 'Terrace', 'Sea View', 'Jacuzzi', 'Private Pool', 'Butler Service'] },
  { id: '11', number: '105', floor: 1, type: 'standard', status: 'available', capacity: 2, pricePerNight: 120, amenities: ['WiFi', 'TV', 'Mini-bar'] },
  { id: '12', number: '106', floor: 1, type: 'standard', status: 'occupied', capacity: 2, pricePerNight: 120, amenities: ['WiFi', 'TV', 'Mini-bar'], currentGuest: 'Pierre Bernard', checkoutDate: '2026-01-06' },
];

export const mockReservations: Reservation[] = [
  { id: 'R001', guestId: 'G001', guestName: 'Jean Dupont', roomId: '1', roomNumber: '101', checkIn: '2026-01-05', checkOut: '2026-01-08', status: 'checked-in', totalAmount: 360, paidAmount: 360, adults: 2, children: 0, source: 'direct' },
  { id: 'R002', guestId: 'G002', guestName: 'Marie Martin', roomId: '4', roomNumber: '104', checkIn: '2026-01-04', checkOut: '2026-01-07', status: 'checked-in', totalAmount: 540, paidAmount: 540, adults: 2, children: 1, source: 'booking' },
  { id: 'R003', guestId: 'G003', guestName: 'Ahmed Hassan', roomId: '6', roomNumber: '202', checkIn: '2026-01-06', checkOut: '2026-01-09', status: 'checked-in', totalAmount: 750, paidAmount: 500, adults: 2, children: 0, source: 'expedia', specialRequests: 'Late checkout' },
  { id: 'R004', guestId: 'G004', guestName: 'Sophie Leblanc', roomId: '9', roomNumber: '301', checkIn: '2026-01-06', checkOut: '2026-01-10', status: 'checked-in', totalAmount: 1600, paidAmount: 1600, adults: 2, children: 2, source: 'direct' },
  { id: 'R005', guestId: 'G005', guestName: 'Pierre Bernard', roomId: '12', roomNumber: '106', checkIn: '2026-01-05', checkOut: '2026-01-06', status: 'checked-in', totalAmount: 120, paidAmount: 120, adults: 1, children: 0, source: 'phone' },
  { id: 'R006', guestId: 'G006', guestName: 'Emma Wilson', roomId: '7', roomNumber: '203', checkIn: '2026-01-07', checkOut: '2026-01-10', status: 'confirmed', totalAmount: 750, paidAmount: 250, adults: 2, children: 0, source: 'website' },
  { id: 'R007', guestId: 'G007', guestName: 'Carlos Rodriguez', roomId: '2', roomNumber: '102', checkIn: '2026-01-06', checkOut: '2026-01-08', status: 'confirmed', totalAmount: 240, paidAmount: 0, adults: 2, children: 0, source: 'booking' },
  { id: 'R008', guestId: 'G008', guestName: 'Yuki Tanaka', roomId: '5', roomNumber: '201', checkIn: '2026-01-06', checkOut: '2026-01-09', status: 'pending', totalAmount: 750, paidAmount: 0, adults: 2, children: 0, source: 'expedia' },
];

export const mockGuests: Guest[] = [
  { id: 'G001', firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.com', phone: '+33 6 12 34 56 78', nationality: 'France', idNumber: 'FR123456789', vip: false, totalStays: 3, loyaltyPoints: 450 },
  { id: 'G002', firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@email.com', phone: '+33 6 98 76 54 32', nationality: 'France', idNumber: 'FR987654321', vip: true, totalStays: 12, loyaltyPoints: 2400 },
  { id: 'G003', firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed.hassan@email.com', phone: '+971 50 123 4567', nationality: 'UAE', idNumber: 'AE456789123', vip: false, totalStays: 1, loyaltyPoints: 75 },
  { id: 'G004', firstName: 'Sophie', lastName: 'Leblanc', email: 'sophie.leblanc@email.com', phone: '+33 6 55 44 33 22', nationality: 'France', idNumber: 'FR555444333', vip: true, totalStays: 8, loyaltyPoints: 1600 },
  { id: 'G005', firstName: 'Pierre', lastName: 'Bernard', email: 'pierre.bernard@email.com', phone: '+33 6 11 22 33 44', nationality: 'France', idNumber: 'FR111222333', vip: false, totalStays: 2, loyaltyPoints: 180 },
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
