
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X, FileText, History } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Engagement {
  id: string;
  numero: string;
  objet: string;
  montant: number;
  beneficiaire: string;
  statut: 'brouillon' | 'pret_transmission' | 'transmis' | 'valide' | 'rejete';
  dateCreation: string;
  type_engagement: string;
  section: string;
  titre: string;
  chapitre: string;
  article: string;
  paragraphe: string;
  pieces_jointes: string;
  commentaires?: string;
}

interface EngagementFormData {
  objet: string;
  montant: number;
  beneficiaire: string;
  type_engagement: string;
  section: string;
  titre: string;
  chapitre: string;
  article: string;
  paragraphe: string;
  pieces_jointes: string;
  commentaires: string;
}

const mockEngagements: Engagement[] = [
  {
    id: '1',
    numero: '2024-001-ENG',
    objet: 'Fournitures de bureau pour le trimestre',
    montant: 500000,
    beneficiaire: 'Société ABC',
    statut: 'brouillon',
    dateCreation: '2024-01-15',
    type_engagement: 'normal',
    section: '18',
    titre: 'Titre 2',
    chapitre: 'Chapitre 1',
    article: 'Article 10',
    paragraphe: 'Paragraphe 01',
    pieces_jointes: 'Facture proforma, devis'
  },
  {
    id: '2',
    numero: '2024-002-ENG',
    objet: 'Maintenance informatique annuelle',
    montant: 750000,
    beneficiaire: 'Tech Solutions',
    statut: 'pret_transmission',
    dateCreation: '2024-01-16',
    type_engagement: 'normal',
    section: '18',
    titre: 'Titre 2',
    chapitre: 'Chapitre 2',
    article: 'Article 20',
    paragraphe: 'Paragraphe 02',
    pieces_jointes: 'Contrat de maintenance, bon de commande'
  }
];

export const EditEngagementForm = () => {
  const { toast } = useToast();
  const [engagements, setEngagements] = useState(mockEngagements);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<EngagementFormData>();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (statut: string) => {
    const colors = {
      'brouillon': 'bg-gray-100 text-gray-800',
      'pret_transmission': 'bg-blue-100 text-blue-800',
      'transmis': 'bg-yellow-100 text-yellow-800',
      'valide': 'bg-green-100 text-green-800',
      'rejete': 'bg-red-100 text-red-800'
    };
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statut: string) => {
    const labels = {
      'brouillon': 'Brouillon',
      'pret_transmission': 'Prêt pour transmission',
      'transmis': 'Transmis',
      'valide': 'Validé',
      'rejete': 'Rejeté'
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const canEdit = (engagement: Engagement) => {
    return ['brouillon', 'rejete'].includes(engagement.statut);
  };

  const handleEdit = (engagement: Engagement) => {
    setEditingId(engagement.id);
    setValue('objet', engagement.objet);
    setValue('montant', engagement.montant);
    setValue('beneficiaire', engagement.beneficiaire);
    setValue('type_engagement', engagement.type_engagement);
    setValue('section', engagement.section);
    setValue('titre', engagement.titre);
    setValue('chapitre', engagement.chapitre);
    setValue('article', engagement.article);
    setValue('paragraphe', engagement.paragraphe);
    setValue('pieces_jointes', engagement.pieces_jointes);
    setValue('commentaires', engagement.commentaires || '');
  };

  const onSubmit = (data: EngagementFormData) => {
    if (!editingId) return;

    setEngagements(prev => 
      prev.map(eng => 
        eng.id === editingId ? { ...eng, ...data } : eng
      )
    );

    setEditingId(null);
    reset();
    
    toast({
      title: "Engagement modifié",
      description: "L'engagement a été modifié avec succès.",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  const handlePrepareTransmission = (engagementId: string) => {
    setEngagements(prev => 
      prev.map(eng => 
        eng.id === engagementId 
          ? { ...eng, statut: 'pret_transmission' as const }
          : eng
      )
    );

    toast({
      title: "Engagement préparé",
      description: "L'engagement est maintenant prêt pour transmission.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Édition des Fiches d'Engagement</h1>
        <p className="text-muted-foreground">
          Modification et gestion des engagements
        </p>
      </div>

      {editingId ? (
        <Card>
          <CardHeader>
            <CardTitle>Modification de l'engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="objet">Objet *</Label>
                  <Textarea
                    id="objet"
                    {...register('objet', { required: 'Ce champ est requis' })}
                    rows={3}
                  />
                  {errors.objet && <span className="text-sm text-red-600">{errors.objet.message}</span>}
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
                  />
                  {errors.montant && <span className="text-sm text-red-600">{errors.montant.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaire">Bénéficiaire *</Label>
                  <Input
                    id="beneficiaire"
                    {...register('beneficiaire', { required: 'Ce champ est requis' })}
                  />
                  {errors.beneficiaire && <span className="text-sm text-red-600">{errors.beneficiaire.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type_engagement">Type d'engagement</Label>
                  <Select onValueChange={(value) => setValue('type_engagement', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'engagement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="exceptionnel">Exceptionnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Imputations budgétaires */}
              <Card className="p-4">
                <CardTitle className="text-lg mb-4">Imputations budgétaires</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      {...register('section')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titre">Titre</Label>
                    <Input
                      id="titre"
                      {...register('titre')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chapitre">Chapitre</Label>
                    <Input
                      id="chapitre"
                      {...register('chapitre')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="article">Article</Label>
                    <Input
                      id="article"
                      {...register('article')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paragraphe">Paragraphe</Label>
                    <Input
                      id="paragraphe"
                      {...register('paragraphe')}
                    />
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="pieces_jointes">Pièces jointes</Label>
                <Input
                  id="pieces_jointes"
                  {...register('pieces_jointes')}
                  placeholder="Liste des pièces jointes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commentaires">Commentaires</Label>
                <Textarea
                  id="commentaires"
                  {...register('commentaires')}
                  placeholder="Commentaires additionnels..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des engagements modifiables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagements.map((engagement) => (
                <div key={engagement.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{engagement.numero}</h3>
                        <Badge className={getStatusColor(engagement.statut)}>
                          {getStatusLabel(engagement.statut)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{engagement.objet}</p>
                      <p className="text-sm">
                        <span className="font-medium">Montant:</span> {formatCurrency(engagement.montant)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Bénéficiaire:</span> {engagement.beneficiaire}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Créé le {engagement.dateCreation}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowHistory(engagement.id)}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Historique
                      </Button>
                      {canEdit(engagement) && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(engagement)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          {engagement.statut === 'brouillon' && (
                            <Button 
                              size="sm"
                              onClick={() => handlePrepareTransmission(engagement.id)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Préparer transmission
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
