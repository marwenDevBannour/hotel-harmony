import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types pour le restaurant
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';
export type TableLocation = 'intérieur' | 'terrasse' | 'privé';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
export type MenuCategory = 'entrée' | 'plat' | 'dessert' | 'boisson' | 'apéritif';

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  location: TableLocation;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description?: string;
  available: boolean;
}

export interface RestaurantOrder {
  id: string;
  order_number: string;
  order_type: 'dine_in' | 'room_service' | 'takeaway';
  status: OrderStatus;
  table_id?: string;
  room_id?: string;
  guest_id?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  created_at: string;
  table?: RestaurantTable;
  room?: { id: string; number: string };
  guest?: { id: string; first_name: string; last_name: string };
  items?: { id: string; menu_item_id: string; quantity: number }[];
}

export interface RestaurantStats {
  totalTables: number;
  availableTables: number;
  occupiedTables: number;
  activeOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

// Note: Restaurant functionality not in current backend - placeholder hooks

export const useRestaurantTables = () => {
  return useQuery({
    queryKey: ['restaurant-tables'],
    queryFn: async (): Promise<RestaurantTable[]> => [],
  });
};

export const useUpdateTableStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TableStatus }) => ({ id, status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] }),
  });
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (table: Omit<RestaurantTable, 'id'>) => ({ ...table, id: Date.now().toString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] }),
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...table }: Partial<RestaurantTable> & { id: string }) => ({ id, ...table }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] }),
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] }),
  });
};

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async (): Promise<MenuItem[]> => [],
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<MenuItem, 'id'>) => ({ ...item, id: Date.now().toString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu-items'] }),
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<MenuItem> & { id: string }) => ({ id, ...item }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu-items'] }),
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menu-items'] }),
  });
};

export const useRestaurantOrders = () => {
  return useQuery({
    queryKey: ['restaurant-orders'],
    queryFn: async (): Promise<RestaurantOrder[]> => [],
  });
};

export const useActiveOrders = () => {
  return useQuery({
    queryKey: ['active-orders'],
    queryFn: async (): Promise<RestaurantOrder[]> => [],
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { order: any; items: any[] }) => data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({ queryKey: ['active-orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => ({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({ queryKey: ['active-orders'] });
    },
  });
};

export const useRestaurantStats = () => {
  return useQuery({
    queryKey: ['restaurant-stats'],
    queryFn: async (): Promise<RestaurantStats> => ({
      totalTables: 0,
      availableTables: 0,
      occupiedTables: 0,
      activeOrders: 0,
      todayOrders: 0,
      todayRevenue: 0,
    }),
  });
};
