import MainLayout from '@/components/layout/MainLayout';
import { 
  useRestaurantTables, 
  useActiveOrders, 
  useRestaurantStats,
  useMenuItems,
  useUpdateOrderStatus,
  RestaurantTable,
  RestaurantOrder,
  TableStatus,
  OrderStatus,
  MenuItem,
  MenuCategory
} from '@/hooks/useRestaurant';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchFilterBar } from '@/components/filters/SearchFilterBar';
import { useSearchFilter, FilterConfig } from '@/hooks/useSearchFilter';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search,
  Utensils,
  Users,
  Clock,
  ChefHat,
  Coffee,
  Wine,
  Salad,
  Beef,
  Cake,
  MoreVertical,
  BedDouble,
  MapPin,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import TableFormModal from '@/components/restaurant/TableFormModal';
import MenuItemFormModal from '@/components/restaurant/MenuItemFormModal';
import { OrderFormModal } from '@/components/restaurant/OrderFormModal';

const tableStatusConfig: Record<TableStatus, { 
  label: string; 
  color: string;
  bgColor: string;
}> = {
  available: { label: 'Disponible', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  occupied: { label: 'Occupée', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  reserved: { label: 'Réservée', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  cleaning: { label: 'Nettoyage', color: 'text-purple-600', bgColor: 'bg-purple-100' },
};

const orderStatusConfig: Record<OrderStatus, { 
  label: string; 
  className: string;
}> = {
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700' },
  preparing: { label: 'En préparation', className: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Prêt', className: 'bg-emerald-100 text-emerald-700' },
  served: { label: 'Servi', className: 'bg-purple-100 text-purple-700' },
  paid: { label: 'Payé', className: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-700' },
};

const categoryIcons: Record<MenuCategory, React.ElementType> = {
  'entrée': Salad,
  'plat': Beef,
  'dessert': Cake,
  'boisson': Coffee,
  'apéritif': Wine,
};

const categoryLabels: Record<MenuCategory, string> = {
  'entrée': 'Entrées',
  'plat': 'Plats',
  'dessert': 'Desserts',
  'boisson': 'Boissons',
  'apéritif': 'Apéritifs',
};

const locationLabels: Record<string, string> = {
  'intérieur': 'Intérieur',
  'terrasse': 'Terrasse',
  'privé': 'Salon Privé',
};

// Table Card Component
const TableCard = ({ table, onNewOrder }: { table: RestaurantTable; onNewOrder: (table: RestaurantTable) => void }) => {
  const status = tableStatusConfig[table.status];

  return (
    <div className={cn(
      "card-elevated card-hover p-4 text-center transition-all",
      table.status === 'available' && "cursor-pointer hover:border-gold"
    )}>
      <div className={cn(
        "mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full",
        status.bgColor
      )}>
        <span className="font-display text-2xl font-bold">{table.number}</span>
      </div>
      <p className={cn("text-sm font-medium", status.color)}>{status.label}</p>
      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        <span>{table.capacity} pers.</span>
        <span>•</span>
        <MapPin className="h-3 w-3" />
        <span>{locationLabels[table.location] || table.location}</span>
      </div>
      {table.status === 'available' && (
        <Button 
          variant="gold" 
          size="sm" 
          className="mt-3 w-full"
          onClick={() => onNewOrder(table)}
        >
          Nouvelle Commande
        </Button>
      )}
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order, onStatusChange, isUpdating }: { 
  order: RestaurantOrder; 
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  isUpdating: boolean;
}) => {
  const status = orderStatusConfig[order.status];

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'served',
      served: 'paid',
      paid: null,
      cancelled: null,
    };
    return statusFlow[currentStatus];
  };

  const getActionButton = () => {
    const actions: Record<OrderStatus, { label: string; variant: 'outline' | 'gold' } | null> = {
      pending: { label: 'Préparer', variant: 'outline' },
      preparing: { label: 'Prêt', variant: 'outline' },
      ready: { label: 'Servir', variant: 'gold' },
      served: { label: 'Encaisser', variant: 'gold' },
      paid: null,
      cancelled: null,
    };
    return actions[order.status];
  };

  const action = getActionButton();
  const nextStatus = getNextStatus(order.status);

  return (
    <div className="card-elevated card-hover overflow-hidden">
      <div className="flex items-start justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
            {order.order_type === 'room_service' ? (
              <BedDouble className="h-5 w-5 text-gold" />
            ) : (
              <Utensils className="h-5 w-5 text-gold" />
            )}
          </div>
          <div>
            <p className="font-semibold">{order.order_number}</p>
            <p className="text-sm text-muted-foreground">
              {order.order_type === 'room_service' 
                ? `Chambre ${order.room?.number}` 
                : `Table ${order.table?.number}`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            status.className
          )}>
            {status.label}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {order.guest && (
          <p className="mb-2 text-sm">
            Client: <span className="font-medium">{order.guest.first_name} {order.guest.last_name}</span>
          </p>
        )}

        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="mb-3 rounded-lg bg-secondary p-2 text-center">
          <p className="text-xs text-muted-foreground">Articles</p>
          <p className="font-semibold">{order.items?.length || 0}</p>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-display text-xl font-bold">
              {Number(order.total_amount).toLocaleString('fr-FR')} €
            </p>
          </div>
          <div className="flex gap-2">
            {action && nextStatus && (
              <Button 
                variant={action.variant} 
                size="sm"
                disabled={isUpdating}
                onClick={() => onStatusChange(order.id, nextStatus)}
              >
                {action.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Menu Item Card
const MenuItemCard = ({ item }: { item: MenuItem }) => {
  const Icon = categoryIcons[item.category] || Utensils;

  return (
    <div className={cn(
      "card-elevated card-hover p-4",
      !item.available && "opacity-50"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{categoryLabels[item.category]}</p>
          </div>
        </div>
        <p className="font-display text-lg font-bold text-gold">
          {Number(item.price).toLocaleString('fr-FR')} €
        </p>
      </div>
      {item.description && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      )}
      {!item.available && (
        <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
          Indisponible
        </span>
      )}
    </div>
  );
};

const Restaurant = () => {
  const { data: tables, isLoading: tablesLoading } = useRestaurantTables();
  const { data: activeOrders, isLoading: ordersLoading } = useActiveOrders();
  const { data: menuItems, isLoading: menuLoading } = useMenuItems();
  const { data: stats, isLoading: statsLoading } = useRestaurantStats();
  const updateOrderStatus = useUpdateOrderStatus();

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [orderPreselectedTable, setOrderPreselectedTable] = useState<RestaurantTable | null>(null);

  // Table filters
  const tableFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Statut',
      options: Object.entries(tableStatusConfig).map(([value, { label }]) => ({ value, label })),
    },
    {
      key: 'location',
      label: 'Emplacement',
      options: Object.entries(locationLabels).map(([value, label]) => ({ value, label })),
    },
  ];

  const {
    filteredData: filteredTables,
    searchQuery: tableSearch,
    setSearchQuery: setTableSearch,
    activeFilters: tableActiveFilters,
    setFilter: setTableFilter,
    clearFilters: clearTableFilters,
    hasActiveFilters: hasTableFilters,
  } = useSearchFilter({
    data: tables,
    searchFields: ['number'],
    filters: tableFilters,
  });

  // Order filters
  const orderFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Statut',
      options: Object.entries(orderStatusConfig).map(([value, { label }]) => ({ value, label })),
    },
    {
      key: 'order_type',
      label: 'Type',
      options: [
        { value: 'dine_in', label: 'Sur place' },
        { value: 'room_service', label: 'Room Service' },
        { value: 'takeaway', label: 'À emporter' },
      ],
    },
  ];

  const {
    filteredData: filteredOrders,
    searchQuery: orderSearch,
    setSearchQuery: setOrderSearch,
    activeFilters: orderActiveFilters,
    setFilter: setOrderFilter,
    clearFilters: clearOrderFilters,
    hasActiveFilters: hasOrderFilters,
  } = useSearchFilter({
    data: activeOrders,
    searchFields: ['order_number', 'guest.first_name', 'guest.last_name', 'table.number', 'room.number'],
    filters: orderFilters,
  });

  // Menu filters
  const menuFilters: FilterConfig[] = [
    {
      key: 'category',
      label: 'Catégorie',
      options: Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
    },
    {
      key: 'available',
      label: 'Disponibilité',
      options: [
        { value: 'true', label: 'Disponible' },
        { value: 'false', label: 'Indisponible' },
      ],
    },
  ];

  const {
    filteredData: filteredMenu,
    searchQuery: menuSearch,
    setSearchQuery: setMenuSearch,
    activeFilters: menuActiveFilters,
    setFilter: setMenuFilter,
    clearFilters: clearMenuFilters,
    hasActiveFilters: hasMenuFilters,
  } = useSearchFilter({
    data: menuItems,
    searchFields: ['name', 'description'],
    filters: menuFilters,
  });

  const handleNewOrder = (table: RestaurantTable) => {
    setOrderPreselectedTable(table);
    setOrderModalOpen(true);
  };

  const handleRoomService = () => {
    setOrderPreselectedTable(null);
    setOrderModalOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status: newStatus });
      const statusLabels: Record<OrderStatus, string> = {
        pending: 'en attente',
        preparing: 'en préparation',
        ready: 'prête',
        served: 'servie',
        paid: 'payée',
        cancelled: 'annulée',
      };
      toast({
        title: "Statut mis à jour",
        description: `Commande ${statusLabels[newStatus]}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout title="Restaurant" subtitle="Gestion des tables, commandes et menu">
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-5">
        {statsLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Tables Disponibles</p>
              <p className="font-display text-2xl font-bold text-emerald-600">
                {stats?.availableTables || 0}/{stats?.totalTables || 0}
              </p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Tables Occupées</p>
              <p className="font-display text-2xl font-bold text-blue-600">
                {stats?.occupiedTables || 0}
              </p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Commandes Actives</p>
              <p className="font-display text-2xl font-bold text-amber-600">
                {stats?.activeOrders || 0}
              </p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Commandes Aujourd'hui</p>
              <p className="font-display text-2xl font-bold">{stats?.todayOrders || 0}</p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">CA Aujourd'hui</p>
              <p className="font-display text-2xl font-bold text-gold">
                {stats?.todayRevenue?.toLocaleString('fr-FR') || 0} €
              </p>
            </div>
          </>
        )}
      </div>

      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="tables" className="gap-2">
            <Users className="h-4 w-4" />
            Tables
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ChefHat className="h-4 w-4" />
            Commandes
          </TabsTrigger>
          <TabsTrigger value="menu" className="gap-2">
            <Utensils className="h-4 w-4" />
            Menu
          </TabsTrigger>
        </TabsList>

        {/* Tables Tab */}
        <TabsContent value="tables">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchFilterBar
              searchPlaceholder="Rechercher une table..."
              searchQuery={tableSearch}
              onSearchChange={setTableSearch}
              filters={tableFilters}
              activeFilters={tableActiveFilters}
              onFilterChange={setTableFilter}
              onClearFilters={clearTableFilters}
              hasActiveFilters={hasTableFilters}
            />
            <Button variant="gold" className="gap-2" onClick={() => { setSelectedTable(null); setTableModalOpen(true); }}>
              <Plus className="h-4 w-4" />
              Ajouter une Table
            </Button>
          </div>

          {tablesLoading ? (
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filteredTables?.map((table, index) => (
                <div 
                  key={table.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCard table={table} onNewOrder={handleNewOrder} />
                </div>
              ))}
            </div>
          )}

          {!tablesLoading && filteredTables?.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">Aucune table trouvée</p>
              {hasTableFilters && (
                <Button variant="link" onClick={clearTableFilters} className="mt-2">
                  Effacer les filtres
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchFilterBar
              searchPlaceholder="Rechercher une commande..."
              searchQuery={orderSearch}
              onSearchChange={setOrderSearch}
              filters={orderFilters}
              activeFilters={orderActiveFilters}
              onFilterChange={setOrderFilter}
              onClearFilters={clearOrderFilters}
              hasActiveFilters={hasOrderFilters}
            />
            <Button variant="gold" className="gap-2" onClick={handleRoomService}>
              <Plus className="h-4 w-4" />
              Room Service
            </Button>
          </div>

          {ordersLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredOrders?.map((order, index) => (
                <div 
                  key={order.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <OrderCard 
                    order={order} 
                    onStatusChange={handleStatusChange}
                    isUpdating={updateOrderStatus.isPending}
                  />
                </div>
              ))}
            </div>
          )}

          {!ordersLoading && filteredOrders?.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
              <ChefHat className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">Aucune commande trouvée</p>
              {hasOrderFilters && (
                <Button variant="link" onClick={clearOrderFilters} className="mt-2">
                  Effacer les filtres
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchFilterBar
              searchPlaceholder="Rechercher un article..."
              searchQuery={menuSearch}
              onSearchChange={setMenuSearch}
              filters={menuFilters}
              activeFilters={menuActiveFilters}
              onFilterChange={setMenuFilter}
              onClearFilters={clearMenuFilters}
              hasActiveFilters={hasMenuFilters}
            />
            <Button variant="gold" className="gap-2" onClick={() => { setSelectedMenuItem(null); setMenuModalOpen(true); }}>
              <Plus className="h-4 w-4" />
              Ajouter un Article
            </Button>
          </div>

          {menuLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMenu?.map((item, index) => (
                <div 
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <MenuItemCard item={item} />
                </div>
              ))}
            </div>
          )}

          {!menuLoading && filteredMenu?.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
              <Utensils className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">Aucun article trouvé</p>
              {hasMenuFilters && (
                <Button variant="link" onClick={clearMenuFilters} className="mt-2">
                  Effacer les filtres
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TableFormModal 
        open={tableModalOpen} 
        onOpenChange={setTableModalOpen}
        table={selectedTable}
      />

      <MenuItemFormModal 
        open={menuModalOpen} 
        onOpenChange={setMenuModalOpen}
        menuItem={selectedMenuItem}
      />

      <OrderFormModal 
        open={orderModalOpen} 
        onOpenChange={setOrderModalOpen}
        preselectedTable={orderPreselectedTable}
      />
    </MainLayout>
  );
};

export default Restaurant;
