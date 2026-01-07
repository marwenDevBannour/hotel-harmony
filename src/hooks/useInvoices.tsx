import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi, Invoice as ApiInvoice, Payment as ApiPayment } from '@/services/api';

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'partial' | 'cancelled';
export type InvoiceType = 'reservation' | 'restaurant' | 'other';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'check';

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_type: 'room' | 'service' | 'restaurant' | 'minibar' | 'other';
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  reference: string | null;
  received_by: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  reservation_id: string | null;
  guest_id: string;
  type: InvoiceType;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  status: InvoiceStatus;
  due_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  guest?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  reservation?: {
    id: string;
    reservation_number: string;
    check_in: string;
    check_out: string;
  };
  items?: InvoiceItem[];
  payments?: Payment[];
}

// Transform API response to frontend format
const transformInvoice = (inv: ApiInvoice): Invoice => ({
  id: inv.id,
  invoice_number: inv.invoiceNumber,
  reservation_id: inv.reservationId || null,
  guest_id: inv.guestId,
  type: inv.type as InvoiceType,
  subtotal: inv.subtotal,
  tax_rate: inv.taxRate,
  tax_amount: inv.taxAmount,
  total_amount: inv.totalAmount,
  paid_amount: inv.paidAmount,
  status: inv.status as InvoiceStatus,
  due_date: inv.dueDate || null,
  notes: inv.notes || null,
  created_by: null,
  created_at: inv.createdAt || new Date().toISOString(),
  updated_at: inv.updatedAt || new Date().toISOString(),
  guest: inv.guest ? {
    id: inv.guest.id,
    first_name: inv.guest.firstName,
    last_name: inv.guest.lastName,
    email: inv.guest.email,
  } : undefined,
  items: inv.items?.map(item => ({
    id: item.id,
    invoice_id: item.invoiceId,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
    item_type: item.itemType as any,
    created_at: new Date().toISOString(),
  })),
  payments: inv.payments?.map(p => ({
    id: p.id,
    invoice_id: p.invoiceId,
    amount: p.amount,
    payment_method: p.paymentMethod as PaymentMethod,
    reference: p.reference || null,
    received_by: null,
    created_at: p.createdAt || new Date().toISOString(),
  })),
});

// Transform frontend format to API format
const transformToApi = (inv: Partial<Invoice>): Partial<ApiInvoice> => {
  // Map 'partial' status to 'pending' for API compatibility
  const apiStatus = inv.status === 'partial' ? 'pending' : inv.status;
  
  return {
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    guestId: inv.guest_id,
    reservationId: inv.reservation_id || undefined,
    type: inv.type,
    subtotal: inv.subtotal,
    taxRate: inv.tax_rate,
    taxAmount: inv.tax_amount,
    totalAmount: inv.total_amount,
    paidAmount: inv.paid_amount,
    status: apiStatus as 'draft' | 'pending' | 'paid' | 'cancelled' | undefined,
    dueDate: inv.due_date || undefined,
    notes: inv.notes || undefined,
  };
};

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const data = await invoicesApi.getAll();
      return data.map(transformInvoice);
    },
  });
};

export const useInvoiceDetails = (invoiceId: string) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      const data = await invoicesApi.getById(invoiceId);
      return transformInvoice(data);
    },
    enabled: !!invoiceId,
  });
};

export const useInvoiceStats = () => {
  return useQuery({
    queryKey: ['invoice-stats'],
    queryFn: async () => {
      const data = await invoicesApi.getAll();
      
      const total = data.length;
      const pending = data.filter(i => i.status === 'pending' || i.paidAmount < i.totalAmount).length;
      const paid = data.filter(i => i.status === 'paid').length;
      const totalRevenue = data.reduce((acc, i) => acc + Number(i.paidAmount), 0);
      const outstanding = data.reduce((acc, i) => acc + (Number(i.totalAmount) - Number(i.paidAmount)), 0);
      
      return { total, pending, paid, totalRevenue, outstanding };
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoice: Partial<Invoice>) => {
      // Map 'partial' status to 'pending' for API compatibility
      const status = invoice.status === 'partial' ? 'pending' : invoice.status;
      const apiInv = transformToApi({ ...invoice, status }) as Omit<ApiInvoice, 'id'>;
      return invoicesApi.create(apiInv);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...invoice }: Partial<Invoice> & { id: string }) => {
      const apiInv = transformToApi(invoice);
      return invoicesApi.update(id, apiInv);
    },
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
    mutationFn: async ({ invoiceId, payment }: { invoiceId: string; payment: Partial<Payment> }) => {
      return invoicesApi.addPayment(invoiceId, {
        amount: payment.amount!,
        paymentMethod: payment.payment_method!,
        reference: payment.reference || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
};
