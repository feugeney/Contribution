import { BudgetLine, Revenue, Expense, EPA } from '@/types/budget';

export const mockEPA: EPA = {
  id: '1',
  nom: 'Établissement Public Administratif de Conakry',
  code: 'EPAC-001',
  directeur_general: 'Dr. Mamadou Diallo',
  ministere_id: '1',
  secteur_activite: 'Administration publique',
  region: 'Conakry',
  prefecture: 'Conakry',
  sous_prefecture: 'Kaloum',
  date_creation: '2023-01-01'
};

export const mockBudgetLines: BudgetLine[] = [
  {
    id: '1',
    code: 'TRT-001',
    nature: 'traitement_salaire',
    nature_economique: 'Personnel',
    libelle: 'Traitements et salaires du personnel',
    montant_prevu: 2500000000,
    montant_engage: 1875000000,
    montant_liquide: 1750000000,
    montant_ordonnance: 1625000000,
    montant_paye: 1500000000
  },
  {
    id: '2',
    code: 'FOU-001',
    nature: 'biens_services',
    nature_economique: 'Fonctionnement',
    libelle: 'Fournitures de bureau et services',
    montant_prevu: 800000000,
    montant_engage: 650000000,
    montant_liquide: 580000000,
    montant_ordonnance: 520000000,
    montant_paye: 480000000
  },
  {
    id: '3',
    code: 'EQU-001',
    nature: 'investissements',
    nature_economique: 'Investissement',
    libelle: 'Équipements et infrastructures',
    montant_prevu: 1200000000,
    montant_engage: 850000000,
    montant_liquide: 720000000,
    montant_ordonnance: 650000000,
    montant_paye: 600000000
  }
];

export const mockRevenues: Revenue[] = [
  {
    id: '1',
    type: 'recettes_exceptionnelles',
    sous_type: 'RE001',
    source: 'Ministère du Budget',
    montant: 3000000000,
    date: '2024-01-15',
    titre: '01',
    chapitre: '001',
    article: '10',
    paragraphe: '01',
    description: 'Subvention de fonctionnement'
  },
  {
    id: '2',
    type: 'impots_taxes',
    sous_type: 'IT003',
    source: 'Direction Générale des Impôts',
    montant: 800000000,
    date: '2024-02-10',
    titre: '01',
    chapitre: '002',
    article: '11',
    paragraphe: '02',
    description: 'Taxes et redevances diverses'
  },
  {
    id: '3',
    type: 'recettes_exceptionnelles',
    sous_type: 'RE001',
    source: 'Banque Mondiale',
    montant: 700000000,
    date: '2024-03-05',
    titre: '01',
    chapitre: '003',
    article: '12',
    paragraphe: '01',
    description: 'Financement externe pour projet de développement'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    numero: 'ENG-2024-001',
    type: 'engagement',
    statut: 'paye',
    status: 'paiement',
    budget_line_id: '1',
    libelle: 'Salaires mois de Juin 2024',
    objet: 'Paiement des salaires',
    beneficiaire: 'Personnel EPAC',
    montant: 125000000,
    retenues: {
      precompte: 12500000,
      tva: 62500000,
      armp: 75000
    },
    date: '2024-06-01',
    date_creation: '2024-06-01'
  },
  {
    id: '2',
    numero: 'ENG-2024-002',
    type: 'engagement',
    statut: 'valide',
    status: 'ordonnancement',
    budget_line_id: '2',
    libelle: 'Fournitures informatiques',
    objet: 'Achat équipements informatiques',
    beneficiaire: 'Fournisseur Tech',
    montant: 45000000,
    retenues: {
      precompte: 4500000,
      tva: 22500000,
      armp: 27000
    },
    date: '2024-06-10',
    date_creation: '2024-06-10'
  }
];
