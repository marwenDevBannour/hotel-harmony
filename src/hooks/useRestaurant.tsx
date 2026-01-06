import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';
export type TableLocation = 'intérieur' | 'terrasse' | 'privé';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
export type OrderType = 'dine_in' | 'room_service' | 'takeaway';
export type MenuCategory = 'entrée' | 'plat' | 'dessert' | 'boisson' | 'apéritif';

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  location: TableLocation;
  status: TableStatus;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  category: MenuCategory;
  price: number;
  available: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  status: string;
  created_at: string;
  menu_item?: MenuItem;
}

export interface RestaurantOrder {
  id: string;
  order_number: string;
  table_id: string | null;
  room_id: string | null;
  guest_id: string | null;
  order_type: OrderType;
  status: OrderStatus;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  notes: string | null;
  waiter_id: string | null;
  created_at: string;
  updated_at: string;
  table?: RestaurantTable;
  room?: { id: string; number: string };
  guest?: { id: string; first_name: string; last_name: string };
  items?: OrderItem[];
}

// Tables hooks
export const useRestaurantTables = () => {
  return useQuery({
    queryKey: ['restaurant-tables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('number');
      
      if (error) throw error;
      return data as RestaurantTable[];
    },
  });
};

export const useUpdateTableStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TableStatus }) => {
      const { data, error } = await supabase
        .from('restaurant_tables')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
    },
  });
};

// Menu hooks
export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category')
        .order('name');
      
      if (error) throw error;
      return data as MenuItem[];
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Partial<MenuItem>) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(item as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
};

// Orders hooks
export const useRestaurantOrders = () => {
  return useQuery({
    queryKey: ['restaurant-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_orders')
        .select(`
          *,
          table:restaurant_tables(id, number, location),
          room:rooms(id, number),
          guest:guests(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RestaurantOrder[];
    },
  });
};

export const useActiveOrders = () => {
  return useQuery({
    queryKey: ['active-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_orders')
        .select(`
          *,
          table:restaurant_tables(id, number, location),
          room:rooms(id, number),
          guest:guests(id, first_name, last_name),
          items:order_items(*, menu_item:menu_items(*))
        `)
        .in('status', ['pending', 'preparing', 'ready', 'served'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RestaurantOrder[];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ order, items }: { 
      order: Partial<RestaurantOrder>; 
      items: Array<{ menu_item_id: string; quantity: number; unit_price: number; notes?: string }> 
    }) => {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('restaurant_orders')
        .insert(order as any)
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Add items
      if (items.length > 0) {
        const orderItems = items.map(item => ({
          order_id: orderData.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price,
          notes: item.notes || null,
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
      }
      
      return orderData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({ queryKey: ['active-orders'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('restaurant_orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({ queryKey: ['active-orders'] });
    },
  });
};

export const useRestaurantStats = () => {
  return useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const [tablesRes, ordersRes] = await Promise.all([
        supabase.from('restaurant_tables').select('status'),
        supabase
          .from('restaurant_orders')
          .select('status, total_amount')
          .gte('created_at', today)
      ]);
      
      if (tablesRes.error) throw tablesRes.error;
      if (ordersRes.error) throw ordersRes.error;
      
      const tables = tablesRes.data;
      const orders = ordersRes.data;
      
      return {
        totalTables: tables.length,
        availableTables: tables.filter(t => t.status === 'available').length,
        occupiedTables: tables.filter(t => t.status === 'occupied').length,
        todayOrders: orders.length,
        todayRevenue: orders
          .filter(o => o.status === 'paid')
          .reduce((acc, o) => acc + Number(o.total_amount), 0),
        activeOrders: orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length,
      };
    },
  });
};
