
import { 
  FileText, 
  Calculator, 
  User,
  CreditCard,
  FileCheck
} from 'lucide-react';

export const sections = [
  { id: 'general', title: 'Informations générales', icon: FileText, color: 'blue' },
  { id: 'imputation', title: 'Imputation budgétaire', icon: Calculator, color: 'green' },
  { id: 'beneficiaire', title: 'Bénéficiaire', icon: User, color: 'purple' },
  { id: 'paiement', title: 'Mode de paiement', icon: CreditCard, color: 'orange' },
  { id: 'documents', title: 'Documents', icon: FileCheck, color: 'indigo' }
];
