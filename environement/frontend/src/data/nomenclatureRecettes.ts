
import { NomenclatureRecette } from '@/types/budget';

export const nomenclatureRecettes: NomenclatureRecette[] = [
  {
    type: 'impots_taxes',
    label: 'Impôts et taxes',
    sous_types: [
      {
        code: 'IT001',
        label: 'Impôt sur le revenu des personnes physiques',
        description: 'Impôt direct sur les revenus des particuliers'
      },
      {
        code: 'IT002',
        label: 'Impôt sur les sociétés',
        description: 'Impôt direct sur les bénéfices des entreprises'
      },
      {
        code: 'IT003',
        label: 'Taxe sur la valeur ajoutée (TVA)',
        description: 'Taxe indirecte sur la consommation'
      },
      {
        code: 'IT004',
        label: 'Taxes sur les produits pétroliers',
        description: 'Taxes spécifiques sur les carburants et lubrifiants'
      },
      {
        code: 'IT005',
        label: 'Droits de douane',
        description: 'Taxes sur les importations et exportations'
      },
      {
        code: 'IT006',
        label: 'Taxe foncière',
        description: 'Impôt sur la propriété immobilière'
      }
    ]
  },
  {
    type: 'recettes_domaniales',
    label: 'Recettes domaniales et immobilières',
    sous_types: [
      {
        code: 'RD001',
        label: 'Revenus des terres domaniales',
        description: 'Revenus de location ou concession des terres de l\'État'
      },
      {
        code: 'RD002',
        label: 'Revenus des bâtiments publics',
        description: 'Loyers des bâtiments appartenant à l\'État'
      },
      {
        code: 'RD003',
        label: 'Concessions minières',
        description: 'Revenus des droits d\'exploitation minière'
      },
      {
        code: 'RD004',
        label: 'Concessions forestières',
        description: 'Revenus de l\'exploitation forestière'
      },
      {
        code: 'RD005',
        label: 'Vente d\'actifs immobiliers',
        description: 'Produits de cession du patrimoine immobilier'
      }
    ]
  },
  {
    type: 'recettes_fonctionnement',
    label: 'Recettes de fonctionnement',
    sous_types: [
      {
        code: 'RF001',
        label: 'Prestations de services publics',
        description: 'Revenus des services rendus par l\'administration'
      },
      {
        code: 'RF002',
        label: 'Amendes et pénalités',
        description: 'Sanctions pécuniaires et contraventions'
      },
      {
        code: 'RF003',
        label: 'Frais administratifs',
        description: 'Frais de dossiers, timbres fiscaux, etc.'
      },
      {
        code: 'RF004',
        label: 'Redevances d\'utilisation',
        description: 'Redevances pour l\'usage des infrastructures publiques'
      },
      {
        code: 'RF005',
        label: 'Revenus financiers',
        description: 'Intérêts et dividendes des placements de l\'État'
      }
    ]
  },
  {
    type: 'recettes_exceptionnelles',
    label: 'Recettes exceptionnelles',
    sous_types: [
      {
        code: 'RE001',
        label: 'Dons et subventions',
        description: 'Aides financières reçues des partenaires'
      },
      {
        code: 'RE002',
        label: 'Legs et héritages',
        description: 'Biens légués à l\'État'
      },
      {
        code: 'RE003',
        label: 'Produits de cession d\'actifs',
        description: 'Ventes exceptionnelles de biens de l\'État'
      },
      {
        code: 'RE004',
        label: 'Recettes de régularisation',
        description: 'Régularisations comptables et reprises de provisions'
      },
      {
        code: 'RE005',
        label: 'Recouvrements exceptionnels',
        description: 'Récupération de créances anciennes'
      }
    ]
  }
];
