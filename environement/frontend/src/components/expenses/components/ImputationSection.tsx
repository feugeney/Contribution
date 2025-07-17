
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { NewEngagementFormData } from '../types/engagement';
import { formatCurrency } from '../utils/engagement-utils';

interface ImputationSectionProps {
  register: UseFormRegister<NewEngagementFormData>;
  errors: FieldErrors<NewEngagementFormData>;
  watch: UseFormWatch<NewEngagementFormData>;
  setValue: UseFormSetValue<NewEngagementFormData>;
}

export const ImputationSection = ({ register, errors, watch, setValue }: ImputationSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Classification budgétaire</h3>
        <p className="text-sm text-blue-600">
          Renseignez les codes d'imputation selon la nomenclature budgétaire
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Section</Label>
          <Input {...register('section')} placeholder="Ex: 18" className="h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Sous-section</Label>
          <Input {...register('sous_section')} placeholder="Ex: 01" className="h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Titre</Label>
          <Select onValueChange={(value) => setValue('titre', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Titre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="titre1">Titre 1 - Personnel</SelectItem>
              <SelectItem value="titre2">Titre 2 - Fonctionnement</SelectItem>
              <SelectItem value="titre3">Titre 3 - Investissement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Chapitre</Label>
          <Input {...register('chapitre')} placeholder="Ex: 001" className="h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Article</Label>
          <Input {...register('article')} placeholder="Ex: 10" className="h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Paragraphe</Label>
          <Input {...register('paragraphe')} placeholder="Ex: 01" className="h-12" />
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
          Crédit disponible *
        </Label>
        <Input
          type="number"
          className="h-12 text-lg"
          {...register('credit_disponible', { required: 'Ce champ est requis' })}
          placeholder="Montant disponible"
        />
        {watch('credit_disponible') && (
          <p className="text-sm text-gray-600">
            {formatCurrency(watch('credit_disponible'))}
          </p>
        )}
        {errors.credit_disponible && <span className="text-sm text-red-600">{errors.credit_disponible.message}</span>}
      </div>
    </div>
  );
};
