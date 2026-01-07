import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi, Invoice, InvoiceInput } from '@/services/api';
import { toast } from 'sonner';
import { useReservations } from '@/hooks/useReservations';

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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const invoiceSchema = z.object({
  reservationId: z.coerce.number().min(1, 'Réservation requise'),
  issueDate: z.string().min(1, 'Date requise'),
  amount: z.coerce.number().min(0, 'Montant invalide'),
  paid: z.boolean(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
}

const InvoiceFormModal = ({ open, onOpenChange, invoice }: InvoiceFormModalProps) => {
  const queryClient = useQueryClient();
  const { data: reservations } = useReservations();
  const isEditing = !!invoice;

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      reservationId: invoice?.reservation?.id || 0,
      issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
      amount: invoice?.amount || 0,
      paid: invoice?.paid || false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      if (isEditing) {
        return invoicesApi.update(invoice.id, data as any);
      } else {
        return invoicesApi.create(data as any);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
      toast.success(isEditing ? 'Facture modifiée' : 'Facture créée');
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  const onSubmit = (data: InvoiceFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier la Facture' : 'Nouvelle Facture'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reservationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Réservation *</FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value || '')}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une réservation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reservations?.map((res) => (
                        <SelectItem key={res.id} value={String(res.id)}>
                          {res.guest?.name} - {res.room?.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'émission *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (€) *</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="cursor-pointer">Payée</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="gold" disabled={mutation.isPending}>
                {mutation.isPending ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormModal;
