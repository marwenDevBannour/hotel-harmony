import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAddPayment } from '@/hooks/useInvoices';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Montant requis'),
  method: z.string().min(1, 'Mode de paiement requis'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: number;
  remainingAmount: number;
}

const PaymentFormModal = ({ open, onOpenChange, invoiceId, remainingAmount }: PaymentFormModalProps) => {
  const addPayment = useAddPayment();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: remainingAmount,
      method: 'cash',
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    addPayment.mutate(
      {
        invoiceId,
        payment: {
          paymentDate: new Date().toISOString(),
          method: data.method,
          amount: data.amount,
        },
      },
      {
        onSuccess: () => {
          toast.success('Paiement enregistré');
          onOpenChange(false);
          form.reset();
        },
        onError: () => {
          toast.error('Erreur lors de l\'enregistrement');
        },
      }
    );
  };

  const paymentMethods = [
    { value: 'cash', label: 'Espèces' },
    { value: 'card', label: 'Carte bancaire' },
    { value: 'transfer', label: 'Virement' },
    { value: 'check', label: 'Chèque' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Enregistrer un Paiement</DialogTitle>
        </DialogHeader>

        <div className="mb-4 rounded-lg bg-secondary p-3 text-center">
          <p className="text-sm text-muted-foreground">Reste à payer</p>
          <p className="font-display text-2xl font-bold text-amber-600">
            {remainingAmount.toLocaleString('fr-FR')} €
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (€) *</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" max={remainingAmount} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode de paiement</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="gold" disabled={addPayment.isPending}>
                {addPayment.isPending ? 'Enregistrement...' : 'Encaisser'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentFormModal;
