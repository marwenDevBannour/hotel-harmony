import MainLayout from '@/components/layout/MainLayout';
import { useGuests, useGuestStats, Guest } from '@/hooks/useGuests';
import { GuestFormModal } from '@/components/guests/GuestFormModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Mail,
  Phone,
  Pencil,
  Users
} from 'lucide-react';
import { useState } from 'react';

const GuestCard = ({ guest, onEdit }: { guest: Guest; onEdit: (guest: Guest) => void }) => {
  return (
    <div className="card-elevated card-hover p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
            {guest.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-display text-lg font-semibold">
              {guest.name}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(guest)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{guest.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{guest.phone}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-border pt-4">
        <Button variant="outline" size="sm">
          Voir Profil
        </Button>
      </div>
    </div>
  );
};

const Guests = () => {
  const { data: guests, isLoading } = useGuests();
  const { data: stats, isLoading: statsLoading } = useGuestStats();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const handleAddGuest = () => {
    setSelectedGuest(null);
    setModalOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setModalOpen(true);
  };

  return (
    <MainLayout title="Clients" subtitle="Base de données des clients">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div />
        <Button variant="gold" className="gap-2" onClick={handleAddGuest}>
          <Plus className="h-4 w-4" />
          Nouveau Client
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {statsLoading ? (
          <>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </>
        ) : (
          <>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <p className="font-display text-2xl font-bold">{stats?.total || 0}</p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Clients VIP</p>
              <p className="font-display text-2xl font-bold text-gold">
                {stats?.vipCount || 0}
              </p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Points Distribués</p>
              <p className="font-display text-2xl font-bold">
                {stats?.totalPoints?.toLocaleString() || 0}
              </p>
            </div>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {guests?.map((guest, index) => (
            <div 
              key={guest.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <GuestCard guest={guest} onEdit={handleEditGuest} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && guests?.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
          <Users className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Aucun client trouvé</p>
        </div>
      )}

      <GuestFormModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        guest={selectedGuest}
      />
    </MainLayout>
  );
};

export default Guests;
