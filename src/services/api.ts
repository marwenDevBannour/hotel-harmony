// Configuration de l'API Spring Boot
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper pour les requêtes HTTP
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Ajouter le token d'authentification si disponible
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.message || `Erreur HTTP: ${response.status}`);
  }

  // Pour les réponses vides (204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// API Rooms
export const roomsApi = {
  getAll: () => fetchApi<Room[]>('/rooms'),
  getById: (id: string) => fetchApi<Room>(`/rooms/${id}`),
  create: (room: Omit<Room, 'id'>) => fetchApi<Room>('/rooms', {
    method: 'POST',
    body: JSON.stringify(room),
  }),
  update: (id: string, room: Partial<Room>) => fetchApi<Room>(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(room),
  }),
  delete: (id: string) => fetchApi<void>(`/rooms/${id}`, {
    method: 'DELETE',
  }),
};

// API Guests
export const guestsApi = {
  getAll: () => fetchApi<Guest[]>('/guests'),
  getById: (id: string) => fetchApi<Guest>(`/guests/${id}`),
  create: (guest: Omit<Guest, 'id'>) => fetchApi<Guest>('/guests', {
    method: 'POST',
    body: JSON.stringify(guest),
  }),
  update: (id: string, guest: Partial<Guest>) => fetchApi<Guest>(`/guests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(guest),
  }),
  delete: (id: string) => fetchApi<void>(`/guests/${id}`, {
    method: 'DELETE',
  }),
};

// API Reservations
export const reservationsApi = {
  getAll: () => fetchApi<Reservation[]>('/reservations'),
  getById: (id: string) => fetchApi<Reservation>(`/reservations/${id}`),
  create: (reservation: Omit<Reservation, 'id'>) => fetchApi<Reservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservation),
  }),
  update: (id: string, reservation: Partial<Reservation>) => fetchApi<Reservation>(`/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reservation),
  }),
  delete: (id: string) => fetchApi<void>(`/reservations/${id}`, {
    method: 'DELETE',
  }),
  getTodayArrivals: () => fetchApi<Reservation[]>('/reservations/today-arrivals'),
  getTodayDepartures: () => fetchApi<Reservation[]>('/reservations/today-departures'),
};

// API Invoices
export const invoicesApi = {
  getAll: () => fetchApi<Invoice[]>('/invoices'),
  getById: (id: string) => fetchApi<Invoice>(`/invoices/${id}`),
  create: (invoice: Omit<Invoice, 'id'>) => fetchApi<Invoice>('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoice),
  }),
  update: (id: string, invoice: Partial<Invoice>) => fetchApi<Invoice>(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(invoice),
  }),
  delete: (id: string) => fetchApi<void>(`/invoices/${id}`, {
    method: 'DELETE',
  }),
  addPayment: (invoiceId: string, payment: PaymentInput) => fetchApi<Payment>(`/invoices/${invoiceId}/payments`, {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
};

// API Restaurant Tables
export const restaurantTablesApi = {
  getAll: () => fetchApi<RestaurantTable[]>('/restaurant/tables'),
  getById: (id: string) => fetchApi<RestaurantTable>(`/restaurant/tables/${id}`),
  create: (table: Omit<RestaurantTable, 'id'>) => fetchApi<RestaurantTable>('/restaurant/tables', {
    method: 'POST',
    body: JSON.stringify(table),
  }),
  update: (id: string, table: Partial<RestaurantTable>) => fetchApi<RestaurantTable>(`/restaurant/tables/${id}`, {
    method: 'PUT',
    body: JSON.stringify(table),
  }),
  updateStatus: (id: string, status: string) => fetchApi<RestaurantTable>(`/restaurant/tables/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  delete: (id: string) => fetchApi<void>(`/restaurant/tables/${id}`, {
    method: 'DELETE',
  }),
};

// API Menu Items
export const menuItemsApi = {
  getAll: () => fetchApi<MenuItem[]>('/restaurant/menu'),
  getById: (id: string) => fetchApi<MenuItem>(`/restaurant/menu/${id}`),
  create: (item: Omit<MenuItem, 'id'>) => fetchApi<MenuItem>('/restaurant/menu', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  update: (id: string, item: Partial<MenuItem>) => fetchApi<MenuItem>(`/restaurant/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  delete: (id: string) => fetchApi<void>(`/restaurant/menu/${id}`, {
    method: 'DELETE',
  }),
};

// API Restaurant Orders
export const ordersApi = {
  getAll: () => fetchApi<RestaurantOrder[]>('/restaurant/orders'),
  getActive: () => fetchApi<RestaurantOrder[]>('/restaurant/orders/active'),
  getById: (id: string) => fetchApi<RestaurantOrder>(`/restaurant/orders/${id}`),
  create: (order: CreateOrderInput) => fetchApi<RestaurantOrder>('/restaurant/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  updateStatus: (id: string, status: string) => fetchApi<RestaurantOrder>(`/restaurant/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  delete: (id: string) => fetchApi<void>(`/restaurant/orders/${id}`, {
    method: 'DELETE',
  }),
};

// API Auth
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },
  signup: async (data: SignupInput) => {
    const response = await fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem('auth_token');
  },
  getCurrentUser: () => fetchApi<User>('/auth/me'),
};

// Types pour l'API
export interface Room {
  id: string;
  number: string;
  floor: number;
  type: 'standard' | 'superior' | 'deluxe' | 'suite' | 'presidential';
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  vip: boolean;
  totalStays: number;
  loyaltyPoints: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'checked_in' | 'checked_out' | 'cancelled';
  adults: number;
  children: number;
  totalAmount: number;
  paidAmount: number;
  source: 'direct' | 'website' | 'booking' | 'expedia' | 'phone';
  specialRequests?: string;
  guest?: Guest;
  room?: Room;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  guestId: string;
  reservationId?: string;
  type: 'reservation' | 'restaurant' | 'service' | 'other';
  status: 'draft' | 'pending' | 'paid' | 'cancelled';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueDate?: string;
  notes?: string;
  guest?: Guest;
  items?: InvoiceItem[];
  payments?: Payment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  createdAt?: string;
}

export interface PaymentInput {
  amount: number;
  paymentMethod: string;
  reference?: string;
}

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  location?: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantOrder {
  id: string;
  orderNumber: string;
  orderType: 'dine_in' | 'room_service' | 'takeaway';
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  tableId?: string;
  roomId?: string;
  guestId?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  items?: OrderItem[];
  table?: RestaurantTable;
  room?: Room;
  guest?: Guest;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  status: string;
  menuItem?: MenuItem;
}

export interface CreateOrderInput {
  orderType: string;
  tableId?: string;
  roomId?: string;
  guestId?: string;
  notes?: string;
  items: {
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
  }[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
