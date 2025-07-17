-- Create table for organizations
CREATE TABLE public.organisations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  sigle TEXT,
  type_organisation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for ministries
CREATE TABLE public.ministeres (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  sigle TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for mail reception
CREATE TABLE public.courriers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organisation_id UUID NOT NULL REFERENCES public.organisations(id),
  ministere_id UUID NOT NULL REFERENCES public.ministeres(id),
  montant_cotisation DECIMAL(15,2) NOT NULL,
  devise TEXT NOT NULL DEFAULT 'GNF',
  numero_courrier TEXT,
  date_reception DATE NOT NULL DEFAULT CURRENT_DATE,
  annee_cotisation INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  statut TEXT NOT NULL DEFAULT 'recu',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for contributions (cotisations)
CREATE TABLE public.cotisations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organisation_id UUID NOT NULL REFERENCES public.organisations(id),
  courrier_id UUID REFERENCES public.courriers(id),
  annee INTEGER NOT NULL,
  montant_attendu DECIMAL(15,2) NOT NULL,
  montant_paye DECIMAL(15,2) DEFAULT 0,
  montant_arrieres DECIMAL(15,2) DEFAULT 0,
  devise TEXT NOT NULL DEFAULT 'GNF',
  situation TEXT NOT NULL DEFAULT 'a-payer',
  date_echeance DATE,
  date_paiement DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministeres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotisations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security needs)
CREATE POLICY "Allow all operations on organisations" ON public.organisations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ministeres" ON public.ministeres FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on courriers" ON public.courriers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on cotisations" ON public.cotisations FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_organisations_updated_at
  BEFORE UPDATE ON public.organisations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ministeres_updated_at
  BEFORE UPDATE ON public.ministeres
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courriers_updated_at
  BEFORE UPDATE ON public.courriers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cotisations_updated_at
  BEFORE UPDATE ON public.cotisations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create contribution when mail is registered
CREATE OR REPLACE FUNCTION public.create_cotisation_from_courrier()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update contribution for the organization and year
  INSERT INTO public.cotisations (
    organisation_id,
    courrier_id,
    annee,
    montant_attendu,
    montant_paye,
    devise,
    situation,
    date_echeance
  ) VALUES (
    NEW.organisation_id,
    NEW.id,
    NEW.annee_cotisation,
    NEW.montant_cotisation,
    NEW.montant_cotisation,
    NEW.devise,
    'paye',
    CURRENT_DATE + INTERVAL '30 days'
  )
  ON CONFLICT (organisation_id, annee) 
  DO UPDATE SET
    montant_paye = cotisations.montant_paye + NEW.montant_cotisation,
    situation = CASE 
      WHEN cotisations.montant_paye + NEW.montant_cotisation >= cotisations.montant_attendu 
      THEN 'paye' 
      ELSE 'paye-partiellement' 
    END,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create contribution when mail is registered
CREATE TRIGGER create_cotisation_on_courrier_insert
  AFTER INSERT ON public.courriers
  FOR EACH ROW
  EXECUTE FUNCTION public.create_cotisation_from_courrier();

-- Add unique constraint to prevent duplicate contributions per year
ALTER TABLE public.cotisations 
ADD CONSTRAINT unique_organisation_annee UNIQUE (organisation_id, annee);

-- Insert some sample data
INSERT INTO public.ministeres (nom, sigle) VALUES 
('Ministere des Finances', 'MINFIN'),
('Ministere de la Planification', 'MINPLAN'),
('Ministere de l''Economie', 'MINECO');

INSERT INTO public.organisations (nom, sigle, type_organisation) VALUES 
('Office National des Statistiques', 'ONS', 'EPA'),
('Caisse Nationale de Securite Sociale', 'CNSS', 'EPA'),
('Port Autonome de Conakry', 'PAC', 'EPA');