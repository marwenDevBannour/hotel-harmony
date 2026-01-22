-- Ajouter le type de composant aux événements
ALTER TABLE public.evnmts 
ADD COLUMN component_type text NOT NULL DEFAULT 'form';

-- Ajouter un commentaire pour documenter les valeurs possibles
COMMENT ON COLUMN public.evnmts.component_type IS 'Type de composant: form, table, list, dashboard, settings';

-- Créer un index pour les recherches par type
CREATE INDEX idx_evnmts_component_type ON public.evnmts(component_type);