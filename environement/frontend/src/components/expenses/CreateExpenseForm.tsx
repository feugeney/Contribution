
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { mockBudgetLines } from '@/data/mockData';

interface ExpenseFormData {
  budget_line_id: string;
  libelle: string;
  montant: number;
  procedure_type: 'normale' | 'amenagee';
  beneficiaire_type: 'personne_physique' | 'personne_morale';
  beneficiaire_nom: string;
  beneficiaire_adresse?: string;
  beneficiaire_tel?: string;
  beneficiaire_email?: string;
  numero_facture?: string;
  date_facture?: string;
  objet_depense: string;
  justification: string;
}

interface CreateExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
}

export const CreateExpenseForm = ({ onSubmit, onCancel }: CreateExpenseFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ExpenseFormData>();
  const { toast } = useToast();
  const [selectedBudgetLine, setSelectedBudgetLine] = useState<string>('');
  const [procedureType, setProcedureType] = useState<'normale' | 'amenagee'>('normale');
  const [beneficiaireType, setBeneficiaireType] = useState<'personne_physique' | 'personne_morale'>('personne_physique');

  const montant = watch('montant');

  const calculateImputations = (montant: number, procedure: 'normale' | 'amenagee') => {
    const base = Number(montant) || 0;
    
    if (procedure === 'amenagee') {
      // Procédure aménagée - retenues réduites
      const precompte = base * 0.05; // 5% au lieu de 10%
      const tva = base * 0.18; // 18% au lieu de 50%
      const armp = base * 0.0003; // 0.03% au lieu de 0.06%
      return { precompte, tva, armp };
    } else {
      // Procédure normale
      const precompte = base * 0.10; // 10%
      const tva = base * 0.50; // 50%
      const armp = base * 0.0006; // 0.06%
      return { precompte, tva, armp };
    }
  };

  const imputations = montant ? calculateImputations(Number(montant), procedureType) : { precompte: 0, tva: 0, armp: 0 };
  const montantNet = montant ? Number(montant) - imputations.precompte - imputations.tva - imputations.armp : 0;

  const onFormSubmit = (data: ExpenseFormData) => {
    const formDataWithProcedure = {
      ...data,
      procedure_type: procedureType,
      beneficiaire_type: beneficiaireType,
      imputations: imputations,
      montant_net: montantNet
    };
    onSubmit(formDataWithProcedure);
    toast({
      title: "Engagement créé",
      description: `Engagement ${procedureType} créé avec succès.`,
    });
  };

  const selectedBudgetLineData = mockBudgetLines.find(line => line.id === selectedBudgetLine);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Créer un Engagement</CardTitle>
        <p className="text-sm text-muted-foreground">
          Création d'un engagement budgétaire avec imputations complètes
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Type de procédure */}
          <Card className="p-4">
            <Label className="text-base font-semibold">Type de procédure</Label>
            <RadioGroup 
              value={procedureType} 
              onValueChange={(value: 'normale' | 'amenagee') => {
                setProcedureType(value);
                setValue('procedure_type', value);
              }}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normale" id="normale" />
                <Label htmlFor="normale">Procédure normale (retenues standards)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amenagee" id="amenagee" />
                <Label htmlFor="amenagee">Procédure aménagée (retenues réduites)</Label>
              </div>
            </RadioGroup>
          </Card>

          {/* Informations budgétaires */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Imputations budgétaires</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_line">Ligne budgétaire *</Label>
                <Select 
                  value={selectedBudgetLine} 
                  onValueChange={(value) => {
                    setSelectedBudgetLine(value);
                    setValue('budget_line_id', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ligne budgétaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBudgetLines.map((line) => (
                      <SelectItem key={line.id} value={line.id}>
                        {line.libelle} - Disponible: {(line.montant_prevu - line.montant_engage).toLocaleString()} GNF
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.budget_line_id && (
                  <span className="text-sm text-red-600">Ce champ est requis</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="montant">Montant (GNF) *</Label>
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
            </div>

            {selectedBudgetLineData && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-sm">Informations ligne budgétaire</h4>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div>Budget prévu:</div>
                  <div>{selectedBudgetLineData.montant_prevu.toLocaleString()} GNF</div>
                  <div>Déjà engagé:</div>
                  <div>{selectedBudgetLineData.montant_engage.toLocaleString()} GNF</div>
                  <div>Disponible:</div>
                  <div className="font-semibold text-green-600">
                    {(selectedBudgetLineData.montant_prevu - selectedBudgetLineData.montant_engage).toLocaleString()} GNF
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Informations sur la dépense */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Détails de la dépense</CardTitle>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="libelle">Libellé de la dépense *</Label>
                <Input
                  id="libelle"
                  {...register('libelle', { required: 'Ce champ est requis' })}
                  placeholder="Description de la dépense"
                />
                {errors.libelle && (
                  <span className="text-sm text-red-600">{errors.libelle.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="objet_depense">Objet de la dépense *</Label>
                <Input
                  id="objet_depense"
                  {...register('objet_depense', { required: 'Ce champ est requis' })}
                  placeholder="Objet détaillé de la dépense"
                />
                {errors.objet_depense && (
                  <span className="text-sm text-red-600">{errors.objet_depense.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification">Justification *</Label>
                <Input
                  id="justification"
                  {...register('justification', { required: 'Ce champ est requis' })}
                  placeholder="Justification de la dépense"
                />
                {errors.justification && (
                  <span className="text-sm text-red-600">{errors.justification.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero_facture">Numéro de facture</Label>
                  <Input
                    id="numero_facture"
                    {...register('numero_facture')}
                    placeholder="N° facture"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_facture">Date de facture</Label>
                  <Input
                    id="date_facture"
                    type="date"
                    {...register('date_facture')}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Informations bénéficiaire */}
          <Card className="p-4">
            <CardTitle className="text-lg mb-4">Informations bénéficiaire</CardTitle>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Type de bénéficiaire</Label>
                <RadioGroup 
                  value={beneficiaireType} 
                  onValueChange={(value: 'personne_physique' | 'personne_morale') => {
                    setBeneficiaireType(value);
                    setValue('beneficiaire_type', value);
                  }}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personne_physique" id="physique" />
                    <Label htmlFor="physique">Personne physique</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personne_morale" id="morale" />
                    <Label htmlFor="morale">Personne morale (entreprise/organisation)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beneficiaire_nom">
                    {beneficiaireType === 'personne_physique' ? 'Nom et prénoms' : 'Raison sociale'} *
                  </Label>
                  <Input
                    id="beneficiaire_nom"
                    {...register('beneficiaire_nom', { required: 'Ce champ est requis' })}
                    placeholder={beneficiaireType === 'personne_physique' ? 'Nom et prénoms' : 'Raison sociale'}
                  />
                  {errors.beneficiaire_nom && (
                    <span className="text-sm text-red-600">{errors.beneficiaire_nom.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaire_adresse">Adresse</Label>
                  <Input
                    id="beneficiaire_adresse"
                    {...register('beneficiaire_adresse')}
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaire_tel">Téléphone</Label>
                  <Input
                    id="beneficiaire_tel"
                    {...register('beneficiaire_tel')}
                    placeholder="Numéro de téléphone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaire_email">Email</Label>
                  <Input
                    id="beneficiaire_email"
                    type="email"
                    {...register('beneficiaire_email')}
                    placeholder="Adresse email"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Calcul des imputations */}
          {montant && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Calcul des imputations budgétaires</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Procédure {procedureType} - {procedureType === 'amenagee' ? 'Retenues réduites' : 'Retenues standards'}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Montant brut:</div>
                  <div className="font-semibold">{Number(montant).toLocaleString()} GNF</div>
                  
                  <div>Précompte ({procedureType === 'amenagee' ? '5%' : '10%'}):</div>
                  <div className="text-red-600">-{imputations.precompte.toLocaleString()} GNF</div>
                  
                  <div>TVA ({procedureType === 'amenagee' ? '18%' : '50%'}):</div>
                  <div className="text-red-600">-{imputations.tva.toLocaleString()} GNF</div>
                  
                  <div>ARMP ({procedureType === 'amenagee' ? '0.03%' : '0.06%'}):</div>
                  <div className="text-red-600">-{imputations.armp.toLocaleString()} GNF</div>
                  
                  <div className="border-t pt-2 font-semibold">Montant net à payer:</div>
                  <div className="border-t pt-2 font-semibold text-green-600">
                    {montantNet.toLocaleString()} GNF
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'engagement
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
