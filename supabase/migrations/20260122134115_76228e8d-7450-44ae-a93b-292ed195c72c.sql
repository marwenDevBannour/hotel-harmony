-- Create modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_m TEXT NOT NULL UNIQUE,
  libelle TEXT NOT NULL,
  ddeb DATE NOT NULL DEFAULT CURRENT_DATE,
  dfin DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sous_modules table
CREATE TABLE public.sous_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_s TEXT NOT NULL UNIQUE,
  libelle TEXT NOT NULL,
  ddeb DATE NOT NULL DEFAULT CURRENT_DATE,
  dfin DATE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create evnmts table
CREATE TABLE public.evnmts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_evnmt TEXT NOT NULL UNIQUE,
  libelle TEXT NOT NULL,
  ddeb DATE NOT NULL DEFAULT CURRENT_DATE,
  dfin DATE,
  bactif BOOLEAN NOT NULL DEFAULT true,
  sous_module_id UUID NOT NULL REFERENCES public.sous_modules(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sous_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evnmts ENABLE ROW LEVEL SECURITY;

-- Create policies for modules
CREATE POLICY "Admin can manage modules" 
ON public.modules 
FOR ALL 
USING (has_staff_role(auth.uid(), 'admin'::staff_role));

CREATE POLICY "Staff can view modules" 
ON public.modules 
FOR SELECT 
USING (is_staff(auth.uid()));

-- Create policies for sous_modules
CREATE POLICY "Admin can manage sous_modules" 
ON public.sous_modules 
FOR ALL 
USING (has_staff_role(auth.uid(), 'admin'::staff_role));

CREATE POLICY "Staff can view sous_modules" 
ON public.sous_modules 
FOR SELECT 
USING (is_staff(auth.uid()));

-- Create policies for evnmts
CREATE POLICY "Admin can manage evnmts" 
ON public.evnmts 
FOR ALL 
USING (has_staff_role(auth.uid(), 'admin'::staff_role));

CREATE POLICY "Staff can view evnmts" 
ON public.evnmts 
FOR SELECT 
USING (is_staff(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_sous_modules_module_id ON public.sous_modules(module_id);
CREATE INDEX idx_evnmts_sous_module_id ON public.evnmts(sous_module_id);

-- Create trigger for updated_at on modules
CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on sous_modules
CREATE TRIGGER update_sous_modules_updated_at
BEFORE UPDATE ON public.sous_modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on evnmts
CREATE TRIGGER update_evnmts_updated_at
BEFORE UPDATE ON public.evnmts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();