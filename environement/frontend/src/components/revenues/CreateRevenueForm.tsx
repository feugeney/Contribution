
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface RevenueFormData {
  type: 'subvention' | 'taxes' | 'financement_externe';
  source: string;
  montant: number;
  date: string;
  reference?: string;
  observations?: string;
}

interface CreateRevenueFormProps {
  onSubmit: (data: RevenueFormData) => void;
  onCancel: () => void;
}

export const CreateRevenueForm = ({ onSubmit, onCancel }: CreateRevenueFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RevenueFormData>();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('');

  const onFormSubmit = (data: RevenueFormData) => {
    onSubmit(data);
    toast({
      title: "Recette enregistrée",
      description: "La recette a été enregistrée avec succès.",
    });
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'subvention': 'Subvention',
      'taxes': 'Taxes et redevances',
      'financement_externe': 'Financement externe'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Saisir une Recette</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de recette</Label>
              <Select 
                value={selectedType} 
                onValueChange={(value) => {
                  setSelectedType(value);
                  setValue('type', value as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subvention">Subvention</SelectItem>
                  <SelectItem value="taxes">Taxes et redevances</SelectItem>
                  <SelectItem value="financement_externe">Financement externe</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <span className="text-sm text-red-600">Ce champ est requis</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source de financement</Label>
              <Input
                id="source"
                {...register('source', { required: 'Ce champ est requis' })}
                placeholder="Ex: Ministère du Budget, Banque Mondiale..."
              />
              {errors.source && (
                <span className="text-sm text-red-600">{errors.source.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="montant">Montant (GNF)</Label>
              <Input
                id="montant"
                type="number"
                {...register('montant', { 
                  required: 'Ce champ est requis',
                  min: { value: 1, message: 'Le montant doit être positif' }
                })}
                placeholder="0"
              />
              {errors.montant && (
                <span className="text-sm text-red-600">{errors.montant.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date de perception</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Ce champ est requis' })}
              />
              {errors.date && (
                <span className="text-sm text-red-600">{errors.date.message}</span>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reference">Référence (optionnel)</Label>
              <Input
                id="reference"
                {...register('reference')}
                placeholder="Numéro de référence ou de bordereau"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observations (optionnel)</Label>
            <Textarea
              id="observations"
              {...register('observations')}
              placeholder="Observations particulières..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer la recette
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
