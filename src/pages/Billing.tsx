import MainLayout from '@/components/layout/MainLayout';
import { useInvoices, useInvoiceStats, Invoice } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  FileText,
  Download,
  CheckCircle,
  Clock,
  Edit,
} from 'lucide-react';
import { useState } from 'react';
import InvoiceFormModal from '@/components/billing/InvoiceFormModal';
import PaymentFormModal from '@/components/billing/PaymentFormModal';

const InvoiceCard = ({ 
  invoice, 
  onEdit, 
  onPayment 
}: { 
  invoice: Invoice; 
  onEdit: (invoice: Invoice) => void;
  onPayment: (invoice: Invoice) => void;
}) => {
  const isPaid = invoice.paid;

  return (
    <div className="card-elevated card-hover overflow-hidden">
      <div className="flex items-start justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
            <FileText className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Facture #{invoice.id}</p>
            <p className="text-sm text-muted-foreground">
              {invoice.reservation?.guest?.name || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
            isPaid 
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-amber-100 text-amber-700 border-amber-200"
          )}>
            {isPaid ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {isPaid ? 'Payée' : 'En attente'}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(invoice)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}
          </span>
        </div>

        <div className="mb-4 rounded-lg bg-primary/10 p-3 text-center">
          <p className="text-xs text-muted-foreground">Montant</p>
          <p className="font-display text-xl font-bold">{invoice.amount.toLocaleString('fr-FR')} €</p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          {!isPaid && (
            <Button variant="gold" size="sm" onClick={() => onPayment(invoice)}>
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
  );
};

const Billing = () => {
  const { data: invoices, isLoading } = useInvoices();
  const { data: stats, isLoading: statsLoading } = useInvoiceStats();
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceModalOpen(true);
  };

  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentModalOpen(true);
  };

  const handleNewInvoice = () => {
    setSelectedInvoice(null);
    setInvoiceModalOpen(true);
  };

  return (
    <MainLayout title="Facturation" subtitle="Gestion des factures et paiements">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div />
        <Button variant="gold" className="gap-2" onClick={handleNewInvoice}>
          <Plus className="h-4 w-4" />
          Nouvelle Facture
        </Button>
      </div>

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

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {invoices?.map((invoice, index) => (
            <div 
              key={invoice.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <InvoiceCard invoice={invoice} onEdit={handleEdit} onPayment={handlePayment} />
            </div>
          ))}
        </div>
      )}

      {!isLoading && invoices?.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Aucune facture trouvée</p>
        </div>
      )}

      <InvoiceFormModal
        open={invoiceModalOpen}
        onOpenChange={setInvoiceModalOpen}
        invoice={selectedInvoice}
      />

      {selectedInvoice && (
        <PaymentFormModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          invoiceId={selectedInvoice.id}
          remainingAmount={selectedInvoice.amount}
        />
      )}
    </MainLayout>
  );
};

export default Billing;
