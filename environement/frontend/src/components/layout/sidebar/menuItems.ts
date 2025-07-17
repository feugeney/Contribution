
import { 
  LayoutDashboard, 
  Building2, 
  DollarSign, 
  CreditCard,
  AlertTriangle,
  Users, 
  Settings,
  Database,
  Coins,
  Plus,
  Edit,
  TrendingUp,
  Building,
  Mail,
  FileText,
  MailPlus,
  User,
  UserCog
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  subMenus?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { id: 'tableau-bord', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'organisations', label: 'Organisations Internationales', icon: Building2 },
  {
    id: 'gestion-courriers',
    label: 'Gestion des Courriers',
    icon: Mail,
    subMenus: [
      { id: 'courriers-reception', label: 'Réception des Courriers', icon: MailPlus },
      { id: 'courriers-liste', label: 'Liste des Courriers', icon: FileText }
    ]
  },
  { id: 'contributions', label: 'Contributions Annuelles', icon: DollarSign },
  { id: 'paiements', label: 'Paiements', icon: CreditCard },
  { id: 'arrieres', label: 'Suivi des Arriérés', icon: AlertTriangle },
  {
    id: 'referentiels',
    label: 'Référentiels',
    icon: Database,
    subMenus: [
      {
        id: 'devises',
        label: 'Devises',
        icon: Coins,
        subMenus: [
          { id: 'devise-creation', label: 'Création', icon: Plus },
          { id: 'devise-mise-a-jour', label: 'Mise à jour', icon: Edit },
          { id: 'devise-fixing', label: 'Fixing', icon: TrendingUp }
        ]
      },
      { id: 'ministeres', label: 'Ministères et Institutions', icon: Building },
      { id: 'budget-alloue', label: 'Budget Alloué', icon: DollarSign }
    ]
  },
  { 
    id: 'administration', 
    label: 'Administration', 
    icon: Users,
    subMenus: [
      { id: 'admin-users', label: 'Gestion des utilisateurs', icon: Users },
      { id: 'account-management', label: 'Gestion des comptes', icon: UserCog }
    ]
  },
  { id: 'profile', label: 'Mon Profil', icon: User },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];
