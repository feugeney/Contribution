
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

import { NewEngagementFormData, NewEngagementFormProps } from './types/engagement';
import { sections } from './constants/form-sections';
import { getHeaderClasses } from './utils/engagement-utils';

import { SectionNavigation } from './components/SectionNavigation';
import { GeneralInfoSection } from './components/GeneralInfoSection';
import { ImputationSection } from './components/ImputationSection';
import { BeneficiaireSection } from './components/BeneficiaireSection';
import { PaiementSection } from './components/PaiementSection';
import { DocumentsSection } from './components/DocumentsSection';
import { FormNavigation } from './components/FormNavigation';

export const NewEngagementForm = ({ onSubmit, onCancel }: NewEngagementFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<NewEngagementFormData>();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('general');

  const onFormSubmit = (data: NewEngagementFormData) => {
    onSubmit(data);
    toast({
      title: "Engagement créé avec succès",
      description: "L'engagement a été enregistré et est prêt pour transmission.",
    });
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralInfoSection register={register} errors={errors} watch={watch} setValue={setValue} />;
      case 'imputation':
        return <ImputationSection register={register} errors={errors} watch={watch} setValue={setValue} />;
      case 'beneficiaire':
        return <BeneficiaireSection register={register} errors={errors} setValue={setValue} />;
      case 'paiement':
        return <PaiementSection register={register} />;
      case 'documents':
        return <DocumentsSection register={register} watch={watch} />;
      default:
        return null;
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);
  const SectionIcon = currentSection?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Nouvelle Fiche d'Engagement
              </h1>
              <p className="text-lg text-gray-600">
                Créez un engagement budgétaire avec toutes les informations requises
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                N° ENG-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {new Date().toLocaleDateString('fr-FR')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation sidebar */}
          <div className="lg:col-span-1">
            <SectionNavigation 
              sections={sections} 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Card className="shadow-xl">
                <CardHeader className={getHeaderClasses(activeSection, sections)}>
                  <CardTitle className="text-xl flex items-center">
                    {SectionIcon && <SectionIcon className="h-6 w-6 mr-3" />}
                    {currentSection?.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8">
                  {renderSectionContent()}
                </CardContent>

                <FormNavigation 
                  sections={sections} 
                  activeSection={activeSection} 
                  onSectionChange={setActiveSection} 
                  onCancel={onCancel} 
                />
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
