
export interface NewEngagementFormData {
  type_engagement: string;
  section: string;
  sous_section: string;
  titre: string;
  chapitre: string;
  article: string;
  paragraphe: string;
  sous_paragraphe: string;
  credit_disponible: number;
  objet: string;
  type_beneficiaire: string;
  raison_sociale: string;
  banque: string;
  agence: string;
  numero_compte: string;
  pieces: string;
  precomptes: string;
  montant: number;
}

export interface NewEngagementFormProps {
  onSubmit: (data: NewEngagementFormData) => void;
  onCancel: () => void;
}

export interface FormSection {
  id: string;
  title: string;
  icon: any;
  color: string;
}
