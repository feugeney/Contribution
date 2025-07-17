
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, FileText, Clock, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Engagement {
  id: string;
  numero: string;
  objet: string;
  montant: number;
  beneficiaire: string;
  statut: 'brouillon' | 'pret_transmission' | 'transmis' | 'valide';
  dateCreation: string;
}

interface TransmissionFormData {
  destinataire: string;
  commentaire: string;
  pieces_jointes: string;
}

const mockEngagements: Engagement[] = [
  {
    id: '1',
    numero: '2024-001-ENG',
    objet: 'Fournitures de bureau pour le trimestre',
    montant: 500000,
    beneficiaire: 'Société ABC',
    statut: 'pret_transmission',
    dateCreation: '2024-01-15'
  },
  {
    id: '2',
    numero: '2024-002-ENG',
    objet: 'Maintenance informatique annuelle',
    montant: 750000,
    beneficiaire: 'Tech Solutions',
    statut: 'brouillon',
    dateCreation: '2024-01-16'
  }
];

export const TransmissionEngagementForm = () => {
  const { toast } = useToast();
  const [engagements, setEngagements] = useState(mockEngagements);
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TransmissionFormData>();

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
      'valide': 'bg-green-100 text-green-800'
    };
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statut: string) => {
    const labels = {
      'brouillon': 'Brouillon',
      'pret_transmission': 'Prêt pour transmission',
      'transmis': 'Transmis',
      'valide': 'Validé'
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const canTransmit = (engagement: Engagement) => {
    return engagement.statut === 'pret_transmission';
  };

  const onSubmit = (data: TransmissionFormData) => {
    if (!selectedEngagement) return;

    setEngagements(prev => 
      prev.map(eng => 
        eng.id === selectedEngagement 
          ? { ...eng, statut: 'transmis' as const }
          : eng
      )
    );

    toast({
      title: "Engagement transmis",
      description: `L'engagement a été transmis à ${data.destinataire} avec succès.`,
    });

    setSelectedEngagement(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transmission des Engagements</h1>
        <p className="text-muted-foreground">
          Transmission des engagements vers les autorités compétentes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des engagements */}
        <Card>
          <CardHeader>
            <CardTitle>Engagements disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagements.map((engagement) => (
                <div key={engagement.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
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
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedEngagement(engagement.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      {canTransmit(engagement) && (
                        <Button 
                          size="sm"
                          onClick={() => setSelectedEngagement(engagement.id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Transmettre
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de transmission */}
        {selectedEngagement && (
          <Card>
            <CardHeader>
              <CardTitle>Transmission d'engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destinataire">Destinataire *</Label>
                  <Select onValueChange={(value) => register('destinataire').onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="controleur_financier">Contrôleur Financier</SelectItem>
                      <SelectItem value="daf">Directeur Administratif et Financier</SelectItem>
                      <SelectItem value="directeur_general">Directeur Général</SelectItem>
                      <SelectItem value="ministere_tutelle">Ministère de tutelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pieces_jointes">Pièces jointes</Label>
                  <Input
                    id="pieces_jointes"
                    {...register('pieces_jointes')}
                    placeholder="Liste des pièces jointes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commentaire">Commentaire</Label>
                  <Textarea
                    id="commentaire"
                    {...register('commentaire')}
                    placeholder="Commentaire pour la transmission..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedEngagement(null)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Transmettre
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
