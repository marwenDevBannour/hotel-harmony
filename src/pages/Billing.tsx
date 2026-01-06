import MainLayout from '@/components/layout/MainLayout';
import { useInvoices, useInvoiceStats, Invoice, InvoiceStatus } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Filter,
  FileText,
  CreditCard,
  MoreVertical,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

const statusConfig: Record<InvoiceStatus, { 
  label: string; 
  className: string;
  icon: React.ElementType;
}> = {
  draft: { 
    label: 'Brouillon', 
    className: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: FileText,
  },
  pending: { 
    label: 'En attente', 
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
  },
  paid: { 
    label: 'Payée', 
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
  },
  partial: { 
    label: 'Partiel', 
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: AlertCircle,
  },
  cancelled: { 
    label: 'Annulée', 
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
  },
};

const typeLabels = {
  reservation: 'Séjour',
  restaurant: 'Restaurant',
  other: 'Autre',
};

const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
  const status = statusConfig[invoice.status];
  const StatusIcon = status.icon;
  const balance = Number(invoice.total_amount) - Number(invoice.paid_amount);

  return (
    <div className="card-elevated card-hover overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
            <FileText className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{invoice.invoice_number}</p>
            <p className="text-sm text-muted-foreground">
              {invoice.guest?.first_name} {invoice.guest?.last_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
            status.className
          )}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Type & Date */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="rounded-full bg-secondary px-2 py-1 text-xs">
            {typeLabels[invoice.type]}
          </span>
          <span className="text-muted-foreground">
            {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>

        {/* Reservation ref */}
        {invoice.reservation && (
          <div className="mb-4 rounded-lg bg-secondary p-3 text-sm">
            <p className="text-muted-foreground">Réservation</p>
            <p className="font-medium">{invoice.reservation.reservation_number}</p>
          </div>
        )}

        {/* Amounts */}
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-secondary p-2">
            <p className="text-xs text-muted-foreground">Sous-total</p>
            <p className="font-semibold">{Number(invoice.subtotal).toLocaleString('fr-FR')} €</p>
          </div>
          <div className="rounded-lg bg-secondary p-2">
            <p className="text-xs text-muted-foreground">TVA ({invoice.tax_rate}%)</p>
            <p className="font-semibold">{Number(invoice.tax_amount).toLocaleString('fr-FR')} €</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-2">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-display font-bold">{Number(invoice.total_amount).toLocaleString('fr-FR')} €</p>
          </div>
        </div>

        {/* Payment & Actions */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Payé</p>
            <p className="font-semibold text-emerald-600">
              {Number(invoice.paid_amount).toLocaleString('fr-FR')} €
            </p>
            {balance > 0 && (
              <p className="flex items-center gap-1 text-xs text-amber-600">
                <CreditCard className="h-3 w-3" />
                Reste: {balance.toLocaleString('fr-FR')} €
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button variant="gold" size="sm">
                Encaisser
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-3 w-3" />
              PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Billing = () => {
  const { data: invoices, isLoading } = useInvoices();
  const { data: stats, isLoading: statsLoading } = useInvoiceStats();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = statusFilter === 'all'
    ? invoices
    : invoices?.filter(i => i.status === statusFilter);

  return (
    <MainLayout title="Facturation" subtitle="Gestion des factures et paiements">
      {/* Header Actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une facture..." 
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
          Nouvelle Facture
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Total Factures</p>
              <p className="font-display text-2xl font-bold">{stats?.total || 0}</p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">En Attente</p>
              <p className="font-display text-2xl font-bold text-amber-600">
                {stats?.pending || 0}
              </p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Revenus Encaissés</p>
              <p className="font-display text-2xl font-bold text-emerald-600">
                {stats?.totalRevenue?.toLocaleString('fr-FR') || 0} €
              </p>
            </div>
            <div className="card-elevated p-4">
              <p className="text-sm text-muted-foreground">Créances</p>
              <p className="font-display text-2xl font-bold text-red-600">
                {stats?.outstanding?.toLocaleString('fr-FR') || 0} €
              </p>
            </div>
          </>
        )}
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
          Toutes ({invoices?.length || 0})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = invoices?.filter(i => i.status === status).length || 0;
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

      {/* Invoices Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredInvoices?.map((invoice, index) => (
            <div 
              key={invoice.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <InvoiceCard invoice={invoice} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredInvoices?.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Aucune facture trouvée</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Billing;
