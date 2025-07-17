import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  fichier_courrier_url: string;
  organisations: Organisation;
  ministeres: Ministere;
}

export function CourriersReception() {
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [ministeres, setMinisteres] = useState<Ministere[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    organisation_id: "",
    ministere_id: "",
    montant_cotisation: "",
    devise: "GNF",
    numero_courrier: "",
    date_reception: new Date().toISOString().split('T')[0],
    annee_cotisation: new Date().getFullYear(),
    observations: "",
    fichier_courrier_url: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch courriers with related data
      const { data: courriersData, error: courriersError } = await supabase
        .from('courriers')
        .select(`
          *,
          organisations(id, nom, sigle, type_organisation, ministere_tutelle_id, devise_defaut, montant_cotisation_annuelle, description, ministeres(id, nom, sigle)),
          ministeres(id, nom, sigle)
        `)
        .order('date_reception', { ascending: false });

      if (courriersError) throw courriersError;
      setCourriers(courriersData || []);

      // Fetch organisations avec leurs ministères de tutelle
      const { data: orgsData, error: orgsError } = await supabase
        .from('organisations')
        .select(`
          id, nom, sigle, type_organisation, 
          ministere_tutelle_id, devise_defaut, 
          montant_cotisation_annuelle, description,
          ministeres(id, nom, sigle)
        `)
        .order('nom');

      if (orgsError) throw orgsError;
      setOrganisations(orgsData || []);

      // Fetch ministères
      const { data: minData, error: minError } = await supabase
        .from('ministeres')
        .select('*')
        .order('nom');

      if (minError) throw minError;
      setMinisteres(minData || []);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    }
  };

  // Fonction pour charger automatiquement les informations quand on sélectionne une organisation
  const handleOrganisationChange = (organisationId: string) => {
    const selectedOrg = organisations.find(org => org.id === organisationId);
    if (selectedOrg) {
      setFormData(prev => ({
        ...prev,
        organisation_id: organisationId,
        ministere_id: selectedOrg.ministere_tutelle_id || "",
        devise: selectedOrg.devise_defaut || "GNF",
        montant_cotisation: selectedOrg.montant_cotisation_annuelle?.toString() || ""
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('courriers')
        .insert([{
          organisation_id: formData.organisation_id,
          ministere_id: formData.ministere_id,
          montant_cotisation: parseFloat(formData.montant_cotisation),
          devise: formData.devise,
          numero_courrier: formData.numero_courrier,
          date_reception: formData.date_reception,
          annee_cotisation: formData.annee_cotisation,
          observations: formData.observations
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Courrier enregistré avec succès. La cotisation a été automatiquement ajoutée."
      });

      setIsDialogOpen(false);
      setFormData({
        organisation_id: "",
        ministere_id: "",
        montant_cotisation: "",
        devise: "GNF",
        numero_courrier: "",
        date_reception: new Date().toISOString().split('T')[0],
        annee_cotisation: new Date().getFullYear(),
        observations: "",
        fichier_courrier_url: ""
      });
      fetchData();

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le courrier",
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
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const filteredCourriers = courriers.filter(courrier =>
    courrier.organisations?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courrier.organisations?.sigle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courrier.ministeres?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courrier.numero_courrier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Réception des Courriers</h1>
          <p className="text-muted-foreground">
            Enregistrement des courriers de cotisation reçus
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Courrier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enregistrer un nouveau courrier</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="organisation">Organisation Internationale *</Label>
                  <Select 
                    value={formData.organisation_id} 
                    onValueChange={handleOrganisationChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'organisation internationale" />
                    </SelectTrigger>
                    <SelectContent>
                      {organisations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{org.nom} ({org.sigle})</span>
                            <span className="text-xs text-muted-foreground">{org.type_organisation}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ministere">Ministère de Tutelle *</Label>
                  <Select 
                    value={formData.ministere_id} 
                    onValueChange={(value) => setFormData({...formData, ministere_id: value})}
                    required
                    disabled={!formData.organisation_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.organisation_id ? "Ministère chargé automatiquement" : "Sélectionner d'abord une organisation"} />
                    </SelectTrigger>
                    <SelectContent>
                      {ministeres.map((min) => (
                        <SelectItem key={min.id} value={min.id}>
                          {min.nom} ({min.sigle})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.organisation_id && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Ministère de tutelle chargé automatiquement selon l'organisation
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="numero_courrier">Numéro du courrier</Label>
                  <Input
                    id="numero_courrier"
                    value={formData.numero_courrier}
                    onChange={(e) => setFormData({...formData, numero_courrier: e.target.value})}
                    placeholder="Ex: MINFIN/2024/001"
                  />
                </div>

                <div>
                  <Label htmlFor="date_reception">Date de réception *</Label>
                  <Input
                    id="date_reception"
                    type="date"
                    value={formData.date_reception}
                    onChange={(e) => setFormData({...formData, date_reception: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="montant_cotisation">Montant de la cotisation *</Label>
                  <Input
                    id="montant_cotisation"
                    type="number"
                    step="0.01"
                    value={formData.montant_cotisation}
                    onChange={(e) => setFormData({...formData, montant_cotisation: e.target.value})}
                    placeholder="Montant chargé automatiquement"
                    required
                  />
                  {formData.organisation_id && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Montant suggéré selon l'organisation sélectionnée
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="devise">Devise</Label>
                  <Select 
                    value={formData.devise} 
                    onValueChange={(value) => setFormData({...formData, devise: value})}
                    disabled={!formData.organisation_id}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GNF">GNF (Franc Guinéen)</SelectItem>
                      <SelectItem value="USD">USD (Dollar US)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.organisation_id && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Devise chargée automatiquement selon l'organisation
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="annee_cotisation">Année de cotisation *</Label>
                  <Input
                    id="annee_cotisation"
                    type="number"
                    value={formData.annee_cotisation}
                    onChange={(e) => setFormData({...formData, annee_cotisation: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="fichier_courrier">Courrier électronique (PDF)</Label>
                  <Input
                    id="fichier_courrier"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // TODO: Implémenter l'upload du fichier
                        console.log('Fichier sélectionné:', file.name);
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formats acceptés: PDF, DOC, DOCX (max 10MB)
                  </p>
                </div>

                <div>
                  <Label htmlFor="observations">Observations</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => setFormData({...formData, observations: e.target.value})}
                    placeholder="Remarques ou observations sur le courrier..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer le courrier
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Rechercher par organisation, ministère ou numéro de courrier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Courriers reçus ({filteredCourriers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Courrier</TableHead>
                <TableHead>Organisation Internationale</TableHead>
                <TableHead>Ministère de Tutelle</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Date réception</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourriers.map((courrier) => (
                <TableRow key={courrier.id}>
                  <TableCell className="font-mono text-sm">
                    {courrier.numero_courrier || '-'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{courrier.organisations?.nom}</div>
                      <div className="text-sm text-muted-foreground">
                        {courrier.organisations?.sigle}
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
                  <TableCell>{courrier.annee_cotisation}</TableCell>
                  <TableCell>
                    {new Date(courrier.date_reception).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {getStatutBadge(courrier.statut)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCourriers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Aucun courrier trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}