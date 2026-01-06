import MainLayout from '@/components/layout/MainLayout';
import { mockRooms } from '@/data/mockData';
import { Room, RoomStatus, RoomType } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  BedDouble, 
  Plus, 
  Search, 
  Filter,
  Wifi,
  Tv,
  Wine,
  Waves,
  Sparkles,
  Check,
  Wrench,
  Calendar,
  User
} from 'lucide-react';
import { useState } from 'react';

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

const RoomCard = ({ room }: { room: Room }) => {
  const status = statusConfig[room.status];

  return (
    <div className={cn(
      "card-elevated card-hover overflow-hidden",
      status.borderColor
    )}>
      {/* Header */}
      <div className={cn("flex items-center justify-between p-4", status.bgColor)}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-sm",
          )}>
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
        {/* Guest Info */}
        {room.currentGuest && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted p-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">{room.currentGuest}</p>
              <p className="text-xs text-muted-foreground">
                Check-out: {new Date(room.checkoutDate!).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="mb-4 flex flex-wrap gap-2">
          {room.amenities.slice(0, 4).map((amenity) => {
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
          {room.amenities.length > 4 && (
            <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
              +{room.amenities.length - 4}
            </span>
          )}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-2xl font-bold text-foreground">
              {room.pricePerNight} €
            </span>
            <span className="text-sm text-muted-foreground"> / nuit</span>
          </div>
          <Button 
            variant={room.status === 'available' ? 'gold' : 'outline'} 
            size="sm"
          >
            {room.status === 'available' ? 'Réserver' : 'Détails'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Rooms = () => {
  const [filter, setFilter] = useState<RoomStatus | 'all'>('all');

  const filteredRooms = filter === 'all' 
    ? mockRooms 
    : mockRooms.filter(r => r.status === filter);

  const statusCounts = mockRooms.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, {} as Record<RoomStatus, number>);

  return (
    <MainLayout title="Gestion des Chambres" subtitle="Gérez l'inventaire et l'état des chambres">
      {/* Header Actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une chambre..." 
              className="w-64 pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
        <Button variant="gold" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une Chambre
        </Button>
      </div>

      {/* Status Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            filter === 'all' 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          Toutes ({mockRooms.length})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setFilter(status as RoomStatus)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              filter === status 
                ? cn(config.bgColor, config.color, "shadow-sm") 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {config.label} ({statusCounts[status as RoomStatus] || 0})
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRooms.map((room, index) => (
          <div 
            key={room.id} 
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <RoomCard room={room} />
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
          <BedDouble className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Aucune chambre trouvée</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Rooms;
