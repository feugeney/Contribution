export interface BudgetLine {
  id: string;
  code: string;
  libelle: string;
  montant_prevu: number;
  montant_engage: number;
  montant_paye: number;
  montant_liquide?: number;
  montant_ordonnance?: number;
  nature_economique: string;
  nature?: string;
}

export interface Revenue {
  id: string;
  type: 'impots_taxes' | 'recettes_domaniales' | 'recettes_fonctionnement' | 'recettes_exceptionnelles';
  sous_type?: string;
  source: string;
  montant: number;
  date: string;
  titre: string;
  chapitre: string;
  article: string;
  paragraphe: string;
  sous_paragraphe?: string;
  description?: string;
}

export interface Ministere {
  id: string;
  nom: string;
  code: string;
  ministre: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

export interface EPA {
  id: string;
  nom: string;
  code: string;
  directeur_general: string;
  ministere_id: string;
  secteur_activite: string;
  region: string;
  prefecture: string;
  sous_prefecture: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  date_creation?: string;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  name: string; // Adding for compatibility
  email: string;
  role: string;
  epa_id?: string;
  epa?: string; // Adding for compatibility
  ministere_id?: string;
  actif: boolean;
  date_creation: string;
}

export interface Expense {
  id: string;
  numero: string;
  type: 'engagement' | 'liquidation' | 'mandatement';
  statut: 'brouillon' | 'transmis' | 'valide' | 'rejete' | 'paye';
  status: string; // Adding for compatibility
  montant: number;
  beneficiaire: string;
  objet: string;
  libelle: string; // Adding missing property
  date_creation: string;
  date: string; // Adding for compatibility
  date_transmission?: string;
  date_validation?: string;
  budget_line_id: string;
  retenues: { // Adding missing property
    precompte: number;
    tva: number;
    armp: number;
  };
}

export interface NomenclatureRecette {
  type: 'impots_taxes' | 'recettes_domaniales' | 'recettes_fonctionnement' | 'recettes_exceptionnelles';
  label: string;
  sous_types: {
    code: string;
    label: string;
    description?: string;
  }[];
}

export interface TransmissionEngagement {
  id: string;
  engagement_id: string;
  date_transmission: string;
  transmis_par: string;
  destinataire: string;
  statut: 'transmis' | 'recu' | 'en_traitement' | 'retourne';
  commentaire?: string;
  pieces_jointes: string[];
}
