import { Reservation } from '@/types/hotel';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExternalLink, Calendar, CreditCard } from 'lucide-react';

interface RecentReservationsProps {
  reservations: Reservation[];
}

const statusConfig = {
  confirmed: { label: 'Confirmée', variant: 'default' as const, className: 'bg-blue-100 text-blue-700 border-blue-200' },
  pending: { label: 'En attente', variant: 'secondary' as const, className: 'bg-amber-100 text-amber-700 border-amber-200' },
  'checked-in': { label: 'Enregistré', variant: 'default' as const, className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'checked-out': { label: 'Parti', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-700 border-gray-200' },
  cancelled: { label: 'Annulée', variant: 'destructive' as const, className: 'bg-red-100 text-red-700 border-red-200' },
};

const sourceLabels = {
  direct: 'Direct',
  website: 'Site Web',
  booking: 'Booking.com',
  expedia: 'Expedia',
  phone: 'Téléphone',
};

const RecentReservations = ({ reservations }: RecentReservationsProps) => {
  return (
    <div className="card-elevated p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Réservations Récentes</h3>
        <button className="flex items-center gap-1 text-sm font-medium text-gold hover:underline">
          Voir tout
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Chambre
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                Dates
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Statut
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Montant
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reservations.slice(0, 5).map((reservation) => {
              const status = statusConfig[reservation.status];
              const balance = reservation.totalAmount - reservation.paidAmount;
              
              return (
                <tr 
                  key={reservation.id} 
                  className="group transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">{reservation.guestName}</p>
                      <p className="text-xs text-muted-foreground">Réf: {reservation.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-display text-lg font-semibold">{reservation.roomNumber}</span>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(reservation.checkIn).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                      <span>→</span>
                      <span>{new Date(reservation.checkOut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <span className="text-sm text-muted-foreground">{sourceLabels[reservation.source]}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      status.className
                    )}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="font-semibold text-foreground">{reservation.totalAmount.toLocaleString('fr-FR')} €</p>
                    {balance > 0 && (
                      <p className="flex items-center justify-end gap-1 text-xs text-amber-600">
                        <CreditCard className="h-3 w-3" />
                        Solde: {balance.toLocaleString('fr-FR')} €
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReservations;
