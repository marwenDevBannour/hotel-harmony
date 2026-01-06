import MainLayout from '@/components/layout/MainLayout';
import { useGuests, useGuestStats, Guest } from '@/hooks/useGuests';
import { GuestFormModal } from '@/components/guests/GuestFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Crown,
  Star,
  MoreVertical,
  Globe,
  Pencil
} from 'lucide-react';
import { useState } from 'react';

const GuestCard = ({ guest, onEdit }: { guest: Guest; onEdit: (guest: Guest) => void }) => {
  return (
    <div className="card-elevated card-hover p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold",
            guest.vip 
              ? "bg-gradient-to-br from-amber-400 to-amber-600 text-primary" 
              : "bg-secondary text-secondary-foreground"
          )}>
            {guest.first_name[0]}{guest.last_name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-lg font-semibold">
                {guest.first_name} {guest.last_name}
              </p>
              {guest.vip && (
                <Crown className="h-4 w-4 text-gold" />
              )}
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Globe className="h-3 w-3" />
              {guest.nationality || 'Non spécifié'}
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

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Séjours</p>
            <p className="font-semibold">{guest.total_stays}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Points</p>
            <p className="flex items-center gap-1 font-semibold text-gold">
              <Star className="h-3 w-3" />
              {guest.loyalty_points.toLocaleString()}
            </p>
          </div>
        </div>
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
    <MainLayout title="Clients" subtitle="Base de données des clients et programme de fidélité">
      {/* Header Actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un client..." 
              className="w-64 pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
        <Button variant="gold" className="gap-2" onClick={handleAddGuest}>
          <Plus className="h-4 w-4" />
          Nouveau Client
        </Button>
      </div>

      {/* Stats */}
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

      {/* Guests Grid */}
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

      <GuestFormModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        guest={selectedGuest}
      />
    </MainLayout>
  );
};

export default Guests;
