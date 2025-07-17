-- Ajouter une colonne pour stocker les fichiers de courriers électroniques
ALTER TABLE public.courriers 
ADD COLUMN fichier_courrier_url TEXT;

-- Mettre à jour les commentaires des colonnes existantes
COMMENT ON COLUMN public.courriers.organisation_id IS 'Organisation internationale pour laquelle on paie la cotisation';
COMMENT ON COLUMN public.courriers.fichier_courrier_url IS 'URL du fichier du courrier électronique joint';