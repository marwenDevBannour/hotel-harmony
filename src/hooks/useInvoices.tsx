import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi, Invoice as ApiInvoice, InvoiceInput, PaymentInput } from '@/services/api';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoicesApi.getAll(),
  });
};

export const useInvoiceDetails = (invoiceId: number) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => invoicesApi.getById(invoiceId),
    enabled: !!invoiceId,
  });
};

export const useInvoiceStats = () => {
  return useQuery({
    queryKey: ['invoice-stats'],
    queryFn: async () => {
      const data = await invoicesApi.getAll();
      const total = data.length;
      const pending = data.filter(i => !i.paid).length;
      const paid = data.filter(i => i.paid).length;
      const totalRevenue = data.filter(i => i.paid).reduce((acc, i) => acc + i.amount, 0);
      const outstanding = data.filter(i => !i.paid).reduce((acc, i) => acc + i.amount, 0);
      return { total, pending, paid, totalRevenue, outstanding };
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoice: InvoiceInput) => invoicesApi.create(invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...invoice }: Partial<InvoiceInput> & { id: number }) => 
      invoicesApi.update(id, invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
};

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, payment }: { invoiceId: number; payment: Omit<PaymentInput, 'invoiceId'> }) => 
      invoicesApi.addPayment(invoiceId, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
};
