import { Room, RoomStatus } from '@/types/hotel';
import { cn } from '@/lib/utils';
import { BedDouble, Wrench, Sparkles, Calendar, Check } from 'lucide-react';

interface RoomOverviewProps {
  rooms: Room[];
}

const statusConfig: Record<RoomStatus, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: React.ElementType;
}> = {
  available: { 
    label: 'Disponible', 
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-100 border-emerald-200',
    icon: Check
  },
  occupied: { 
    label: 'Occupée', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100 border-blue-200',
    icon: BedDouble
  },
  cleaning: { 
    label: 'Nettoyage', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100 border-purple-200',
    icon: Sparkles
  },
  maintenance: { 
    label: 'Maintenance', 
    color: 'text-red-600', 
    bgColor: 'bg-red-100 border-red-200',
    icon: Wrench
  },
  reserved: { 
    label: 'Réservée', 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-100 border-amber-200',
    icon: Calendar
  },
};

const RoomOverview = ({ rooms }: RoomOverviewProps) => {
  const groupedByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  return (
    <div className="card-elevated p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Aperçu des Chambres</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={cn("h-3 w-3 rounded-full", config.bgColor)} />
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByFloor).sort(([a], [b]) => Number(a) - Number(b)).map(([floor, floorRooms]) => (
          <div key={floor}>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">
              Étage {floor}
            </h4>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {floorRooms.map((room) => {
                const config = statusConfig[room.status];
                const Icon = config.icon;
                return (
                  <button
                    key={room.id}
                    className={cn(
                      "group relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg",
                      config.bgColor
                    )}
                  >
                    <Icon className={cn("mb-1 h-5 w-5", config.color)} />
                    <span className="font-display text-lg font-semibold text-foreground">
                      {room.number}
                    </span>
                    <span className={cn("text-xs font-medium capitalize", config.color)}>
                      {room.type}
                    </span>
                    
                    {room.currentGuest && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                        {room.currentGuest}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomOverview;
