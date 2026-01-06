import MainLayout from '@/components/layout/MainLayout';
import { mockGuests } from '@/data/mockData';
import { Guest } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Filter,
  User,
  Mail,
  Phone,
  Crown,
  Star,
  MoreVertical,
  Globe
} from 'lucide-react';

const GuestCard = ({ guest }: { guest: Guest }) => {
  return (
    <div className="card-elevated card-hover p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold",
            guest.vip 
              ? "bg-gradient-to-br from-gold to-gold-dark text-primary" 
              : "bg-secondary text-secondary-foreground"
          )}>
            {guest.firstName[0]}{guest.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-lg font-semibold">
                {guest.firstName} {guest.lastName}
              </p>
              {guest.vip && (
                <Crown className="h-4 w-4 text-gold" />
              )}
            </div>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Globe className="h-3 w-3" />
              {guest.nationality}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
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
            <p className="font-semibold">{guest.totalStays}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Points</p>
            <p className="flex items-center gap-1 font-semibold text-gold">
              <Star className="h-3 w-3" />
              {guest.loyaltyPoints.toLocaleString()}
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
        <Button variant="gold" className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Client
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Total Clients</p>
          <p className="font-display text-2xl font-bold">{mockGuests.length}</p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Clients VIP</p>
          <p className="font-display text-2xl font-bold text-gold">
            {mockGuests.filter(g => g.vip).length}
          </p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-sm text-muted-foreground">Points Distribués</p>
          <p className="font-display text-2xl font-bold">
            {mockGuests.reduce((acc, g) => acc + g.loyaltyPoints, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Guests Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockGuests.map((guest, index) => (
          <div 
            key={guest.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <GuestCard guest={guest} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Guests;
