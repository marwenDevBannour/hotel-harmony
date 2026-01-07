import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  restaurantTablesApi, 
  menuItemsApi, 
  ordersApi,
  RestaurantTable as ApiTable,
  MenuItem as ApiMenuItem,
  RestaurantOrder as ApiOrder,
  CreateOrderInput
} from '@/services/api';

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

// Transform API tables to frontend format
const transformTable = (table: ApiTable): RestaurantTable => ({
  id: table.id,
  number: table.number,
  capacity: table.capacity,
  location: (table.location || 'intérieur') as TableLocation,
  status: table.status as TableStatus,
  created_at: table.createdAt || new Date().toISOString(),
  updated_at: table.updatedAt || new Date().toISOString(),
});

// Transform API menu item to frontend format
const transformMenuItem = (item: ApiMenuItem): MenuItem => ({
  id: item.id,
  name: item.name,
  description: item.description || null,
  category: item.category as MenuCategory,
  price: item.price,
  available: item.available,
  image_url: item.imageUrl || null,
  created_at: item.createdAt || new Date().toISOString(),
  updated_at: item.updatedAt || new Date().toISOString(),
});

// Transform API order to frontend format
const transformOrder = (order: ApiOrder): RestaurantOrder => ({
  id: order.id,
  order_number: order.orderNumber,
  table_id: order.tableId || null,
  room_id: order.roomId || null,
  guest_id: order.guestId || null,
  order_type: order.orderType as OrderType,
  status: order.status as OrderStatus,
  subtotal: order.subtotal,
  tax_amount: order.taxAmount,
  total_amount: order.totalAmount,
  notes: order.notes || null,
  waiter_id: null,
  created_at: order.createdAt || new Date().toISOString(),
  updated_at: order.updatedAt || new Date().toISOString(),
  table: order.table ? transformTable(order.table) : undefined,
  room: order.room ? { id: order.room.id, number: order.room.number } : undefined,
  guest: order.guest ? { 
    id: order.guest.id, 
    first_name: order.guest.firstName, 
    last_name: order.guest.lastName 
  } : undefined,
  items: order.items?.map(item => ({
    id: item.id,
    order_id: item.orderId,
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
    notes: item.notes || null,
    status: item.status,
    created_at: new Date().toISOString(),
    menu_item: item.menuItem ? transformMenuItem(item.menuItem) : undefined,
  })),
});

// Tables hooks
export const useRestaurantTables = () => {
  return useQuery({
    queryKey: ['restaurant-tables'],
    queryFn: async () => {
      const data = await restaurantTablesApi.getAll();
      return data.map(transformTable);
    },
  });
};

export const useUpdateTableStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TableStatus }) => {
      return restaurantTablesApi.updateStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
    },
  });
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (table: Omit<RestaurantTable, 'id' | 'created_at' | 'updated_at'>) => {
      return restaurantTablesApi.create({
        number: table.number,
        capacity: table.capacity,
        location: table.location,
        status: table.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...table }: Partial<RestaurantTable> & { id: string }) => {
      return restaurantTablesApi.update(id, {
        number: table.number,
        capacity: table.capacity,
        location: table.location,
        status: table.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-tables'] });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => restaurantTablesApi.delete(id),
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
      const data = await menuItemsApi.getAll();
      return data.map(transformMenuItem);
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
      return menuItemsApi.create({
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description || undefined,
        imageUrl: item.image_url || undefined,
        available: item.available,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<MenuItem> & { id: string }) => {
      return menuItemsApi.update(id, {
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description || undefined,
        imageUrl: item.image_url || undefined,
        available: item.available,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => menuItemsApi.delete(id),
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
      const data = await ordersApi.getAll();
      return data.map(transformOrder);
    },
  });
};

export const useActiveOrders = () => {
  return useQuery({
    queryKey: ['active-orders'],
    queryFn: async () => {
      const data = await ordersApi.getActive();
      return data.map(transformOrder);
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
      const apiOrder: CreateOrderInput = {
        orderType: order.order_type || 'dine_in',
        tableId: order.table_id || undefined,
        roomId: order.room_id || undefined,
        guestId: order.guest_id || undefined,
        notes: order.notes || undefined,
        items: items.map(item => ({
          menuItemId: item.menu_item_id,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          totalPrice: item.quantity * item.unit_price,
          notes: item.notes,
        })),
      };
      return ordersApi.create(apiOrder);
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
      return ordersApi.updateStatus(id, status);
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
      const [tables, orders] = await Promise.all([
        restaurantTablesApi.getAll(),
        ordersApi.getAll(),
      ]);
      
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(o => o.createdAt?.startsWith(today));
      
      return {
        totalTables: tables.length,
        availableTables: tables.filter(t => t.status === 'available').length,
        occupiedTables: tables.filter(t => t.status === 'occupied').length,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders
          .filter(o => o.status === 'paid')
          .reduce((acc, o) => acc + Number(o.totalAmount), 0),
        activeOrders: todayOrders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length,
      };
    },
  });
};
