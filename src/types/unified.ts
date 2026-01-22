// Types unifiés pour le front-end
// Ces types sont utilisés pour normaliser les données entre Supabase et Spring Boot

export interface UnifiedRoom {
  id: string | number;
  number: string;
  type: string;
  capacity: number;
  price: number;
  floor?: number;
  status?: string;
  description?: string;
  amenities?: string[];
}

export interface UnifiedGuest {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  vip?: boolean;
  loyaltyPoints?: number;
  totalStays?: number;
  nationality?: string;
  notes?: string;
}

export interface UnifiedReservation {
  id: string | number;
  checkInDate: string;
  checkOutDate: string;
  status?: string;
  adults?: number;
  children?: number;
  totalAmount?: number;
  paidAmount?: number;
  specialRequests?: string;
  guest?: UnifiedGuest;
  room?: UnifiedRoom;
  guestId?: string | number;
  roomId?: string | number;
}

export interface UnifiedInvoice {
  id: string | number;
  invoiceNumber: string;
  issueDate: string;
  amount: number;
  paid: boolean;
  dueDate?: string;
  status?: string;
  subtotal?: number;
  taxAmount?: number;
  totalAmount?: number;
  paidAmount?: number;
  guest?: UnifiedGuest;
  reservation?: UnifiedReservation;
}

export interface UnifiedPayment {
  id: string | number;
  paymentDate: string;
  method: string;
  amount: number;
  reference?: string;
  invoiceId?: string | number;
}

export interface UnifiedMenuItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
}

export interface UnifiedRestaurantTable {
  id: string | number;
  number: string;
  capacity: number;
  status: string;
  location?: string;
}

export interface UnifiedRestaurantOrder {
  id: string | number;
  orderNumber: string;
  orderType: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  table?: UnifiedRestaurantTable;
  guest?: UnifiedGuest;
  items?: any[];
}
