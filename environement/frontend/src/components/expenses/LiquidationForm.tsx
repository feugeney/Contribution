
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Expense } from '@/types/budget';

interface LiquidationFormData {
  pieces_justificatives: string;
  numero_bon_commande?: string;
  numero_bon_livraison?: string;
  date_livraison?: string;
  observations?: string;
  date_liquidation: string;
  controle_conformite: boolean;
  verification_pieces: boolean;
}

interface LiquidationFormProps {
  expense: Expense;
  onSubmit: (data: LiquidationFormData) => void;
  onCancel: () => void;
}

export const LiquidationForm = ({ expense, onSubmit, onCancel }: LiquidationFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LiquidationFormData>();
  const { toast } = useToast();

  const onFormSubmit = (data: LiquidationFormData) => {
    onSubmit(data);
    toast({
      title: "Liquidation effectuée",
      description: "La liquidation a été effectuée avec succès.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Liquidation de la dépense</CardTitle>
        <p className="text-sm text-muted-foreground">
          Vérification des pièces justificatives et validation de la conformité
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Détails de l'engagement</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Libellé:</div>
            <div>{expense.libelle}</div>
            <div>Montant brut:</div>
            <div>{formatCurrency(expense.montant)}</div>
            <div>Date d'engagement:</div>
            <div>{new Date(expense.date).toLocaleDateString('fr-FR')}</div>
            <div>Retenues totales:</div>
            <div className="text-red-600">
              -{formatCurrency(expense.retenues.precompte + expense.retenues.tva + expense.retenues.armp)}
            </div>
            <div className="font-semibold">Montant net:</div>
            <div className="font-semibold text-green-600">
              {formatCurrency(expense.montant - expense.retenues.precompte - expense.retenues.tva - expense.retenues.armp)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Vérifications obligatoires */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Vérifications obligatoires</CardTitle>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="controle_conformite"
                  {...register('controle_conformite', { required: 'Cette vérification est obligatoire' })}
                  className="h-4 w-4"
                />
                <Label htmlFor="controle_conformite" className="text-sm">
                  J'ai vérifié la conformité de la prestation/livraison
                </Label>
              </div>
              {errors.controle_conformite && (
                <span className="text-sm text-red-600">{errors.controle_conformite.message}</span>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verification_pieces"
                  {...register('verification_pieces', { required: 'Cette vérification est obligatoire' })}
                  className="h-4 w-4"
                />
                <Label htmlFor="verification_pieces" className="text-sm">
                  J'ai vérifié la validité et la complétude des pièces justificatives
                </Label>
              </div>
              {errors.verification_pieces && (
                <span className="text-sm text-red-600">{errors.verification_pieces.message}</span>
              )}
            </div>
          </Card>

          {/* Pièces justificatives */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Pièces justificatives</CardTitle>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pieces_justificatives">Liste des pièces justificatives *</Label>
                <Textarea
                  id="pieces_justificatives"
                  {...register('pieces_justificatives', { required: 'Ce champ est requis' })}
                  placeholder="Détaillez toutes les pièces justificatives fournies (factures, bons de commande, bons de livraison, etc.)"
                  rows={4}
                />
                {errors.pieces_justificatives && (
                  <span className="text-sm text-red-600">{errors.pieces_justificatives.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_bon_commande">Numéro bon de commande</Label>
                  <Input
                    id="numero_bon_commande"
                    {...register('numero_bon_commande')}
                    placeholder="N° BC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero_bon_livraison">Numéro bon de livraison</Label>
                  <Input
                    id="numero_bon_livraison"
                    {...register('numero_bon_livraison')}
                    placeholder="N° BL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_livraison">Date de livraison/prestation</Label>
                <Input
                  id="date_livraison"
                  type="date"
                  {...register('date_livraison')}
                />
              </div>
            </div>
          </Card>

          {/* Informations de liquidation */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Informations de liquidation</CardTitle>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date_liquidation">Date de liquidation *</Label>
                <Input
                  id="date_liquidation"
                  type="date"
                  {...register('date_liquidation', { required: 'Ce champ est requis' })}
                />
                {errors.date_liquidation && (
                  <span className="text-sm text-red-600">{errors.date_liquidation.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  {...register('observations')}
                  placeholder="Observations particulières sur la liquidation..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Effectuer la liquidation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
