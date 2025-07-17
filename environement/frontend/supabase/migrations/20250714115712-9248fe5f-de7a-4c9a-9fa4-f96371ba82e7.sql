-- Ajouter des colonnes pour la tutelle (ministère) et la devise par défaut à la table organisations
ALTER TABLE public.organisations 
ADD COLUMN ministere_tutelle_id UUID REFERENCES public.ministeres(id),
ADD COLUMN devise_defaut TEXT DEFAULT 'GNF',
ADD COLUMN montant_cotisation_annuelle NUMERIC DEFAULT 0,
ADD COLUMN description TEXT;

-- Mettre à jour les commentaires des nouvelles colonnes
COMMENT ON COLUMN public.organisations.ministere_tutelle_id IS 'Ministère de tutelle de l''organisation';
COMMENT ON COLUMN public.organisations.devise_defaut IS 'Devise par défaut pour les cotisations de cette organisation';
COMMENT ON COLUMN public.organisations.montant_cotisation_annuelle IS 'Montant de cotisation annuelle par défaut';
COMMENT ON COLUMN public.organisations.description IS 'Description de l''organisation';

-- Insérer quelques ministères s'ils n'existent pas déjà
INSERT INTO public.ministeres (nom, sigle) 
SELECT 'Ministère des Affaires Étrangères', 'MAE'
WHERE NOT EXISTS (SELECT 1 FROM public.ministeres WHERE sigle = 'MAE');

INSERT INTO public.ministeres (nom, sigle) 
SELECT 'Ministère de l''Économie et des Finances', 'MEF'
WHERE NOT EXISTS (SELECT 1 FROM public.ministeres WHERE sigle = 'MEF');

INSERT INTO public.ministeres (nom, sigle) 
SELECT 'Ministère de l''Intérieur', 'MI'
WHERE NOT EXISTS (SELECT 1 FROM public.ministeres WHERE sigle = 'MI');

-- Insérer quelques organisations internationales avec leurs informations
INSERT INTO public.organisations (nom, sigle, type_organisation, ministere_tutelle_id, devise_defaut, montant_cotisation_annuelle, description)
SELECT 
  'Organisation des Nations Unies', 
  'ONU', 
  'Organisation Internationale', 
  (SELECT id FROM public.ministeres WHERE sigle = 'MAE' LIMIT 1), 
  'USD', 
  50000, 
  'Organisation internationale principale'
WHERE NOT EXISTS (SELECT 1 FROM public.organisations WHERE sigle = 'ONU');

INSERT INTO public.organisations (nom, sigle, type_organisation, ministere_tutelle_id, devise_defaut, montant_cotisation_annuelle, description)
SELECT 
  'Union Africaine', 
  'UA', 
  'Organisation Régionale', 
  (SELECT id FROM public.ministeres WHERE sigle = 'MAE' LIMIT 1), 
  'USD', 
  25000, 
  'Organisation régionale africaine'
WHERE NOT EXISTS (SELECT 1 FROM public.organisations WHERE sigle = 'UA');

INSERT INTO public.organisations (nom, sigle, type_organisation, ministere_tutelle_id, devise_defaut, montant_cotisation_annuelle, description)
SELECT 
  'Banque Mondiale', 
  'BM', 
  'Institution Financière', 
  (SELECT id FROM public.ministeres WHERE sigle = 'MEF' LIMIT 1), 
  'USD', 
  75000, 
  'Institution financière internationale'
WHERE NOT EXISTS (SELECT 1 FROM public.organisations WHERE sigle = 'BM');

INSERT INTO public.organisations (nom, sigle, type_organisation, ministere_tutelle_id, devise_defaut, montant_cotisation_annuelle, description)
SELECT 
  'Fonds Monétaire International', 
  'FMI', 
  'Institution Financière', 
  (SELECT id FROM public.ministeres WHERE sigle = 'MEF' LIMIT 1), 
  'USD', 
  60000, 
  'Fonds monétaire international'
WHERE NOT EXISTS (SELECT 1 FROM public.organisations WHERE sigle = 'FMI');