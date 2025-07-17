
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Heart, Building2, Plus, Save } from 'lucide-react';

interface EPARevenueFormData {
  epa_type: 'universite' | 'hopital' | 'autre';
  type_recette: string;
  sous_type_recette: string;
  montant: number;
  quantite?: number;
  prix_unitaire?: number;
  date_perception: string;
  periode_academique?: string;
  description: string;
  beneficiaire?: string;
  titre: string;
  chapitre: string;
  article: string;
  paragraphe: string;
}

const revenueTypes = {
  universite: [
    {
      code: 'FRAIS_INSCRIPTION',
      label: 'Frais d\'inscription',
      sous_types: [
        { code: 'PREMIERE_INSCRIPTION', label: 'Première inscription', prix_unitaire: 150000 },
        { code: 'REINSCRIPTION', label: 'Réinscription', prix_unitaire: 100000 },
        { code: 'INSCRIPTION_TARDIVE', label: 'Inscription tardive', prix_unitaire: 200000 },
        { code: 'FRAIS_DOSSIER', label: 'Frais de dossier', prix_unitaire: 50000 }
      ]
    },
    {
      code: 'FRAIS_PEDAGOGIQUES',
      label: 'Frais pédagogiques',
      sous_types: [
        { code: 'FRAIS_TD', label: 'Travaux dirigés', prix_unitaire: 75000 },
        { code: 'FRAIS_TP', label: 'Travaux pratiques', prix_unitaire: 100000 },
        { code: 'FRAIS_STAGE', label: 'Frais de stage', prix_unitaire: 200000 }
      ]
    }
  ],
  hopital: [
    {
      code: 'CONSULTATIONS',
      label: 'Consultations médicales',
      sous_types: [
        { code: 'CONSULTATION_GENERALE', label: 'Consultation générale', prix_unitaire: 50000 },
        { code: 'CONSULTATION_SPECIALISTE', label: 'Consultation spécialiste', prix_unitaire: 100000 },
        { code: 'URGENCES', label: 'Service d\'urgences', prix_unitaire: 75000 }
      ]
    },
    {
      code: 'VENTE_PRODUITS',
      label: 'Vente de produits',
      sous_types: [
        { code: 'MEDICAMENTS', label: 'Médicaments', prix_unitaire: 0 },
        { code: 'MATERIEL_MEDICAL', label: 'Matériel médical', prix_unitaire: 0 },
        { code: 'ANALYSES', label: 'Analyses de laboratoire', prix_unitaire: 25000 }
      ]
    }
  ],
  autre: [
    {
      code: 'PRESTATIONS_SERVICE',
      label: 'Prestations de service',
      sous_types: [
        { code: 'FORMATION', label: 'Formations', prix_unitaire: 0 },
        { code: 'CONSULTATION', label: 'Consultations', prix_unitaire: 0 },
        { code: 'ASSISTANCE_TECHNIQUE', label: 'Assistance technique', prix_unitaire: 0 }
      ]
    },
    {
      code: 'VENTE_PRODUITS',
      label: 'Vente de produits',
      sous_types: [
        { code: 'PRODUITS_FABRIQUES', label: 'Produits fabriqués', prix_unitaire: 0 },
        { code: 'PRODUITS_AGRICOLES', label: 'Produits agricoles', prix_unitaire: 0 }
      ]
    }
  ]
};

export const EPARevenueEntry = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<EPARevenueFormData>();
  const { toast } = useToast();
  const [selectedEPAType, setSelectedEPAType] = useState<string>('');
  const [selectedTypeRecette, setSelectedTypeRecette] = useState<string>('');

  const epaType = watch('epa_type');
  const typeRecette = watch('type_recette');
  const sousTypeRecette = watch('sous_type_recette');
  const quantite = watch('quantite');
  const prixUnitaire = watch('prix_unitaire');

  const selectedRevenueTypes = epaType ? revenueTypes[epaType as keyof typeof revenueTypes] : [];
  const selectedSousTypes = selectedRevenueTypes.find(rt => rt.code === typeRecette)?.sous_types || [];

  const handleSousTypeChange = (value: string) => {
    setValue('sous_type_recette', value);
    const sousType = selectedSousTypes.find(st => st.code === value);
    if (sousType && sousType.prix_unitaire > 0) {
      setValue('prix_unitaire', sousType.prix_unitaire);
    }
  };

  const calculateMontant = () => {
    if (quantite && prixUnitaire) {
      const montant = quantite * prixUnitaire;
      setValue('montant', montant);
      return montant;
    }
    return 0;
  };

  const onSubmit = (data: EPARevenueFormData) => {
    console.log('Nouvelle recette EPA:', data);
    toast({
      title: "Recette EPA enregistrée",
      description: `Recette de ${data.montant.toLocaleString()} GNF enregistrée avec succès.`,
    });
    reset();
    setSelectedEPAType('');
    setSelectedTypeRecette('');
  };

  const getEPAIcon = (type: string) => {
    switch(type) {
      case 'universite': return <GraduationCap className="h-5 w-5" />;
      case 'hopital': return <Heart className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Saisie des Recettes Propres des EPAs</h1>
        <p className="text-green-100">
          Enregistrement des recettes générées par les activités des établissements publics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection du type d'EPA */}
        <Card>
          <CardHeader>
            <CardTitle>Type d'établissement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries({
                universite: 'Université',
                hopital: 'Hôpital',
                autre: 'Autre EPA'
              }).map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedEPAType(key);
                    setValue('epa_type', key as any);
                  }}
                  className={`
                    p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${selectedEPAType === key 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {getEPAIcon(key)}
                    <span className="font-medium">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de saisie */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Nouvelle recette
                {selectedEPAType && (
                  <Badge className="ml-2" variant="secondary">
                    {selectedEPAType === 'universite' ? 'Université' : 
                     selectedEPAType === 'hopital' ? 'Hôpital' : 'Autre EPA'}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEPAType ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Type de recette */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type_recette">Type de recette *</Label>
                      <Select onValueChange={(value) => {
                        setValue('type_recette', value);
                        setSelectedTypeRecette(value);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRevenueTypes.map((type) => (
                            <SelectItem key={type.code} value={type.code}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedTypeRecette && (
                      <div className="space-y-2">
                        <Label htmlFor="sous_type_recette">Sous-type *</Label>
                        <Select onValueChange={handleSousTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le sous-type" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedSousTypes.map((sousType) => (
                              <SelectItem key={sousType.code} value={sousType.code}>
                                {sousType.label}
                                {sousType.prix_unitaire > 0 && (
                                  <span className="text-sm text-gray-500 ml-2">
                                    ({sousType.prix_unitaire.toLocaleString()} GNF)
                                  </span>
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Calcul automatique */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantite">Quantité</Label>
                      <Input
                        id="quantite"
                        type="number"
                        {...register('quantite', { 
                          onChange: () => setTimeout(calculateMontant, 100)
                        })}
                        placeholder="Nombre d'unités"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prix_unitaire">Prix unitaire (GNF)</Label>
                      <Input
                        id="prix_unitaire"
                        type="number"
                        {...register('prix_unitaire', { 
                          onChange: () => setTimeout(calculateMontant, 100)
                        })}
                        placeholder="Prix par unité"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="montant">Montant total (GNF) *</Label>
                      <Input
                        id="montant"
                        type="number"
                        {...register('montant', { required: 'Ce champ est requis' })}
                        placeholder="Montant calculé"
                        className="bg-gray-50"
                      />
                      {errors.montant && <span className="text-sm text-red-600">{errors.montant.message}</span>}
                    </div>
                  </div>

                  {/* Période et date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_perception">Date de perception *</Label>
                      <Input
                        id="date_perception"
                        type="date"
                        {...register('date_perception', { required: 'Ce champ est requis' })}
                      />
                      {errors.date_perception && <span className="text-sm text-red-600">{errors.date_perception.message}</span>}
                    </div>

                    {epaType === 'universite' && (
                      <div className="space-y-2">
                        <Label htmlFor="periode_academique">Période académique</Label>
                        <Select onValueChange={(value) => setValue('periode_academique', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la période" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024-2025-1">2024-2025 Semestre 1</SelectItem>
                            <SelectItem value="2024-2025-2">2024-2025 Semestre 2</SelectItem>
                            <SelectItem value="2023-2024-1">2023-2024 Semestre 1</SelectItem>
                            <SelectItem value="2023-2024-2">2023-2024 Semestre 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Imputations budgétaires */}
                  <Card className="p-4">
                    <CardTitle className="text-lg mb-4">Imputations budgétaires</CardTitle>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    </div>
                  </Card>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description détaillée</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Description de la recette..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer la recette
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez le type d'établissement pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
