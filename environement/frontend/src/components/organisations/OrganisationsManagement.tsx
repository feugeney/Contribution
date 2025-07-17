import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Building2, FileText, Phone, MapPin, Edit, Globe, DollarSign, Calendar, User, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInstitutions, type Institution, type Tutelle } from '@/hooks/useInstitutions';

// Interface adaptée pour correspondre à l'API Django
interface InstitutionFormData {
  nom: string;
  sigle: string;
  siege: string;
  date_adhesion: string;
  document_adhesion: string;
  rib: string;
  tutelle_id: string;
  devise_principale: string;
  devise_secondaire: string;
}

export default function OrganisationsManagement() {
  const { institutions, tutelles, loading, error, createInstitution, updateInstitution, deleteInstitution } = useInstitutions();
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [formData, setFormData] = useState<InstitutionFormData>({
    nom: '',
    sigle: '',
    siege: '',
    devise_principale: '',
    devise_secondaire: '',
    rib: '',
    tutelle_id: '',
    date_adhesion: '',
    document_adhesion: ''
  });

  // Fonction pour obtenir la couleur d'un type d'organisation
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'institution financière':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'organisation internationale':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'banque centrale':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'institution multilaterale':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filtrer les institutions selon les critères de recherche
  const filteredOrganisations = institutions.filter(institution => {
    const matchesSearch = institution.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.sigle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.siege?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || institution.tutelle?.libelle === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Fonction pour rafraîchir les données
  const refetch = () => {
    window.location.reload(); // Simple rechargement pour l'instant
  };

  const filteredInstitutions = institutions.filter(org =>
    org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.sigle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convertir les données du formulaire au format Institution
      const institutionData: Partial<Institution> = {
        nom: formData.nom,
        sigle: formData.sigle,
        siege: formData.siege,
        devise_principale: formData.devise_principale,
        devise_secondaire: formData.devise_secondaire,
        rib: formData.rib,
        date_adhesion: formData.date_adhesion || null,
        document_adhesion: formData.document_adhesion,
        tutelle: formData.tutelle_id ? { id: formData.tutelle_id, libelle: null, type: null } : { id: null, libelle: null, type: null }
      };

      if (editingInstitution) {
        // Mise à jour d'une institution existante
        await updateInstitution(editingInstitution.id, institutionData);
      } else {
        // Création d'une nouvelle institution
        await createInstitution(institutionData);
      }
      
      setShowForm(false);
      setEditingInstitution(null);
      setFormData({
        nom: '',
        sigle: '',
        siege: '',
        devise_principale: '',
        devise_secondaire: '',
        rib: '',
        tutelle_id: '',
        date_adhesion: '',
        document_adhesion: ''
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (institution: Institution) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'institution "${institution.nom}" ?`)) {
      try {
        await deleteInstitution(institution.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      sigle: '',
      siege: '',
      date_adhesion: '',
      document_adhesion: '',
      rib: '',
      tutelle_id: '',
      devise_principale: 'USD',
      devise_secondaire: '',
    });
    setEditingInstitution(null);
    setShowForm(false);
  };

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution);
    setFormData({
      nom: institution.nom || '',
      sigle: institution.sigle || '',
      siege: institution.siege || '',
      devise_principale: institution.devise_principale || '',
      devise_secondaire: institution.devise_secondaire || '',
      rib: institution.rib || '',
      tutelle_id: institution.tutelle?.id || '',
      date_adhesion: institution.date_adhesion || '',
      document_adhesion: institution.document_adhesion || ''
    });
    setShowForm(true);
  };

  const handleViewDetails = (institution: Institution) => {
    setSelectedInstitution(institution);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des institutions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-2">Erreur de chargement</div>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organisations Internationales</h1>
          <p className="text-muted-foreground">
            Gestion des organisations auxquelles la République de Guinée contribue
          </p>
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingInstitution(null)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Institution
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInstitution ? 'Modifier l\'Institution' : 'Créer une Nouvelle Institution'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom Complet *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sigle">Sigle *</Label>
                  <Input
                    id="sigle"
                    value={formData.sigle}
                    onChange={(e) => setFormData({...formData, sigle: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siege">Pays du Siège *</Label>
                <Input
                  id="siege"
                  value={formData.siege}
                  onChange={(e) => setFormData({...formData, siege: e.target.value})}
                  required
                />
              </div>

              {/* Tutelle */}
              <div>
                <Label htmlFor="tutelle_id">Ministère de Tutelle *</Label>
                <Select value={formData.tutelle_id} onValueChange={(value) => setFormData({...formData, tutelle_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une tutelle" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutelles.map((tutelle) => (
                      <SelectItem key={tutelle.cd_tutelle} value={tutelle.cd_tutelle}>
                        {tutelle.libelle} ({tutelle.type__libelle})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Devises */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="devise_principale">Devise Principale *</Label>
                  <Select value={formData.devise_principale} onValueChange={(value) => setFormData({...formData, devise_principale: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - Dollar Américain</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
                      <SelectItem value="XAF">XAF - Franc CFA</SelectItem>
                      <SelectItem value="CHF">CHF - Franc Suisse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="devise_secondaire">Devise Secondaire</Label>
                  <Input
                    id="devise_secondaire"
                    value={formData.devise_secondaire}
                    onChange={(e) => setFormData({...formData, devise_secondaire: e.target.value})}
                    placeholder="Ex: EUR"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="date_adhesion">Date d'Adhésion</Label>
                <Input
                  id="date_adhesion"
                  type="date"
                  value={formData.date_adhesion}
                  onChange={(e) => setFormData({...formData, date_adhesion: e.target.value})}
                />
              </div>

              {/* Informations bancaires et documents */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Informations Bancaires et Documents</h3>
                
                <div>
                  <Label htmlFor="rib">RIB (Relevé d'Identité Bancaire)</Label>
                  <Input
                    id="rib"
                    value={formData.rib}
                    onChange={(e) => setFormData({...formData, rib: e.target.value})}
                    placeholder="Ex: FR76 3000 3000 1100 0013 7800 145"
                  />
                </div>

                <div>
                  <Label htmlFor="document_adhesion">Document d'Adhésion</Label>
                  <Input
                    id="document_adhesion"
                    value={formData.document_adhesion}
                    onChange={(e) => setFormData({...formData, document_adhesion: e.target.value})}
                    placeholder="Nom du fichier du document d'adhésion"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingInstitution ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une organisation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Organisations Internationales</CardTitle>
          <CardDescription>
            Aperçu de toutes les organisations auxquelles la Guinée contribue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Pays Siège</TableHead>
                <TableHead>Ministère de Tutelle</TableHead>
                <TableHead>Devise</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutions.map((institution) => (
                <TableRow key={institution.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{institution.sigle}</div>
                      <div className="text-sm text-muted-foreground">{institution.nom}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      {institution.siege}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate max-w-[200px]" title={institution.tutelle.libelle || ''}>
                        {institution.tutelle.libelle || 'Non assigné'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{institution.devise_principale}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(institution)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(institution)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">Aucune institution trouvée</h3>
              <p className="mt-1 text-muted-foreground">
                {searchTerm ? 'Aucune institution ne correspond à votre recherche.' : 'Commencez par créer une nouvelle institution.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vue détaillée - Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'Institution</DialogTitle>
          </DialogHeader>
          
          {selectedInstitution && (
            <div className="space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary" />
                    Informations Générales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Nom Complet</Label>
                      <p className="text-base font-medium">{selectedInstitution.nom}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Sigle</Label>
                      <p className="text-base font-semibold text-primary">{selectedInstitution.sigle}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Pays du Siège</Label>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-base">{selectedInstitution.siege}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Devise Principale</Label>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Badge variant="outline" className="text-base px-3 py-1">{selectedInstitution.devise_principale}</Badge>
                      </div>
                    </div>
                    {selectedInstitution.tutelle.libelle && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Ministère de Tutelle</Label>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-base font-medium">{selectedInstitution.tutelle.libelle}</p>
                        </div>
                      </div>
                    )}
                    {selectedInstitution.date_adhesion && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Date d'Adhésion</Label>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-base font-medium">
                            {new Date(selectedInstitution.date_adhesion).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Informations Financières et Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      Informations Bancaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedInstitution.rib ? (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-muted-foreground">RIB</Label>
                        <div className="bg-muted/50 p-4 rounded-lg border">
                          <p className="font-mono text-base tracking-wider break-all">{selectedInstitution.rib}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">RIB non renseigné</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Document d'Adhésion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedInstitution.document_adhesion ? (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-muted-foreground">Document Officiel</Label>
                        <div className="bg-muted/50 p-4 rounded-lg border flex items-center">
                          <FileText className="h-8 w-8 text-primary mr-3 flex-shrink-0" />
                          <div>
                            <p className="font-medium break-all">{selectedInstitution.document_adhesion}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Document d'adhésion officiel
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Document non renseigné</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => {
                        handleEdit(selectedInstitution);
                        setShowDetails(false);
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier cette institution
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};