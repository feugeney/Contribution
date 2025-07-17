
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FileText, Save, Send, Calculator, Building, User } from 'lucide-react';

interface ModernEngagementFormData {
  type_engagement: string;
  section: string;
  sous_section: string;
  titre: string;
  chapitre: string;
  article: string;
  paragraphe: string;
  sous_paragraphe: string;
  credit_disponible: number;
  objet: string;
  type_beneficiaire: string;
  raison_sociale: string;
  banque: string;
  agence: string;
  numero_compte: string;
  pieces: string;
  precomptes: string;
  montant: number;
}

interface ModernEngagementFormProps {
  onSubmit: (data: ModernEngagementFormData) => void;
  onCancel: () => void;
}

export const ModernEngagementForm = ({ onSubmit, onCancel }: ModernEngagementFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ModernEngagementFormData>();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const onFormSubmit = (data: ModernEngagementFormData) => {
    onSubmit(data);
    toast({
      title: "Engagement créé",
      description: "L'engagement a été créé avec succès et est prêt pour transmission.",
    });
  };

  const steps = [
    { id: 1, title: "Informations générales", icon: FileText },
    { id: 2, title: "Imputation budgétaire", icon: Calculator },
    { id: 3, title: "Bénéficiaire", icon: User },
    { id: 4, title: "Finalisation", icon: Send }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouvelle Fiche d'Engagement</h1>
          <p className="text-gray-600">Création simplifiée et moderne d'un engagement</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                  ${currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-4 transition-all
                    ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  {steps.find(s => s.id === currentStep)?.title}
                </CardTitle>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Étape {currentStep} sur {steps.length}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Step 1: General Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type_engagement" className="text-sm font-semibold text-gray-700">
                        Type d'engagement *
                      </Label>
                      <Select onValueChange={(value) => setValue('type_engagement', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Engagement normal</SelectItem>
                          <SelectItem value="urgent">Engagement urgent</SelectItem>
                          <SelectItem value="exceptionnel">Engagement exceptionnel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="montant" className="text-sm font-semibold text-gray-700">
                        Montant (GNF) *
                      </Label>
                      <Input
                        id="montant"
                        type="number"
                        className="h-12"
                        {...register('montant', { required: 'Ce champ est requis' })}
                        placeholder="0"
                      />
                      {errors.montant && <span className="text-sm text-red-600">{errors.montant.message}</span>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objet" className="text-sm font-semibold text-gray-700">
                      Objet de l'engagement *
                    </Label>
                    <Textarea
                      id="objet"
                      className="min-h-[100px]"
                      {...register('objet', { required: 'Ce champ est requis' })}
                      placeholder="Décrivez l'objet de cet engagement..."
                    />
                    {errors.objet && <span className="text-sm text-red-600">{errors.objet.message}</span>}
                  </div>
                </div>
              )}

              {/* Step 2: Budget Imputation */}
              {currentStep === 2 && (
                <div className="space-y-6">
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
                    <Label className="text-sm font-semibold text-gray-700">Crédit disponible *</Label>
                    <Input
                      type="number"
                      className="h-12"
                      {...register('credit_disponible', { required: 'Ce champ est requis' })}
                      placeholder="Montant disponible"
                    />
                    {errors.credit_disponible && <span className="text-sm text-red-600">{errors.credit_disponible.message}</span>}
                  </div>
                </div>
              )}

              {/* Step 3: Beneficiary */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Type de bénéficiaire *</Label>
                      <Select onValueChange={(value) => setValue('type_beneficiaire', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="physique">Personne physique</SelectItem>
                          <SelectItem value="morale">Personne morale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Raison sociale *</Label>
                      <Input
                        className="h-12"
                        {...register('raison_sociale', { required: 'Ce champ est requis' })}
                        placeholder="Nom/Raison sociale"
                      />
                      {errors.raison_sociale && <span className="text-sm text-red-600">{errors.raison_sociale.message}</span>}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      Informations bancaires
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input {...register('numero_compte')} placeholder="Numéro de compte" className="h-12" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Finalization */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Pièces jointes</Label>
                      <Textarea
                        {...register('pieces')}
                        placeholder="Liste des pièces jointes..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Précomptes</Label>
                      <Textarea
                        {...register('precomptes')}
                        placeholder="Détails des précomptes..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3">Résumé de l'engagement</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Type:</span> {watch('type_engagement')}</div>
                      <div><span className="font-medium">Montant:</span> {watch('montant')?.toLocaleString()} GNF</div>
                      <div className="col-span-2"><span className="font-medium">Bénéficiaire:</span> {watch('raison_sociale')}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6"
                    >
                      Précédent
                    </Button>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button type="button" variant="ghost" onClick={onCancel}>
                    Annuler
                  </Button>
                  
                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="px-6"
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button type="submit" className="px-6">
                      <Save className="w-4 h-4 mr-2" />
                      Créer l'engagement
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};
