import { LogIn, LogOut, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/types/hotel';
import { cn } from '@/lib/utils';

interface TodayActivityProps {
  arrivals: Reservation[];
  departures: Reservation[];
}

const TodayActivity = ({ arrivals, departures }: TodayActivityProps) => {
  return (
    <div className="card-elevated p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Activité du Jour</h3>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <LogIn className="h-3 w-3" />
            {arrivals.length} Arrivées
          </span>
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            <LogOut className="h-3 w-3" />
            {departures.length} Départs
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Arrivals */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <LogIn className="h-4 w-4" />
            Arrivées Attendues
          </h4>
          <div className="space-y-2">
            {arrivals.length > 0 ? (
              arrivals.map((reservation) => (
                <div 
                  key={reservation.id} 
                  className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                      <User className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{reservation.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        Chambre {reservation.roomNumber} • {reservation.adults} adultes
                        {reservation.children > 0 && `, ${reservation.children} enfants`}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="gold">
                    Check-in
                  </Button>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
                Aucune arrivée prévue
              </p>
            )}
          </div>
        </div>

        {/* Departures */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
            <LogOut className="h-4 w-4" />
            Départs Prévus
          </h4>
          <div className="space-y-2">
            {departures.length > 0 ? (
              departures.map((reservation) => (
                <div 
                  key={reservation.id} 
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{reservation.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        Chambre {reservation.roomNumber} • Solde: {(reservation.totalAmount - reservation.paidAmount).toLocaleString('fr-FR')} €
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Check-out
                  </Button>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
                Aucun départ prévu
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayActivity;
