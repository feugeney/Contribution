
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, User, Building } from 'lucide-react';
import { NewEngagementFormData } from '../types/engagement';

interface BeneficiaireSectionProps {
  register: UseFormRegister<NewEngagementFormData>;
  errors: FieldErrors<NewEngagementFormData>;
  setValue: UseFormSetValue<NewEngagementFormData>;
}

export const BeneficiaireSection = ({ register, errors, setValue }: BeneficiaireSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Type de bénéficiaire *
          </Label>
          <Select onValueChange={(value) => setValue('type_beneficiaire', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physique">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Personne physique
                </div>
              </SelectItem>
              <SelectItem value="morale">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Personne morale
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Raison sociale *
          </Label>
          <Input
            className="h-12"
            {...register('raison_sociale', { required: 'Ce champ est requis' })}
            placeholder="Nom/Raison sociale"
          />
          {errors.raison_sociale && <span className="text-sm text-red-600">{errors.raison_sociale.message}</span>}
        </div>
      </div>
    </div>
  );
};
