import MainLayout from '@/components/layout/MainLayout';
import { useReservations, Reservation } from '@/hooks/useReservations';
import { ReservationFormModal } from '@/components/reservations/ReservationFormModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { exportToCSV, exportToExcel, reservationsExportColumns } from '@/lib/exportUtils';
import { useSearchFilter, FilterConfig } from '@/hooks/useSearchFilter';
import { SearchFilterBar } from '@/components/filters/SearchFilterBar';
import { 
  Plus, 
  Calendar,
  User,
  Pencil,
} from 'lucide-react';
import { useState } from 'react';

const ReservationCard = ({ reservation, onEdit }: { reservation: Reservation; onEdit: (r: Reservation) => void }) => {
  const checkInDate = new Date(reservation.checkInDate);
  const checkOutDate = new Date(reservation.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card-elevated card-hover overflow-hidden">
      <div className="flex items-start justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
            <User className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">
              {reservation.guest?.name || 'Client'}
            </p>
            <p className="text-sm text-muted-foreground">Réf: #{reservation.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(reservation)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">Chambre</p>
            <p className="font-display text-2xl font-bold">{reservation.room?.number || '-'}</p>
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

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {nights} nuit{nights > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

const Reservations = () => {
  const { data: reservations, isLoading } = useReservations();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const filters: FilterConfig[] = [];

  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useSearchFilter({
    data: reservations,
    searchFields: ['guest.name', 'room.number'],
    filters,
    persistInUrl: true,
  });

  const handleAddReservation = () => {
    setSelectedReservation(null);
    setModalOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalOpen(true);
  };

  return (
    <MainLayout title="Réservations" subtitle="Gérez toutes les réservations de l'établissement">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchFilterBar
          searchPlaceholder="Rechercher client, chambre..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          onExportCSV={() => exportToCSV(filteredData || [], reservationsExportColumns, 'reservations')}
          onExportExcel={() => exportToExcel(filteredData || [], reservationsExportColumns, 'reservations')}
        />
        <Button variant="gold" className="gap-2" onClick={handleAddReservation}>
          <Plus className="h-4 w-4" />
          Nouvelle Réservation
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredData?.map((reservation, index) => (
            <div key={reservation.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <ReservationCard reservation={reservation} onEdit={handleEditReservation} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredData?.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Aucune réservation trouvée</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Effacer les filtres
            </Button>
          )}
        </div>
      )}

      <ReservationFormModal open={modalOpen} onOpenChange={setModalOpen} reservation={selectedReservation} />
    </MainLayout>
  );
};

export default Reservations;
