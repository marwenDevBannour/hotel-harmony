import MainLayout from '@/components/layout/MainLayout';
import { useRooms, Room, RoomStatus, RoomType } from '@/hooks/useRooms';
import { RoomFormModal } from '@/components/rooms/RoomFormModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchFilterBar } from '@/components/filters/SearchFilterBar';
import { useSearchFilter, FilterConfig } from '@/hooks/useSearchFilter';
import { exportToCSV, exportToExcel, roomsExportColumns } from '@/lib/exportUtils';
import { cn } from '@/lib/utils';
import { 
  BedDouble, 
  Plus, 
  Wifi,
  Tv,
  Wine,
  Waves,
  Sparkles,
  Pencil
} from 'lucide-react';
import { useState, useMemo } from 'react';

const statusConfig: Record<RoomStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  borderColor: string;
}> = {
  available: { 
    label: 'Disponible', 
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  },
  occupied: { 
    label: 'Occupée', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  cleaning: { 
    label: 'Nettoyage', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  maintenance: { 
    label: 'Maintenance', 
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  reserved: { 
    label: 'Réservée', 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
};

const typeLabels: Record<RoomType, string> = {
  standard: 'Standard',
  superior: 'Supérieure',
  deluxe: 'Deluxe',
  suite: 'Suite',
  presidential: 'Présidentielle',
};

const amenityIcons: Record<string, React.ElementType> = {
  'WiFi': Wifi,
  'TV': Tv,
  'Mini-bar': Wine,
  'Sea View': Waves,
  'Jacuzzi': Waves,
};

const RoomCard = ({ room, onEdit }: { room: Room; onEdit: (room: Room) => void }) => {
  const status = statusConfig[room.status];

  return (
    <div className={cn(
      "card-elevated card-hover overflow-hidden",
      status.borderColor
    )}>
      {/* Header */}
      <div className={cn("flex items-center justify-between p-4", status.bgColor)}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-sm">
            <span className="font-display text-xl font-bold">{room.number}</span>
          </div>
          <div>
            <p className="font-medium capitalize text-foreground">{typeLabels[room.type]}</p>
            <p className="text-xs text-muted-foreground">Étage {room.floor} • {room.capacity} pers.</p>
          </div>
        </div>
        <span className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold",
          status.bgColor,
          status.color
        )}>
          {status.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Amenities */}
        <div className="mb-4 flex flex-wrap gap-2">
          {room.amenities?.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity] || Sparkles;
            return (
              <span 
                key={amenity}
                className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
              >
                <Icon className="h-3 w-3" />
                {amenity}
              </span>
            );
          })}
          {room.amenities && room.amenities.length > 4 && (
            <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
              +{room.amenities.length - 4}
            </span>
          )}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-2xl font-bold text-foreground">
              {Number(room.price_per_night)} €
            </span>
            <span className="text-sm text-muted-foreground"> / nuit</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(room)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button 
              variant={room.status === 'available' ? 'gold' : 'outline'} 
              size="sm"
            >
              {room.status === 'available' ? 'Réserver' : 'Détails'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Rooms = () => {
  const { data: rooms, isLoading } = useRooms();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Get unique floors for filter
  const floorOptions = useMemo(() => {
    if (!rooms) return [];
    const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
    return floors.map(f => ({ value: String(f), label: `Étage ${f}` }));
  }, [rooms]);

  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Statut',
      options: Object.entries(statusConfig).map(([value, { label }]) => ({ value, label })),
    },
    {
      key: 'type',
      label: 'Type',
      options: Object.entries(typeLabels).map(([value, label]) => ({ value, label })),
    },
    {
      key: 'floor',
      label: 'Étage',
      options: floorOptions,
    },
  ];

  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useSearchFilter({
    data: rooms,
    searchFields: ['number', 'type', 'description'],
    filters,
    persistInUrl: true,
  });

  const statusCounts = rooms?.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, {} as Record<RoomStatus, number>) || {};

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  return (
    <MainLayout title="Gestion des Chambres" subtitle="Gérez l'inventaire et l'état des chambres">
      {/* Header Actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchFilterBar
          searchPlaceholder="Rechercher une chambre..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          onExportCSV={() => exportToCSV(filteredData || [], roomsExportColumns, 'chambres')}
          onExportExcel={() => exportToExcel(filteredData || [], roomsExportColumns, 'chambres')}
        />
        <Button variant="gold" className="gap-2" onClick={handleAddRoom}>
          <Plus className="h-4 w-4" />
          Ajouter une Chambre
        </Button>
      </div>

      {/* Status Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('status', 'all')}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            (!activeFilters.status || activeFilters.status === 'all')
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          Toutes ({rooms?.length || 0})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setFilter('status', status)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeFilters.status === status 
                ? cn(config.bgColor, config.color, "shadow-sm") 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {config.label} ({statusCounts[status as RoomStatus] || 0})
          </button>
        ))}
      </div>

      {/* Room Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredData?.map((room, index) => (
            <div 
              key={room.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <RoomCard room={room} onEdit={handleEditRoom} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredData?.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
          <BedDouble className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Aucune chambre trouvée</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Effacer les filtres
            </Button>
          )}
        </div>
      )}

      <RoomFormModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        room={selectedRoom}
      />
    </MainLayout>
  );
};

export default Rooms;
