import MainLayout from '@/components/layout/MainLayout';
import { mockReservations } from '@/data/mockData';
import { Reservation } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  CreditCard,
  MoreVertical,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

const statusConfig = {
  confirmed: { label: 'Confirmée', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  'checked-in': { label: 'Enregistré', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'checked-out': { label: 'Parti', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-700 border-red-200' },
};

const sourceConfig = {
  direct: { label: 'Direct', className: 'bg-primary/10 text-primary' },
  website: { label: 'Site Web', className: 'bg-purple-100 text-purple-700' },
  booking: { label: 'Booking.com', className: 'bg-blue-100 text-blue-700' },
  expedia: { label: 'Expedia', className: 'bg-yellow-100 text-yellow-700' },
  phone: { label: 'Téléphone', className: 'bg-green-100 text-green-700' },
};

const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
  const status = statusConfig[reservation.status];
  const source = sourceConfig[reservation.source];
  const balance = reservation.totalAmount - reservation.paidAmount;
  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card-elevated card-hover overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
            <User className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{reservation.guestName}</p>
            <p className="text-sm text-muted-foreground">Réf: {reservation.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium",
            status.className
          )}>
            {status.label}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Room & Dates */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Chambre</p>
            <p className="font-display text-2xl font-bold">{reservation.roomNumber}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Arrivée</p>
            <p className="font-semibold">{checkInDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Départ</p>
            <p className="font-semibold">{checkOutDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
          </div>
        </div>

        {/* Details */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {reservation.adults} adulte{reservation.adults > 1 ? 's' : ''}
            {reservation.children > 0 && `, ${reservation.children} enfant${reservation.children > 1 ? 's' : ''}`}
            {' • '}{nights} nuit{nights > 1 ? 's' : ''}
          </span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", source.className)}>
            {source.label}
          </span>
        </div>

        {/* Special Requests */}
        {reservation.specialRequests && (
          <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <p className="font-medium">Note:</p>
            <p>{reservation.specialRequests}</p>
          </div>
        )}

        {/* Payment & Actions */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Montant total</p>
            <p className="font-display text-xl font-bold">{reservation.totalAmount.toLocaleString('fr-FR')} €</p>
            {balance > 0 && (
              <p className="flex items-center gap-1 text-xs text-amber-600">
                <CreditCard className="h-3 w-3" />
                Solde: {balance.toLocaleString('fr-FR')} €
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {reservation.status === 'confirmed' && (
              <Button variant="gold" size="sm">Check-in</Button>
            )}
            {reservation.status === 'checked-in' && (
              <Button variant="outline" size="sm">Check-out</Button>
            )}
            <Button variant="outline" size="sm">
              Modifier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reservations = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReservations = statusFilter === 'all'
    ? mockReservations
    : mockReservations.filter(r => r.status === statusFilter);

  return (
    <MainLayout title="Réservations" subtitle="Gérez toutes les réservations de l'établissement">
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
            <Calendar className="h-4 w-4" />
            Dates
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
        <Button variant="gold" className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Réservation
        </Button>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            statusFilter === 'all' 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          Toutes ({mockReservations.length})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = mockReservations.filter(r => r.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                statusFilter === status 
                  ? cn(config.className, "shadow-sm") 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Reservations Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredReservations.map((reservation, index) => (
          <div 
            key={reservation.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ReservationCard reservation={reservation} />
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Aucune réservation trouvée</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Reservations;
