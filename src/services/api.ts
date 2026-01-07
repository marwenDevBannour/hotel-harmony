// Configuration de l'API Spring Boot
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

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

// =====================
// Types pour l'API (correspondant aux entités Spring Boot)
// =====================

// Admin entities
export interface Users {
  id: number;
  codeUser: string;
  lastName: string;
  firstName: string;
  matricule: string;
  dateNaiss: string;
  email: string;
  badmin: boolean;
}

export interface Module {
  id: number;
  codeM: string;
  libelle: string;
  ddeb: string;
  dfin: string;
}

export interface SousModule {
  id: number;
  codeS: string;
  libelle: string;
  ddeb: string;
  dfin: string;
  module: Module;
}

export interface Evnmt {
  id: number;
  codeEvnmt: string;
  libelle: string;
  ddeb: string;
  dfin: string;
  bactif: boolean;
  sousModule: SousModule;
}

// Structure entities
export interface NatureStruct {
  id: number;
  libelle: string;
  ddeb: string;
  dfin: string;
}

export interface Structure {
  id: number;
  parent?: Structure;
  ladr: string;
  valeurX?: number;
  valeurY?: number;
  valeurZ?: number;
  natureStruct: NatureStruct;
  codePostale?: number;
}

// Hotel entities
export interface Hotel {
  id: number;
  name: string;
  idaddress?: Structure;
  phone: string;
  email: string;
  adresse: string;
  rooms?: Room[];
  employees?: Employee[];
}

export interface Room {
  id: number;
  number: string;
  type: string;
  capacity: number;
  price: number;
  hotel?: Hotel;
  reservations?: Reservation[];
  housekeepings?: Housekeeping[];
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  reservations?: Reservation[];
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  hotel?: Hotel;
}

export interface Reservation {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  guest?: Guest;
  room?: Room;
  invoice?: Invoice;
}

export interface Invoice {
  id: number;
  issueDate: string;
  amount: number;
  paid: boolean;
  reservation?: Reservation;
  payment?: Payment;
}

export interface Payment {
  id: number;
  paymentDate: string;
  method: string;
  amount: number;
  invoice?: Invoice;
}

export interface Housekeeping {
  id: number;
  date: string;
  status: string;
  room?: Room;
  employee?: Employee;
}

export interface Maintenance {
  id: number;
  scheduledDate: string;
  description: string;
  status: string;
  room?: Room;
  technician?: Employee;
}

// =====================
// Input types pour les créations/mises à jour
// =====================

export interface RoomInput {
  number: string;
  type: string;
  capacity: number;
  price: number;
  hotelId?: number;
}

export interface GuestInput {
  name: string;
  email: string;
  phone: string;
}

export interface ReservationInput {
  checkInDate: string;
  checkOutDate: string;
  guestId: number;
  roomId: number;
}

export interface InvoiceInput {
  issueDate: string;
  amount: number;
  paid: boolean;
  reservationId: number;
}

export interface PaymentInput {
  paymentDate: string;
  method: string;
  amount: number;
  invoiceId: number;
}

export interface EmployeeInput {
  name: string;
  role: string;
  email: string;
  hotelId?: number;
}

export interface HotelInput {
  name: string;
  phone: string;
  email: string;
  adresse: string;
  idaddressId?: number;
}

export interface HousekeepingInput {
  date: string;
  status: string;
  roomId: number;
  employeeId: number;
}

export interface MaintenanceInput {
  scheduledDate: string;
  description: string;
  status: string;
  roomId: number;
  technicianId: number;
}

export interface NatureStructInput {
  libelle: string;
  ddeb: string;
  dfin: string;
}

export interface StructureInput {
  parentId?: number;
  ladr: string;
  valeurX?: number;
  valeurY?: number;
  valeurZ?: number;
  natureStructId: number;
  codePostale?: number;
}

export interface ModuleInput {
  codeM: string;
  libelle: string;
  ddeb: string;
  dfin: string;
}

export interface SousModuleInput {
  codeS: string;
  libelle: string;
  ddeb: string;
  dfin: string;
  moduleId: number;
}

export interface EvnmtInput {
  codeEvnmt: string;
  libelle: string;
  ddeb: string;
  dfin: string;
  bactif: boolean;
  sousModuleId: number;
}

export interface UsersInput {
  codeUser: string;
  lastName: string;
  firstName: string;
  matricule: string;
  dateNaiss: string;
  email: string;
  badmin: boolean;
}

// Auth types - correspond à UserDto du backend
export interface User {
  id: number;
  codeUser: string;
  lastName: string;
  firstName: string;
  matricule: string;
  dateNaiss: string;
  email: string;
  badmin: boolean;
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

// =====================
// API Endpoints
// =====================

// API Rooms
export const roomsApi = {
  getAll: () => fetchApi<Room[]>('/rooms'),
  getById: (id: number) => fetchApi<Room>(`/rooms/${id}`),
  create: (room: RoomInput) => fetchApi<Room>('/rooms', {
    method: 'POST',
    body: JSON.stringify(room),
  }),
  update: (id: number, room: Partial<RoomInput>) => fetchApi<Room>(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(room),
  }),
  delete: (id: number) => fetchApi<void>(`/rooms/${id}`, {
    method: 'DELETE',
  }),
};

// API Guests
export const guestsApi = {
  getAll: () => fetchApi<Guest[]>('/guests'),
  getById: (id: number) => fetchApi<Guest>(`/guests/${id}`),
  create: (guest: GuestInput) => fetchApi<Guest>('/guests', {
    method: 'POST',
    body: JSON.stringify(guest),
  }),
  update: (id: number, guest: Partial<GuestInput>) => fetchApi<Guest>(`/guests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(guest),
  }),
  delete: (id: number) => fetchApi<void>(`/guests/${id}`, {
    method: 'DELETE',
  }),
};

// API Reservations
export const reservationsApi = {
  getAll: () => fetchApi<Reservation[]>('/reservations'),
  getById: (id: number) => fetchApi<Reservation>(`/reservations/${id}`),
  create: (reservation: ReservationInput) => fetchApi<Reservation>('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservation),
  }),
  update: (id: number, reservation: Partial<ReservationInput>) => fetchApi<Reservation>(`/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reservation),
  }),
  delete: (id: number) => fetchApi<void>(`/reservations/${id}`, {
    method: 'DELETE',
  }),
  getTodayArrivals: () => fetchApi<Reservation[]>('/reservations/today-arrivals'),
  getTodayDepartures: () => fetchApi<Reservation[]>('/reservations/today-departures'),
};

// API Invoices
export const invoicesApi = {
  getAll: () => fetchApi<Invoice[]>('/invoices'),
  getById: (id: number) => fetchApi<Invoice>(`/invoices/${id}`),
  create: (invoice: InvoiceInput) => fetchApi<Invoice>('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoice),
  }),
  update: (id: number, invoice: Partial<InvoiceInput>) => fetchApi<Invoice>(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(invoice),
  }),
  delete: (id: number) => fetchApi<void>(`/invoices/${id}`, {
    method: 'DELETE',
  }),
  addPayment: (invoiceId: number, payment: Omit<PaymentInput, 'invoiceId'>) => fetchApi<Payment>(`/invoices/${invoiceId}/payments`, {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
};

// API Payments
export const paymentsApi = {
  getAll: () => fetchApi<Payment[]>('/payments'),
  getById: (id: number) => fetchApi<Payment>(`/payments/${id}`),
  create: (payment: PaymentInput) => fetchApi<Payment>('/payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
  update: (id: number, payment: Partial<PaymentInput>) => fetchApi<Payment>(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payment),
  }),
  delete: (id: number) => fetchApi<void>(`/payments/${id}`, {
    method: 'DELETE',
  }),
};

// API Employees
export const employeesApi = {
  getAll: () => fetchApi<Employee[]>('/employees'),
  getById: (id: number) => fetchApi<Employee>(`/employees/${id}`),
  create: (employee: EmployeeInput) => fetchApi<Employee>('/employees', {
    method: 'POST',
    body: JSON.stringify(employee),
  }),
  update: (id: number, employee: Partial<EmployeeInput>) => fetchApi<Employee>(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employee),
  }),
  delete: (id: number) => fetchApi<void>(`/employees/${id}`, {
    method: 'DELETE',
  }),
};

// API Hotels
export const hotelsApi = {
  getAll: () => fetchApi<Hotel[]>('/hotels'),
  getById: (id: number) => fetchApi<Hotel>(`/hotels/${id}`),
  create: (hotel: HotelInput) => fetchApi<Hotel>('/hotels', {
    method: 'POST',
    body: JSON.stringify(hotel),
  }),
  update: (id: number, hotel: Partial<HotelInput>) => fetchApi<Hotel>(`/hotels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(hotel),
  }),
  delete: (id: number) => fetchApi<void>(`/hotels/${id}`, {
    method: 'DELETE',
  }),
};

// API Housekeeping
export const housekeepingApi = {
  getAll: () => fetchApi<Housekeeping[]>('/housekeeping'),
  getById: (id: number) => fetchApi<Housekeeping>(`/housekeeping/${id}`),
  create: (task: HousekeepingInput) => fetchApi<Housekeeping>('/housekeeping', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  update: (id: number, task: Partial<HousekeepingInput>) => fetchApi<Housekeeping>(`/housekeeping/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  }),
  delete: (id: number) => fetchApi<void>(`/housekeeping/${id}`, {
    method: 'DELETE',
  }),
};

// API Maintenance
export const maintenanceApi = {
  getAll: () => fetchApi<Maintenance[]>('/maintenance'),
  getById: (id: number) => fetchApi<Maintenance>(`/maintenance/${id}`),
  create: (task: MaintenanceInput) => fetchApi<Maintenance>('/maintenance', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  update: (id: number, task: Partial<MaintenanceInput>) => fetchApi<Maintenance>(`/maintenance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  }),
  delete: (id: number) => fetchApi<void>(`/maintenance/${id}`, {
    method: 'DELETE',
  }),
};

// API NatureStruct
export const natureStructApi = {
  getAll: () => fetchApi<NatureStruct[]>('/nature-structs'),
  getById: (id: number) => fetchApi<NatureStruct>(`/nature-structs/${id}`),
  create: (data: NatureStructInput) => fetchApi<NatureStruct>('/nature-structs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<NatureStructInput>) => fetchApi<NatureStruct>(`/nature-structs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/nature-structs/${id}`, {
    method: 'DELETE',
  }),
};

// API Structure
export const structuresApi = {
  getAll: () => fetchApi<Structure[]>('/structures'),
  getById: (id: number) => fetchApi<Structure>(`/structures/${id}`),
  create: (data: StructureInput) => fetchApi<Structure>('/structures', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<StructureInput>) => fetchApi<Structure>(`/structures/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/structures/${id}`, {
    method: 'DELETE',
  }),
};

// =====================
// Admin API Endpoints
// =====================

// API Modules - correspond à /api/v1/modules du backend
export const modulesApi = {
  getAll: () => fetchApi<Module[]>('/v1/modules'),
  getById: (id: number) => fetchApi<Module>(`/v1/modules/${id}`),
  create: (data: ModuleInput) => fetchApi<Module>('/v1/modules', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<ModuleInput>) => fetchApi<Module>(`/v1/modules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<string>(`/v1/modules/${id}`, {
    method: 'DELETE',
  }),
};

// API SousModules - correspond à /api/v1/sousModules du backend
export const sousModulesApi = {
  getAll: () => fetchApi<SousModule[]>('/v1/sousModules'),
  getById: (id: number) => fetchApi<SousModule>(`/v1/sousModules/${id}`),
  create: (data: SousModuleInput) => fetchApi<SousModule>('/v1/sousModules', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<SousModuleInput>) => fetchApi<SousModule>(`/v1/sousModules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<string>(`/v1/sousModules/${id}`, {
    method: 'DELETE',
  }),
};

// API Evnmt
export const evnmtApi = {
  getAll: () => fetchApi<Evnmt[]>('/admin/evnmts'),
  getById: (id: number) => fetchApi<Evnmt>(`/admin/evnmts/${id}`),
  create: (data: EvnmtInput) => fetchApi<Evnmt>('/admin/evnmts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<EvnmtInput>) => fetchApi<Evnmt>(`/admin/evnmts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/admin/evnmts/${id}`, {
    method: 'DELETE',
  }),
};

// API Users (Admin)
export const usersApi = {
  getAll: () => fetchApi<Users[]>('/admin/users'),
  getById: (id: number) => fetchApi<Users>(`/admin/users/${id}`),
  create: (data: UsersInput) => fetchApi<Users>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<UsersInput>) => fetchApi<Users>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchApi<void>(`/admin/users/${id}`, {
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
