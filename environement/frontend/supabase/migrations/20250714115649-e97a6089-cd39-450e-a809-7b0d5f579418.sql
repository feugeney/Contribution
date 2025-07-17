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

-- Insérer quelques données d'exemple
INSERT INTO public.ministeres (nom, sigle) VALUES 
('Ministère des Affaires Étrangères', 'MAE'),
('Ministère de l''Économie et des Finances', 'MEF'),
('Ministère de l''Intérieur', 'MI')
ON CONFLICT (nom) DO NOTHING;

-- Insérer quelques organisations internationales avec leurs informations
WITH ministere_ids AS (
  SELECT id as mae_id FROM public.ministeres WHERE sigle = 'MAE' LIMIT 1
), mef_ids AS (
  SELECT id as mef_id FROM public.ministeres WHERE sigle = 'MEF' LIMIT 1
)
INSERT INTO public.organisations (nom, sigle, type_organisation, ministere_tutelle_id, devise_defaut, montant_cotisation_annuelle, description)
SELECT * FROM (
  VALUES 
    ('Organisation des Nations Unies', 'ONU', 'Organisation Internationale', (SELECT mae_id FROM ministere_ids), 'USD', 50000, 'Organisation internationale principale'),
    ('Union Africaine', 'UA', 'Organisation Régionale', (SELECT mae_id FROM ministere_ids), 'USD', 25000, 'Organisation régionale africaine'),
    ('Banque Mondiale', 'BM', 'Institution Financière', (SELECT mef_id FROM mef_ids), 'USD', 75000, 'Institution financière internationale'),
    ('Fonds Monétaire International', 'FMI', 'Institution Financière', (SELECT mef_id FROM mef_ids), 'USD', 60000, 'Fonds monétaire international')
) AS v(nom, sigle, type_organisation, ministere_tutelle_id, devise_defaut, montant_cotisation_annuelle, description)
ON CONFLICT (nom) DO NOTHING;