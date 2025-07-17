
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Expense } from '@/types/budget';

interface OrdonnancementFormData {
  numero_mandat: string;
  date_ordonnancement: string;
  mode_paiement: 'virement' | 'cheque' | 'especes';
  banque_beneficiaire?: string;
  rib_beneficiaire?: string;
  numero_cheque?: string;
  observations?: string;
  visa_daf: boolean;
  visa_agent_comptable: boolean;
}

interface OrdonnancementFormProps {
  expense: Expense;
  onSubmit: (data: OrdonnancementFormData) => void;
  onCancel: () => void;
}

export const OrdonnancementForm = ({ expense, onSubmit, onCancel }: OrdonnancementFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<OrdonnancementFormData>();
  const { toast } = useToast();
  const [modePaiement, setModePaiement] = useState<'virement' | 'cheque' | 'especes'>('virement');

  const watchModePaiement = watch('mode_paiement');

  const onFormSubmit = (data: OrdonnancementFormData) => {
    onSubmit(data);
    toast({
      title: "Ordonnancement effectué",
      description: "L'ordonnancement a été effectué avec succès.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const montantNet = expense.montant - expense.retenues.precompte - expense.retenues.tva - expense.retenues.armp;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Ordonnancement et Mandatement</CardTitle>
        <p className="text-sm text-muted-foreground">
          Création du mandat de paiement et définition des modalités
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Récapitulatif de la dépense</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Libellé:</div>
            <div>{expense.libelle}</div>
            <div>Montant brut:</div>
            <div>{formatCurrency(expense.montant)}</div>
            <div>Précompte:</div>
            <div className="text-red-600">-{formatCurrency(expense.retenues.precompte)}</div>
            <div>TVA:</div>
            <div className="text-red-600">-{formatCurrency(expense.retenues.tva)}</div>
            <div>ARMP:</div>
            <div className="text-red-600">-{formatCurrency(expense.retenues.armp)}</div>
            <div className="font-semibold border-t pt-2">Montant net à payer:</div>
            <div className="font-semibold text-green-600 border-t pt-2">{formatCurrency(montantNet)}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Informations du mandat */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Informations du mandat</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero_mandat">Numéro de mandat *</Label>
                <Input
                  id="numero_mandat"
                  {...register('numero_mandat', { required: 'Ce champ est requis' })}
                  placeholder="N° du mandat"
                />
                {errors.numero_mandat && (
                  <span className="text-sm text-red-600">{errors.numero_mandat.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_ordonnancement">Date d'ordonnancement *</Label>
                <Input
                  id="date_ordonnancement"
                  type="date"
                  {...register('date_ordonnancement', { required: 'Ce champ est requis' })}
                />
                {errors.date_ordonnancement && (
                  <span className="text-sm text-red-600">{errors.date_ordonnancement.message}</span>
                )}
              </div>
            </div>
          </Card>

          {/* Mode de paiement */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Mode de paiement</CardTitle>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mode_paiement">Mode de paiement *</Label>
                <Select 
                  value={modePaiement} 
                  onValueChange={(value: 'virement' | 'cheque' | 'especes') => {
                    setModePaiement(value);
                    setValue('mode_paiement', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virement">Virement bancaire</SelectItem>
                    <SelectItem value="cheque">Chèque</SelectItem>
                    <SelectItem value="especes">Espèces</SelectItem>
                  </SelectContent>
                </Select>
                {errors.mode_paiement && (
                  <span className="text-sm text-red-600">{errors.mode_paiement.message}</span>
                )}
              </div>

              {/* Informations spécifiques au mode de paiement */}
              {modePaiement === 'virement' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="banque_beneficiaire">Banque bénéficiaire</Label>
                    <Input
                      id="banque_beneficiaire"
                      {...register('banque_beneficiaire')}
                      placeholder="Nom de la banque"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rib_beneficiaire">RIB/IBAN bénéficiaire</Label>
                    <Input
                      id="rib_beneficiaire"
                      {...register('rib_beneficiaire')}
                      placeholder="Numéro RIB ou IBAN"
                    />
                  </div>
                </div>
              )}

              {modePaiement === 'cheque' && (
                <div className="space-y-2">
                  <Label htmlFor="numero_cheque">Numéro de chèque</Label>
                  <Input
                    id="numero_cheque"
                    {...register('numero_cheque')}
                    placeholder="Numéro du chèque"
                  />
                </div>
              )}

              {modePaiement === 'especes' && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Attention :</strong> Le paiement en espèces est soumis à des limites réglementaires.
                    Vérifiez que le montant respecte les seuils autorisés.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Visas obligatoires */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Visas obligatoires</CardTitle>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="visa_daf"
                  {...register('visa_daf', { required: 'Le visa du DAF est obligatoire' })}
                  className="h-4 w-4"
                />
                <Label htmlFor="visa_daf" className="text-sm">
                  Visa du Directeur Administratif et Financier (DAF)
                </Label>
              </div>
              {errors.visa_daf && (
                <span className="text-sm text-red-600">{errors.visa_daf.message}</span>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="visa_agent_comptable"
                  {...register('visa_agent_comptable', { required: "Le visa de l'agent comptable est obligatoire" })}
                  className="h-4 w-4"
                />
                <Label htmlFor="visa_agent_comptable" className="text-sm">
                  Visa de l'Agent Comptable
                </Label>
              </div>
              {errors.visa_agent_comptable && (
                <span className="text-sm text-red-600">{errors.visa_agent_comptable.message}</span>
              )}
            </div>
          </Card>

          {/* Observations */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Observations</CardTitle>
            <div className="space-y-2">
              <Label htmlFor="observations">Observations particulières</Label>
              <Textarea
                id="observations"
                {...register('observations')}
                placeholder="Observations sur l'ordonnancement..."
                rows={3}
              />
            </div>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Effectuer l'ordonnancement
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
