// API Supabase pour le mode production (Lovable Cloud)
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

// =====================
// Types Supabase
// =====================

export type SupabaseRoom = Tables['rooms']['Row'];
export type SupabaseGuest = Tables['guests']['Row'];
export type SupabaseReservation = Tables['reservations']['Row'];
export type SupabaseInvoice = Tables['invoices']['Row'];
export type SupabasePayment = Tables['payments']['Row'];
export type SupabaseMenuItem = Tables['menu_items']['Row'];
export type SupabaseRestaurantOrder = Tables['restaurant_orders']['Row'];
export type SupabaseRestaurantTable = Tables['restaurant_tables']['Row'];

// =====================
// API Rooms (Supabase)
// =====================
export const supabaseRoomsApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  
  create: async (room: Tables['rooms']['Insert']) => {
    const { data, error } = await supabase.from('rooms').insert(room).select().single();
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, room: Tables['rooms']['Update']) => {
    const { data, error } = await supabase.from('rooms').update(room).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) throw error;
  },
};

// =====================
// API Guests (Supabase)
// =====================
export const supabaseGuestsApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('guests').select('*');
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase.from('guests').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  
  create: async (guest: Tables['guests']['Insert']) => {
    const { data, error } = await supabase.from('guests').insert(guest).select().single();
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, guest: Tables['guests']['Update']) => {
    const { data, error } = await supabase.from('guests').update(guest).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (error) throw error;
  },
};

// =====================
// API Reservations (Supabase)
// =====================
export const supabaseReservationsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `);
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        guest:guests(*),
        room:rooms(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  
  create: async (reservation: Tables['reservations']['Insert']) => {
    const { data, error } = await supabase.from('reservations').insert(reservation).select().single();
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, reservation: Tables['reservations']['Update']) => {
    const { data, error } = await supabase.from('reservations').update(reservation).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) throw error;
  },
  
  getTodayArrivals: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('reservations')
      .select(`*, guest:guests(*), room:rooms(*)`)
      .eq('check_in', today);
    if (error) throw error;
    return data || [];
  },
  
  getTodayDepartures: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('reservations')
      .select(`*, guest:guests(*), room:rooms(*)`)
      .eq('check_out', today);
    if (error) throw error;
    return data || [];
  },
};

// =====================
// API Invoices (Supabase)
// =====================
export const supabaseInvoicesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        guest:guests(*),
        reservation:reservations(*)
      `);
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  
  create: async (invoice: Tables['invoices']['Insert']) => {
    const { data, error } = await supabase.from('invoices').insert(invoice).select().single();
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, invoice: Tables['invoices']['Update']) => {
    const { data, error } = await supabase.from('invoices').update(invoice).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
  },
};

// =====================
// API Payments (Supabase)
// =====================
export const supabasePaymentsApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('payments').select(`*, invoice:invoices(*)`);
    if (error) throw error;
    return data || [];
  },
  
  create: async (payment: Tables['payments']['Insert']) => {
    const { data, error } = await supabase.from('payments').insert(payment).select().single();
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) throw error;
  },
};

// =====================
// API Restaurant (Supabase)
// =====================
export const supabaseRestaurantApi = {
  // Menu Items
  getMenuItems: async () => {
    const { data, error } = await supabase.from('menu_items').select('*');
    if (error) throw error;
    return data || [];
  },
  
  createMenuItem: async (item: Tables['menu_items']['Insert']) => {
    const { data, error } = await supabase.from('menu_items').insert(item).select().single();
    if (error) throw error;
    return data;
  },
  
  updateMenuItem: async (id: string, item: Tables['menu_items']['Update']) => {
    const { data, error } = await supabase.from('menu_items').update(item).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  deleteMenuItem: async (id: string) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) throw error;
  },
  
  // Tables
  getTables: async () => {
    const { data, error } = await supabase.from('restaurant_tables').select('*');
    if (error) throw error;
    return data || [];
  },
  
  createTable: async (table: Tables['restaurant_tables']['Insert']) => {
    const { data, error } = await supabase.from('restaurant_tables').insert(table).select().single();
    if (error) throw error;
    return data;
  },
  
  updateTable: async (id: string, table: Tables['restaurant_tables']['Update']) => {
    const { data, error } = await supabase.from('restaurant_tables').update(table).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  deleteTable: async (id: string) => {
    const { error } = await supabase.from('restaurant_tables').delete().eq('id', id);
    if (error) throw error;
  },
  
  // Orders
  getOrders: async () => {
    const { data, error } = await supabase
      .from('restaurant_orders')
      .select(`
        *,
        table:restaurant_tables(*),
        guest:guests(*),
        items:order_items(*, menu_item:menu_items(*))
      `);
    if (error) throw error;
    return data || [];
  },
  
  createOrder: async (order: Tables['restaurant_orders']['Insert']) => {
    const { data, error } = await supabase.from('restaurant_orders').insert(order).select().single();
    if (error) throw error;
    return data;
  },
  
  updateOrder: async (id: string, order: Tables['restaurant_orders']['Update']) => {
    const { data, error } = await supabase.from('restaurant_orders').update(order).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  deleteOrder: async (id: string) => {
    const { error } = await supabase.from('restaurant_orders').delete().eq('id', id);
    if (error) throw error;
  },
};

// =====================
// Auth API (Supabase)
// =====================
export const supabaseAuthApi = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  
  signup: async (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata?.firstName,
          last_name: metadata?.lastName,
        },
      },
    });
    if (error) throw error;
    return data;
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
  
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
