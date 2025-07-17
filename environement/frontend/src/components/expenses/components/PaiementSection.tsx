
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CreditCard } from 'lucide-react';
import { NewEngagementFormData } from '../types/engagement';

interface PaiementSectionProps {
  register: UseFormRegister<NewEngagementFormData>;
}

export const PaiementSection = ({ register }: PaiementSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Informations bancaires
        </h3>
        <p className="text-sm text-orange-600">
          Renseignez les coordonnées bancaires pour le règlement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Banque</Label>
          <Input {...register('banque')} placeholder="Nom de la banque" className="h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Agence</Label>
          <Input {...register('agence')} placeholder="Nom de l'agence" className="h-12" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-sm font-semibold text-gray-700">Numéro de compte</Label>
          <Input {...register('numero_compte')} placeholder="Numéro de compte bancaire" className="h-12" />
        </div>
      </div>
    </div>
  );
};
