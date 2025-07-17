
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { nomenclatureRecettes } from '@/data/nomenclatureRecettes';

interface RevenueFormData {
  type: 'impots_taxes' | 'recettes_domaniales' | 'recettes_fonctionnement' | 'recettes_exceptionnelles';
  sous_type: string;
  source: string;
  montant: number;
  date: string;
  titre: string;
  chapitre: string;
  article: string;
  paragraphe: string;
  sous_paragraphe?: string;
  description: string;
}

export const RevenueEntry = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<RevenueFormData>();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('');

  const selectedNomenclature = nomenclatureRecettes.find(n => n.type === selectedType);

  const onSubmit = (data: RevenueFormData) => {
    console.log('Nouvelle recette:', data);
    toast({
      title: "Recette enregistrée",
      description: `Recette de ${data.montant.toLocaleString()} GNF enregistrée avec succès.`,
    });
    reset();
    setSelectedType('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Saisie des Recettes</h1>
        <p className="text-muted-foreground">Enregistrement des recettes selon la nomenclature guinéenne</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle recette</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Catégorie de recette *</Label>
                <Select onValueChange={(value) => {
                  setValue('type', value as any);
                  setSelectedType(value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {nomenclatureRecettes.map((item) => (
                      <SelectItem key={item.type} value={item.type}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedNomenclature && (
                <div className="space-y-2">
                  <Label htmlFor="sous_type">Sous-catégorie *</Label>
                  <Select onValueChange={(value) => setValue('sous_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la sous-catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedNomenclature.sous_types.map((sousType) => (
                        <SelectItem key={sousType.code} value={sousType.code}>
                          {sousType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="source">Source/Origine *</Label>
                <Input
                  id="source"
                  {...register('source', { required: 'Ce champ est requis' })}
                  placeholder="Ministère, entreprise, particulier, etc."
                />
                {errors.source && <span className="text-sm text-red-600">{errors.source.message}</span>}
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
                {errors.montant && <span className="text-sm text-red-600">{errors.montant.message}</span>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="date">Date de réception *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date', { required: 'Ce champ est requis' })}
                />
                {errors.date && <span className="text-sm text-red-600">{errors.date.message}</span>}
              </div>
            </div>

            {/* Imputations budgétaires */}
            <Card className="p-4">
              <CardTitle className="text-lg mb-4">Imputations budgétaires</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre *</Label>
                  <Input
                    id="titre"
                    {...register('titre', { required: 'Ce champ est requis' })}
                    placeholder="Ex: 01"
                  />
                  {errors.titre && <span className="text-sm text-red-600">{errors.titre.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chapitre">Chapitre *</Label>
                  <Input
                    id="chapitre"
                    {...register('chapitre', { required: 'Ce champ est requis' })}
                    placeholder="Ex: 001"
                  />
                  {errors.chapitre && <span className="text-sm text-red-600">{errors.chapitre.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article">Article *</Label>
                  <Input
                    id="article"
                    {...register('article', { required: 'Ce champ est requis' })}
                    placeholder="Ex: 10"
                  />
                  {errors.article && <span className="text-sm text-red-600">{errors.article.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paragraphe">Paragraphe *</Label>
                  <Input
                    id="paragraphe"
                    {...register('paragraphe', { required: 'Ce champ est requis' })}
                    placeholder="Ex: 01"
                  />
                  {errors.paragraphe && <span className="text-sm text-red-600">{errors.paragraphe.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sous_paragraphe">Sous-paragraphe</Label>
                  <Input
                    id="sous_paragraphe"
                    {...register('sous_paragraphe')}
                    placeholder="Ex: 001"
                  />
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée</Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Description détaillée de la recette..."
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Enregistrer la recette
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
