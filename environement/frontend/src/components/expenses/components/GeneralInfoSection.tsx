
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { NewEngagementFormData } from '../types/engagement';
import { formatCurrency } from '../utils/engagement-utils';

interface GeneralInfoSectionProps {
  register: UseFormRegister<NewEngagementFormData>;
  errors: FieldErrors<NewEngagementFormData>;
  watch: UseFormWatch<NewEngagementFormData>;
  setValue: UseFormSetValue<NewEngagementFormData>;
}

export const GeneralInfoSection = ({ register, errors, watch, setValue }: GeneralInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type_engagement" className="text-sm font-semibold text-gray-700 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Type d'engagement *
          </Label>
          <Select onValueChange={(value) => setValue('type_engagement', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Engagement normal
                </div>
              </SelectItem>
              <SelectItem value="urgent">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                  Engagement urgent
                </div>
              </SelectItem>
              <SelectItem value="exceptionnel">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                  Engagement exceptionnel
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.type_engagement && <span className="text-sm text-red-600">Ce champ est requis</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="montant" className="text-sm font-semibold text-gray-700 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Montant (GNF) *
          </Label>
          <Input
            id="montant"
            type="number"
            className="h-12 text-lg font-semibold"
            {...register('montant', { required: 'Ce champ est requis' })}
            placeholder="0"
          />
          {watch('montant') && (
            <p className="text-sm text-gray-600">
              {formatCurrency(watch('montant'))}
            </p>
          )}
          {errors.montant && <span className="text-sm text-red-600">{errors.montant.message}</span>}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="objet" className="text-sm font-semibold text-gray-700 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
          Objet de l'engagement *
        </Label>
        <Textarea
          id="objet"
          className="min-h-[120px] text-base"
          {...register('objet', { required: 'Ce champ est requis' })}
          placeholder="Décrivez précisément l'objet de cet engagement..."
        />
        {errors.objet && <span className="text-sm text-red-600">{errors.objet.message}</span>}
      </div>
    </div>
  );
};
