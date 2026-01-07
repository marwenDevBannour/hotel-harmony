import { Reservation } from '@/services/api';
import { cn } from '@/lib/utils';
import { ExternalLink, Calendar } from 'lucide-react';

interface RecentReservationsProps {
  reservations: Reservation[];
}

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
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reservations.slice(0, 5).map((reservation) => (
              <tr 
                key={reservation.id} 
                className="group transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-4">
                  <p className="font-medium text-foreground">
                    {reservation.guest?.name || 'N/A'}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <span className="font-display text-lg font-semibold">{reservation.room?.number || 'N/A'}</span>
                </td>
                <td className="hidden px-4 py-4 sm:table-cell">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(reservation.checkInDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                    <span>→</span>
                    <span>{new Date(reservation.checkOutDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReservations;
