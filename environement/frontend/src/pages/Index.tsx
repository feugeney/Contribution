import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import OrganisationsManagement from '@/components/organisations/OrganisationsManagement';
import { CourriersReception } from '@/components/courriers/CourriersReception';
import { CourriersList } from '@/components/courriers/CourriersList';
import { ContributionsManagement } from '@/components/contributions/ContributionsManagement';
import { PaiementsManagement } from '@/components/paiements/PaiementsManagement';
import { ArrieresSuivi } from '@/components/arrieres/ArrieresSuivi';
import { UserManagement } from '@/components/admin/UserManagement';
import { AccountManagement } from '@/components/admin/AccountManagement';
import { MinistereManagement } from '@/components/admin/MinistereManagement';
import { BudgetAlloueManagement } from '@/components/referentiels/BudgetAlloueManagement';
import { ApplicationSettings } from '@/components/settings/ApplicationSettings';
import { LoginForm } from '@/components/auth/LoginForm';
import { UserProfile } from '@/components/profile/UserProfile';
import { DeviseCreation } from '@/components/referentiels/DeviseCreation';
import { DeviseMiseAJour } from '@/components/referentiels/DeviseMiseAJour';
import { DeviseFixing } from '@/components/referentiels/DeviseFixing';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('tableau-bord');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tableau-bord':
        return <Dashboard />;
      case 'organisations':
        return <OrganisationsManagement />;
      case 'courriers-reception':
        return <CourriersReception />;
      case 'courriers-liste':
        return <CourriersList />;
      case 'contributions':
        return <ContributionsManagement />;
      case 'paiements':
        return <PaiementsManagement />;
      case 'arrieres':
        return <ArrieresSuivi />;
      case 'admin-users':
        return <UserManagement />;
      case 'account-management':
        return <AccountManagement />;
      case 'ministeres':
        return <MinistereManagement />;
      case 'budget-alloue':
        return <BudgetAlloueManagement />;
      case 'devise-creation':
        return <DeviseCreation />;
      case 'devise-mise-a-jour':
        return <DeviseMiseAJour />;
      case 'devise-fixing':
        return <DeviseFixing />;
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <ApplicationSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
