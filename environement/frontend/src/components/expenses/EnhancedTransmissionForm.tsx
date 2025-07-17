
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, FileText, Clock, CheckCircle, Eye, Download, Upload, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Engagement {
  id: string;
  numero: string;
  objet: string;
  montant: number;
  beneficiaire: string;
  statut: 'brouillon' | 'pret_transmission' | 'transmis' | 'valide' | 'rejete';
  dateCreation: string;
  priorite: 'normale' | 'urgente' | 'exceptionnelle';
}

interface TransmissionFormData {
  destinataire: string;
  commentaire: string;
  pieces_jointes: string;
  date_limite: string;
  mode_transmission: string;
}

const mockEngagements: Engagement[] = [
  {
    id: '1',
    numero: '2024-001-ENG',
    objet: 'Fournitures de bureau pour le trimestre',
    montant: 500000,
    beneficiaire: 'Société ABC',
    statut: 'pret_transmission',
    dateCreation: '2024-01-15',
    priorite: 'normale'
  },
  {
    id: '2',
    numero: '2024-002-ENG',
    objet: 'Maintenance informatique urgente',
    montant: 750000,
    beneficiaire: 'Tech Solutions',
    statut: 'pret_transmission',
    dateCreation: '2024-01-16',
    priorite: 'urgente'
  }
];

export const EnhancedTransmissionForm = () => {
  const { toast } = useToast();
  const [engagements, setEngagements] = useState(mockEngagements);
  const [selectedEngagements, setSelectedEngagements] = useState<string[]>([]);
  const [showTransmissionForm, setShowTransmissionForm] = useState(false);
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
      'valide': 'bg-green-100 text-green-800',
      'rejete': 'bg-red-100 text-red-800'
    };
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priorite: string) => {
    const colors = {
      'normale': 'bg-green-100 text-green-800',
      'urgente': 'bg-orange-100 text-orange-800',
      'exceptionnelle': 'bg-red-100 text-red-800'
    };
    return colors[priorite as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const toggleEngagementSelection = (id: string) => {
    setSelectedEngagements(prev => 
      prev.includes(id) 
        ? prev.filter(engId => engId !== id)
        : [...prev, id]
    );
  };

  const onSubmit = (data: TransmissionFormData) => {
    setEngagements(prev => 
      prev.map(eng => 
        selectedEngagements.includes(eng.id)
          ? { ...eng, statut: 'transmis' as const }
          : eng
      )
    );

    toast({
      title: "Engagements transmis",
      description: `${selectedEngagements.length} engagement(s) transmis à ${data.destinataire} avec succès.`,
    });

    setSelectedEngagements([]);
    setShowTransmissionForm(false);
    reset();
  };

  const totalMontant = engagements
    .filter(eng => selectedEngagements.includes(eng.id))
    .reduce((sum, eng) => sum + eng.montant, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Transmission des Engagements</h1>
        <p className="text-blue-100">
          Système de transmission sécurisé vers les autorités compétentes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des engagements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Engagements prêts pour transmission</CardTitle>
                <Badge variant="secondary">
                  {engagements.filter(e => e.statut === 'pret_transmission').length} disponibles
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagements
                  .filter(eng => eng.statut === 'pret_transmission')
                  .map((engagement) => (
                  <div 
                    key={engagement.id} 
                    className={`
                      border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                      ${selectedEngagements.includes(engagement.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => toggleEngagementSelection(engagement.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{engagement.numero}</h3>
                          <Badge className={getPriorityColor(engagement.priorite)}>
                            {engagement.priorite}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 max-w-md">{engagement.objet}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium text-green-600">
                            {formatCurrency(engagement.montant)}
                          </span>
                          <span className="text-gray-500">• {engagement.beneficiaire}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {selectedEngagements.includes(engagement.id) && (
                      <div className="mt-3 p-3 bg-blue-100 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-blue-800 font-medium">
                          ✓ Sélectionné pour transmission
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedEngagements.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {selectedEngagements.length} engagement(s) sélectionné(s)
                      </p>
                      <p className="text-sm text-gray-600">
                        Montant total: {formatCurrency(totalMontant)}
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowTransmissionForm(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Transmettre
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panneau de transmission */}
        <div className="lg:col-span-1">
          {showTransmissionForm ? (
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Transmission
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="destinataire">Destinataire *</Label>
                    <Select onValueChange={(value) => register('destinataire').onChange({ target: { value } })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le destinataire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="controleur_financier">Contrôleur Financier</SelectItem>
                        <SelectItem value="daf">Directeur Administratif et Financier</SelectItem>
                        <SelectItem value="directeur_general">Directeur Général</SelectItem>
                        <SelectItem value="ministere_tutelle">Ministère de tutelle</SelectItem>
                        <SelectItem value="cour_comptes">Cour des Comptes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mode_transmission">Mode de transmission</Label>
                    <Select onValueChange={(value) => register('mode_transmission').onChange({ target: { value } })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronique">Électronique (Email)</SelectItem>
                        <SelectItem value="physique">Physique (Courrier)</SelectItem>
                        <SelectItem value="mixte">Mixte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_limite">Date limite de traitement</Label>
                    <Input
                      id="date_limite"
                      type="date"
                      {...register('date_limite')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pieces_jointes">Pièces jointes</Label>
                    <Input
                      id="pieces_jointes"
                      {...register('pieces_jointes')}
                      placeholder="Liste des pièces..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commentaire">Message d'accompagnement</Label>
                    <Textarea
                      id="commentaire"
                      {...register('commentaire')}
                      placeholder="Message pour le destinataire..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowTransmissionForm(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Envoyer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tableau de bord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div>
                      <p className="font-medium text-blue-800">Prêts</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {engagements.filter(e => e.statut === 'pret_transmission').length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <div>
                      <p className="font-medium text-yellow-800">En cours</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {engagements.filter(e => e.statut === 'transmis').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div>
                      <p className="font-medium text-green-800">Validés</p>
                      <p className="text-2xl font-bold text-green-600">
                        {engagements.filter(e => e.statut === 'valide').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
