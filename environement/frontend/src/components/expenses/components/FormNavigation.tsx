
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { FormSection } from '../types/engagement';

interface FormNavigationProps {
  sections: FormSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onCancel: () => void;
}

export const FormNavigation = ({ sections, activeSection, onSectionChange, onCancel }: FormNavigationProps) => {
  const currentIndex = sections.findIndex(s => s.id === activeSection);
  const isLastSection = currentIndex === sections.length - 1;
  const isFirstSection = currentIndex === 0;

  return (
    <div className="bg-gray-50 px-8 py-6 border-t flex justify-between">
      <div>
        {!isFirstSection && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onSectionChange(sections[currentIndex - 1].id)}
            className="px-6"
          >
            Précédent
          </Button>
        )}
      </div>

      <div className="flex space-x-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        
        {!isLastSection ? (
          <Button
            type="button"
            onClick={() => onSectionChange(sections[currentIndex + 1].id)}
            className="px-6"
          >
            Suivant
          </Button>
        ) : (
          <Button type="submit" className="px-6">
            <Save className="w-4 h-4 mr-2" />
            Créer l'engagement
          </Button>
        )}
      </div>
    </div>
  );
};
