import MainLayout from '@/components/layout/MainLayout';
import { useRooms, Room } from '@/hooks/useRooms';
import { RoomFormModal } from '@/components/rooms/RoomFormModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  BedDouble, 
  Plus, 
  Pencil
} from 'lucide-react';
import { useState } from 'react';

const typeLabels: Record<string, string> = {
  standard: 'Standard',
  superior: 'Supérieure',
  deluxe: 'Deluxe',
  suite: 'Suite',
  presidential: 'Présidentielle',
};

const RoomCard = ({ room, onEdit }: { room: Room; onEdit: (room: Room) => void }) => {
  return (
    <div className="card-elevated card-hover overflow-hidden">
      <div className="flex items-center justify-between bg-emerald-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-sm">
            <span className="font-display text-xl font-bold">{room.number}</span>
          </div>
          <div>
            <p className="font-medium capitalize text-foreground">{typeLabels[room.type] || room.type}</p>
            <p className="text-xs text-muted-foreground">{room.capacity} pers.</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
          Disponible
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-2xl font-bold text-foreground">
              {room.price} €
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
            <Button variant="gold" size="sm">
              Réserver
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

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  return (
    <MainLayout title="Gestion des Chambres" subtitle="Gérez l'inventaire des chambres">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div />
        <Button variant="gold" className="gap-2" onClick={handleAddRoom}>
          <Plus className="h-4 w-4" />
          Ajouter une Chambre
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rooms?.map((room, index) => (
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

      {!isLoading && rooms?.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
          <BedDouble className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Aucune chambre trouvée</p>
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
