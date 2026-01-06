import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          guest:guests(id, first_name, last_name, email),
          reservation:reservations(id, reservation_number, check_in, check_out)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Invoice[];
    },
  });
};

export const useInvoiceDetails = (invoiceId: string) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          guest:guests(id, first_name, last_name, email, phone, nationality),
          reservation:reservations(id, reservation_number, check_in, check_out, room:rooms(number, type)),
          items:invoice_items(*),
          payments:payments(*)
        `)
        .eq('id', invoiceId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Invoice | null;
    },
    enabled: !!invoiceId,
  });
};

export const useInvoiceStats = () => {
  return useQuery({
    queryKey: ['invoice-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('status, total_amount, paid_amount');
      
      if (error) throw error;
      
      const total = data.length;
      const pending = data.filter(i => i.status === 'pending' || i.status === 'partial').length;
      const paid = data.filter(i => i.status === 'paid').length;
      const totalRevenue = data.reduce((acc, i) => acc + Number(i.paid_amount), 0);
      const outstanding = data.reduce((acc, i) => acc + (Number(i.total_amount) - Number(i.paid_amount)), 0);
      
      return { total, pending, paid, totalRevenue, outstanding };
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoice: Partial<Invoice>) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
};

export const useAddPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ invoiceId, payment }: { invoiceId: string; payment: Partial<Payment> }) => {
      // Add payment
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({ ...payment, invoice_id: invoiceId } as any)
        .select()
        .single();
      
      if (paymentError) throw paymentError;
      
      // Update invoice paid_amount and status
      const { data: invoice } = await supabase
        .from('invoices')
        .select('total_amount, paid_amount')
        .eq('id', invoiceId)
        .single();
      
      if (invoice) {
        const newPaidAmount = Number(invoice.paid_amount) + Number(payment.amount);
        const newStatus = newPaidAmount >= Number(invoice.total_amount) ? 'paid' : 'partial';
        
        await supabase
          .from('invoices')
          .update({ paid_amount: newPaidAmount, status: newStatus })
          .eq('id', invoiceId);
      }
      
      return paymentData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
};
