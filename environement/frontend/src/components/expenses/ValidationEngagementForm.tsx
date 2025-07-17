
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

interface Engagement {
  id: string;
  numero: string;
  objet: string;
  montant: number;
  beneficiaire: string;
  status: 'en_attente_validation' | 'valide' | 'rejete';
  dateCreation: string;
  dateSoumission: string;
}

const mockEngagements: Engagement[] = [
  {
    id: '1',
    numero: '2024-001-ENG',
    objet: 'Fournitures de bureau pour le trimestre',
    montant: 500000,
    beneficiaire: 'Société ABC',
    status: 'en_attente_validation',
    dateCreation: '2024-01-15',
    dateSoumission: '2024-01-16'
  },
  {
    id: '2',
    numero: '2024-002-ENG',
    objet: 'Maintenance informatique annuelle',
    montant: 750000,
    beneficiaire: 'Tech Solutions',
    status: 'en_attente_validation',
    dateCreation: '2024-01-16',
    dateSoumission: '2024-01-17'
  }
];

export const ValidationEngagementForm = () => {
  const { toast } = useToast();
  const [engagements, setEngagements] = useState(mockEngagements);
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);
  const [commentaire, setCommentaire] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'en_attente_validation': 'bg-yellow-100 text-yellow-800',
      'valide': 'bg-green-100 text-green-800',
      'rejete': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'en_attente_validation': 'En attente de validation',
      'valide': 'Validé',
      'rejete': 'Rejeté'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleValidation = (engagementId: string, action: 'valider' | 'rejeter') => {
    setEngagements(prev => 
      prev.map(eng => 
        eng.id === engagementId 
          ? { ...eng, status: action === 'valider' ? 'valide' : 'rejete' }
          : eng
      )
    );

    toast({
      title: action === 'valider' ? "Engagement validé" : "Engagement rejeté",
      description: `L'engagement a été ${action === 'valider' ? 'validé' : 'rejeté'} avec succès.`,
    });

    setSelectedEngagement(null);
    setCommentaire('');
  };

  const handleShowDetails = (engagementId: string) => {
    setSelectedEngagement(selectedEngagement === engagementId ? null : engagementId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Validation des Engagements</h1>
        <p className="text-muted-foreground">
          Validation ou rejet des engagements soumis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagements en attente de validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagements.map((engagement) => (
              <div key={engagement.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{engagement.numero}</h3>
                      <Badge className={getStatusColor(engagement.status)}>
                        {getStatusLabel(engagement.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{engagement.objet}</p>
                    <p className="text-sm">
                      <span className="font-medium">Montant:</span> {formatCurrency(engagement.montant)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Bénéficiaire:</span> {engagement.beneficiaire}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Créé le {engagement.dateCreation}</p>
                      <p>Soumis le {engagement.dateSoumission}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleShowDetails(engagement.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                    {engagement.status === 'en_attente_validation' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleValidation(engagement.id, 'valider')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Valider
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleValidation(engagement.id, 'rejeter')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejeter
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {selectedEngagement === engagement.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Détails de l'engagement</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Section:</span> 18
                      </div>
                      <div>
                        <span className="font-medium">Sous-section:</span> 190591000000
                      </div>
                      <div>
                        <span className="font-medium">Titre:</span> Titre 2 - Charges de fonctionnement
                      </div>
                      <div>
                        <span className="font-medium">Chapitre:</span> Chapitre 1
                      </div>
                    </div>
                    
                    {engagement.status === 'en_attente_validation' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">
                          Commentaire (optionnel)
                        </label>
                        <Textarea
                          value={commentaire}
                          onChange={(e) => setCommentaire(e.target.value)}
                          placeholder="Ajouter un commentaire..."
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
