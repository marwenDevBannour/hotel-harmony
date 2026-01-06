-- Table pour les factures
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  reservation_id UUID REFERENCES public.reservations(id),
  guest_id UUID NOT NULL REFERENCES public.guests(id),
  type TEXT NOT NULL DEFAULT 'reservation' CHECK (type IN ('reservation', 'restaurant', 'other')),
  subtotal NUMERIC NOT NULL DEFAULT 0.00,
  tax_rate NUMERIC NOT NULL DEFAULT 10.00,
  tax_amount NUMERIC NOT NULL DEFAULT 0.00,
  total_amount NUMERIC NOT NULL DEFAULT 0.00,
  paid_amount NUMERIC NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'paid', 'partial', 'cancelled')),
  due_date DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lignes de facture
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'service' CHECK (item_type IN ('room', 'service', 'restaurant', 'minibar', 'other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Paiements
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'check')),
  reference TEXT,
  received_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tables du restaurant
CREATE TABLE public.restaurant_tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 4,
  location TEXT DEFAULT 'intérieur' CHECK (location IN ('intérieur', 'terrasse', 'privé')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Commandes restaurant
CREATE TABLE public.restaurant_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  table_id UUID REFERENCES public.restaurant_tables(id),
  room_id UUID REFERENCES public.rooms(id),
  guest_id UUID REFERENCES public.guests(id),
  order_type TEXT NOT NULL DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'room_service', 'takeaway')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served', 'paid', 'cancelled')),
  subtotal NUMERIC NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC NOT NULL DEFAULT 0.00,
  total_amount NUMERIC NOT NULL DEFAULT 0.00,
  notes TEXT,
  waiter_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Articles du menu
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('entrée', 'plat', 'dessert', 'boisson', 'apéritif')),
  price NUMERIC NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Articles de commande
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.restaurant_orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Staff can view invoices" ON public.invoices FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admin and receptionist can manage invoices" ON public.invoices FOR ALL USING (has_staff_role(auth.uid(), 'admin'::staff_role) OR has_staff_role(auth.uid(), 'receptionist'::staff_role));

-- RLS Policies for invoice_items
CREATE POLICY "Staff can view invoice items" ON public.invoice_items FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admin and receptionist can manage invoice items" ON public.invoice_items FOR ALL USING (has_staff_role(auth.uid(), 'admin'::staff_role) OR has_staff_role(auth.uid(), 'receptionist'::staff_role));

-- RLS Policies for payments
CREATE POLICY "Staff can view payments" ON public.payments FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admin and receptionist can manage payments" ON public.payments FOR ALL USING (has_staff_role(auth.uid(), 'admin'::staff_role) OR has_staff_role(auth.uid(), 'receptionist'::staff_role));

-- RLS Policies for restaurant_tables
CREATE POLICY "Staff can view tables" ON public.restaurant_tables FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admin can manage tables" ON public.restaurant_tables FOR ALL USING (has_staff_role(auth.uid(), 'admin'::staff_role));

-- RLS Policies for menu_items
CREATE POLICY "Staff can view menu" ON public.menu_items FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Admin can manage menu" ON public.menu_items FOR ALL USING (has_staff_role(auth.uid(), 'admin'::staff_role));

-- RLS Policies for restaurant_orders
CREATE POLICY "Staff can view orders" ON public.restaurant_orders FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Staff can manage orders" ON public.restaurant_orders FOR ALL USING (is_staff(auth.uid()));

-- RLS Policies for order_items
CREATE POLICY "Staff can view order items" ON public.order_items FOR SELECT USING (is_staff(auth.uid()));
CREATE POLICY "Staff can manage order items" ON public.order_items FOR ALL USING (is_staff(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_restaurant_tables_updated_at BEFORE UPDATE ON public.restaurant_tables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_restaurant_orders_updated_at BEFORE UPDATE ON public.restaurant_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'F' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'C' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON public.restaurant_orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();