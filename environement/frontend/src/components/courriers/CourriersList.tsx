import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, FileText, Search, Calendar, Building, Filter, Eye, Edit, Archive, CheckCircle, XCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Organisation {
  id: string;
  nom: string;
  sigle: string;
  type_organisation: string;
  ministere_tutelle_id: string;
  devise_defaut: string;
  montant_cotisation_annuelle: number;
  description: string;
  ministeres?: {
    id: string;
    nom: string;
    sigle: string;
  };
}

interface Ministere {
  id: string;
  nom: string;
  sigle: string;
}

interface Courrier {
  id: string;
  organisation_id: string;
  ministere_id: string;
  montant_cotisation: number;
  devise: string;
  numero_courrier: string;
  date_reception: string;
  annee_cotisation: number;
  statut: string;
  observations: string;
  fichier_courrier_url: string | null;
  organisations: Organisation;
  ministeres: Ministere;
}

export function CourriersList() {
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreAnnee, setFiltreAnnee] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCourrier, setSelectedCourrier] = useState<Courrier | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    statut: "",
    observations: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCourriers();
  }, []);

  const fetchCourriers = async () => {
    try {
      const { data, error } = await supabase
        .from('courriers')
        .select(`
          *,
          organisations(id, nom, sigle, type_organisation, ministere_tutelle_id, devise_defaut, montant_cotisation_annuelle, description, ministeres(id, nom, sigle)),
          ministeres(id, nom, sigle)
        `)
        .order('date_reception', { ascending: false });

      if (error) throw error;
      setCourriers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des courriers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des courriers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (courrier: Courrier) => {
    setSelectedCourrier(courrier);
    setIsDetailsOpen(true);
  };

  const handleEditCourrier = (courrier: Courrier) => {
    setSelectedCourrier(courrier);
    setEditFormData({
      statut: courrier.statut,
      observations: courrier.observations || ""
    });
    setIsEditOpen(true);
  };

  const handleUpdateCourrier = async () => {
    if (!selectedCourrier) return;

    try {
      const { error } = await supabase
        .from('courriers')
        .update({
          statut: editFormData.statut,
          observations: editFormData.observations
        })
        .eq('id', selectedCourrier.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Courrier mis à jour avec succès"
      });

      setIsEditOpen(false);
      fetchCourriers();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le courrier",
        variant: "destructive"
      });
    }
  };

  const handleArchiveCourrier = async (courrierId: string) => {
    try {
      const { error } = await supabase
        .from('courriers')
        .update({ statut: 'archive' })
        .eq('id', courrierId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Courrier archivé avec succès"
      });

      fetchCourriers();
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'archiver le courrier",
        variant: "destructive"
      });
    }
  };

  const formatAmount = (amount: number, devise: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise === 'GNF' ? 'GNF' : devise,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'recu':
        return <Badge variant="default">Reçu</Badge>;
      case 'traite':
        return <Badge variant="secondary">Traité</Badge>;
      case 'archive':
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  // Filtrage des courriers
  const filteredCourriers = courriers.filter(courrier => {
    const matchesSearch = 
      courrier.organisations?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courrier.organisations?.sigle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courrier.ministeres?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courrier.numero_courrier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = !filtreStatut || courrier.statut === filtreStatut;
    const matchesAnnee = !filtreAnnee || courrier.annee_cotisation.toString() === filtreAnnee;
    
    return matchesSearch && matchesStatut && matchesAnnee;
  });

  // Obtenir les années uniques pour le filtre
  const anneesUniques = [...new Set(courriers.map(c => c.annee_cotisation))].sort((a, b) => b - a);

  // Calculs statistiques
  const stats = {
    total: filteredCourriers.length,
    recus: filteredCourriers.filter(c => c.statut === 'recu').length,
    traites: filteredCourriers.filter(c => c.statut === 'traite').length,
    montantTotal: filteredCourriers.reduce((sum, c) => sum + c.montant_cotisation, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement des courriers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Liste des Courriers</h1>
          <p className="text-muted-foreground">
            Consultation de tous les courriers reçus
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Courriers</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Reçus</p>
              <p className="text-2xl font-bold text-blue-600">{stats.recus}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Traités</p>
              <p className="text-2xl font-bold text-green-600">{stats.traites}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Montant Total</p>
              <p className="text-lg font-bold text-primary">
                {formatAmount(stats.montantTotal, 'GNF')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par organisation, ministère ou numéro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="min-w-[150px]">
              <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="recu">Reçu</SelectItem>
                  <SelectItem value="traite">Traité</SelectItem>
                  <SelectItem value="archive">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[120px]">
              <Select value={filtreAnnee} onValueChange={setFiltreAnnee}>
                <SelectTrigger>
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les années</SelectItem>
                  {anneesUniques.map(annee => (
                    <SelectItem key={annee} value={annee.toString()}>
                      {annee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || filtreStatut || filtreAnnee) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFiltreStatut("");
                  setFiltreAnnee("");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table des courriers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Courriers ({filteredCourriers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date réception</TableHead>
                <TableHead>N° Courrier</TableHead>
                <TableHead>Organisation Internationale</TableHead>
                <TableHead>Ministère expéditeur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourriers.map((courrier) => (
                <TableRow key={courrier.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(courrier.date_reception).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {courrier.numero_courrier || '-'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{courrier.organisations?.nom}</div>
                      <div className="text-sm text-muted-foreground">
                        <Building className="h-3 w-3 inline mr-1" />
                        {courrier.organisations?.sigle} • {courrier.organisations?.type_organisation}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Devise: {courrier.organisations?.devise_defaut} • 
                        Cotisation: {courrier.organisations?.montant_cotisation_annuelle?.toLocaleString('fr-FR')} {courrier.organisations?.devise_defaut}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{courrier.ministeres?.nom}</div>
                      <div className="text-sm text-muted-foreground">
                        {courrier.ministeres?.sigle}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatAmount(courrier.montant_cotisation, courrier.devise)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{courrier.annee_cotisation}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatutBadge(courrier.statut)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Voir détails"
                        onClick={() => handleViewDetails(courrier)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Modifier"
                        onClick={() => handleEditCourrier(courrier)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {courrier.statut !== 'archive' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Archiver"
                          onClick={() => handleArchiveCourrier(courrier.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      {courrier.fichier_courrier_url && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Télécharger le fichier"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCourriers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {courriers.length === 0 
                      ? "Aucun courrier enregistré" 
                      : "Aucun courrier ne correspond aux critères de recherche"
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section observations pour courriers avec remarques */}
      {filteredCourriers.some(c => c.observations) && (
        <Card>
          <CardHeader>
            <CardTitle>Courriers avec observations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCourriers
                .filter(c => c.observations)
                .map((courrier) => (
                  <div key={courrier.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">
                        {courrier.organisations?.nom} - {courrier.numero_courrier || 'Sans numéro'}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(courrier.date_reception).toLocaleDateString('fr-FR')}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {courrier.observations}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour voir les détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails du courrier</DialogTitle>
          </DialogHeader>
          {selectedCourrier && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="font-medium">Numéro de courrier</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourrier.numero_courrier || 'Non renseigné'}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Date de réception</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedCourrier.date_reception).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Année de cotisation</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourrier.annee_cotisation}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Statut</Label>
                      <div className="mt-1">
                        {getStatutBadge(selectedCourrier.statut)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Organisation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="font-medium">Nom de l'organisation</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourrier.organisations?.nom}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Sigle</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourrier.organisations?.sigle}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Type d'organisation</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourrier.organisations?.type_organisation}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Ministère expéditeur</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourrier.ministeres?.nom} ({selectedCourrier.ministeres?.sigle})
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Montant et cotisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="font-medium">Montant du courrier</Label>
                      <p className="text-lg font-bold text-primary">
                        {formatAmount(selectedCourrier.montant_cotisation, selectedCourrier.devise)}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Devise</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourrier.devise}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Cotisation annuelle attendue</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourrier.organisations?.montant_cotisation_annuelle?.toLocaleString('fr-FR')} {selectedCourrier.organisations?.devise_defaut}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedCourrier.observations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Observations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedCourrier.observations}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier le courrier */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le courrier</DialogTitle>
          </DialogHeader>
          {selectedCourrier && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-statut">Statut *</Label>
                <Select 
                  value={editFormData.statut} 
                  onValueChange={(value) => setEditFormData({...editFormData, statut: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recu">Reçu</SelectItem>
                    <SelectItem value="traite">Traité</SelectItem>
                    <SelectItem value="archive">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-observations">Observations</Label>
                <Textarea
                  id="edit-observations"
                  value={editFormData.observations}
                  onChange={(e) => setEditFormData({...editFormData, observations: e.target.value})}
                  placeholder="Ajouter des observations..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateCourrier}>
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}