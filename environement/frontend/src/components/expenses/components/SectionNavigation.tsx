
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getActiveSectionClasses } from '../utils/engagement-utils';
import { FormSection } from '../types/engagement';

interface SectionNavigationProps {
  sections: FormSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const SectionNavigation = ({ sections, activeSection, onSectionChange }: SectionNavigationProps) => {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Sections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${getActiveSectionClasses(section, isActive)}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{section.title}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};
