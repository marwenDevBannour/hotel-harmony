-- Create enum types
CREATE TYPE public.room_status AS ENUM ('available', 'occupied', 'cleaning', 'maintenance', 'reserved');
CREATE TYPE public.room_type AS ENUM ('standard', 'superior', 'deluxe', 'suite', 'presidential');
CREATE TYPE public.reservation_status AS ENUM ('confirmed', 'pending', 'checked_in', 'checked_out', 'cancelled');
CREATE TYPE public.reservation_source AS ENUM ('direct', 'website', 'booking', 'expedia', 'phone');
CREATE TYPE public.staff_role AS ENUM ('admin', 'receptionist', 'housekeeping', 'restaurant', 'maintenance');

-- Staff profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Staff roles table (separate for security)
CREATE TABLE public.staff_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role staff_role NOT NULL DEFAULT 'receptionist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  floor INTEGER NOT NULL DEFAULT 1,
  type room_type NOT NULL DEFAULT 'standard',
  status room_status NOT NULL DEFAULT 'available',
  capacity INTEGER NOT NULL DEFAULT 2,
  price_per_night DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  amenities TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Guests table
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT,
  id_type TEXT,
  id_number TEXT,
  vip BOOLEAN NOT NULL DEFAULT false,
  total_stays INTEGER NOT NULL DEFAULT 0,
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_number TEXT NOT NULL UNIQUE,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE RESTRICT,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status reservation_status NOT NULL DEFAULT 'pending',
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  source reservation_source NOT NULL DEFAULT 'direct',
  special_requests TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_staff_role(_user_id UUID, _role staff_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is any staff member
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_roles WHERE user_id = _user_id
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_staff(auth.uid()));

-- Staff roles policies
CREATE POLICY "Users can view own roles" ON public.staff_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.staff_roles
  FOR ALL USING (public.has_staff_role(auth.uid(), 'admin'));

-- Rooms policies (all staff can view, admin/receptionist can modify)
CREATE POLICY "Staff can view rooms" ON public.rooms
  FOR SELECT USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin and receptionist can manage rooms" ON public.rooms
  FOR ALL USING (
    public.has_staff_role(auth.uid(), 'admin') OR 
    public.has_staff_role(auth.uid(), 'receptionist')
  );

-- Guests policies
CREATE POLICY "Staff can view guests" ON public.guests
  FOR SELECT USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin and receptionist can manage guests" ON public.guests
  FOR ALL USING (
    public.has_staff_role(auth.uid(), 'admin') OR 
    public.has_staff_role(auth.uid(), 'receptionist')
  );

-- Reservations policies
CREATE POLICY "Staff can view reservations" ON public.reservations
  FOR SELECT USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin and receptionist can manage reservations" ON public.reservations
  FOR ALL USING (
    public.has_staff_role(auth.uid(), 'admin') OR 
    public.has_staff_role(auth.uid(), 'receptionist')
  );

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', 'Nouveau'),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', 'Utilisateur'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate reservation number function
CREATE OR REPLACE FUNCTION public.generate_reservation_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.reservation_number := 'R' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_reservation_number
  BEFORE INSERT ON public.reservations
  FOR EACH ROW
  WHEN (NEW.reservation_number IS NULL)
  EXECUTE FUNCTION public.generate_reservation_number();