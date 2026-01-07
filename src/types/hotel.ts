// Types correspondant aux entités du backend Spring Boot

// =====================
// Admin entities
// =====================

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

// =====================
// Structure entities
// =====================

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

// =====================
// Hotel entities
// =====================

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
// Dashboard Stats
// =====================

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
