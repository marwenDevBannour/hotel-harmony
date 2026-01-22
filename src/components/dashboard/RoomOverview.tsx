import type { Room } from '@/hooks/useRooms';
import { cn } from '@/lib/utils';
import { BedDouble } from 'lucide-react';

interface RoomOverviewProps {
  rooms: Room[];
}

const typeLabels: Record<string, string> = {
  standard: 'Std',
  superior: 'Sup',
  deluxe: 'Dlx',
  suite: 'Suite',
  presidential: 'Prés',
};

const RoomOverview = ({ rooms }: RoomOverviewProps) => {
  return (
    <div className="card-elevated p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Aperçu des Chambres</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {rooms.map((room) => (
          <button
            key={room.id}
            className={cn(
              "group relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg",
              "bg-emerald-100 border-emerald-200"
            )}
          >
            <BedDouble className="mb-1 h-5 w-5 text-emerald-600" />
            <span className="font-display text-lg font-semibold text-foreground">
              {room.number}
            </span>
            <span className="text-xs font-medium text-emerald-600">
              {typeLabels[room.type] || room.type}
            </span>
            <span className="text-xs text-muted-foreground">
              {room.price}€
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomOverview;
