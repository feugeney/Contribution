
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileCheck } from 'lucide-react';
import { NewEngagementFormData } from '../types/engagement';
import { formatCurrency } from '../utils/engagement-utils';

interface DocumentsSectionProps {
  register: UseFormRegister<NewEngagementFormData>;
  watch: UseFormWatch<NewEngagementFormData>;
}

export const DocumentsSection = ({ register, watch }: DocumentsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center">
            <FileCheck className="h-4 w-4 mr-2" />
            Pièces jointes
          </Label>
          <Textarea
            {...register('pieces')}
            placeholder="Liste des pièces jointes requises..."
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Précomptes</Label>
          <Textarea
            {...register('precomptes')}
            placeholder="Détails des précomptes applicables..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="font-semibold text-indigo-800 mb-4">Résumé de l'engagement</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Type:</span> 
            <span className="ml-2">{watch('type_engagement') || 'Non défini'}</span>
          </div>
          <div>
            <span className="font-medium">Montant:</span> 
            <span className="ml-2 font-semibold text-indigo-700">
              {watch('montant') ? formatCurrency(watch('montant')) : 'Non défini'}
            </span>
          </div>
          <div className="col-span-2">
            <span className="font-medium">Bénéficiaire:</span> 
            <span className="ml-2">{watch('raison_sociale') || 'Non défini'}</span>
          </div>
          <div className="col-span-2">
            <span className="font-medium">Objet:</span> 
            <span className="ml-2">{watch('objet')?.substring(0, 100) || 'Non défini'}{watch('objet')?.length > 100 ? '...' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
