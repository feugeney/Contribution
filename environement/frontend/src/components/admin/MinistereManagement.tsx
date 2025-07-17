import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Building, MapPin, Phone, Mail, Search, FileText, X, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ministere {
  id: string;
  nom: string;
  sigle: string;
  code: string;
  type: 'Ministère' | 'Institution' | 'Agence';
  adresse: string;
  telephone: string;
  email: string;
  responsable: string;
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
}

const mockMinisteres: Ministere[] = [
  {
    id: '1',
    nom: 'Ministère des Affaires Étrangères',
    sigle: 'MAE',
    code: 'MAE001',
    type: 'Ministère',
    adresse: 'Conakry, République de Guinée',
    telephone: '+224 628 123 456',
    email: 'contact@mae.gov.gn',
    responsable: 'Dr. Morissanda Kouyaté',
    statut: 'Actif',
    dateCreation: '2023-01-15'
  },
  {
    id: '2',
    nom: 'Ministère de l\'Économie et des Finances',
    sigle: 'MEF',
    code: 'MEF001',
    type: 'Ministère',
    adresse: 'Conakry, République de Guinée',
    telephone: '+224 628 789 012',
    email: 'contact@mef.gov.gn',
    responsable: 'Mr. Saifoulaye Diallo',
    statut: 'Actif',
    dateCreation: '2023-01-15'
  }
];

export const MinistereManagement = () => {
  const [ministeres, setMinisteres] = useState<Ministere[]>(mockMinisteres);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMinistere, setEditingMinistere] = useState<Ministere | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMinistere, setSelectedMinistere] = useState<Ministere | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nom: '',
    sigle: '',
    code: '',
    type: 'Ministère' as 'Ministère' | 'Institution' | 'Agence',
    adresse: '',
    telephone: '',
    email: '',
    responsable: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const filteredMinisteres = ministeres.filter(ministere =>
    ministere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministere.sigle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMinistere) {
      setMinisteres(ministeres.map(m => 
        m.id === editingMinistere.id 
          ? { ...editingMinistere, ...formData }
          : m
      ));
      toast({
        title: "Ministère modifié",
        description: "Les informations ont été mises à jour avec succès.",
      });
    } else {
      const newMinistere: Ministere = {
        id: Date.now().toString(),
        ...formData,
        dateCreation: new Date().toISOString().split('T')[0]
      };
      setMinisteres([...ministeres, newMinistere]);
      toast({
        title: "Ministère créé",
        description: "Le nouveau ministère a été ajouté avec succès.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      sigle: '',
      code: '',
      type: 'Ministère',
      adresse: '',
      telephone: '',
      email: '',
      responsable: '',
      statut: 'Actif'
    });
    setEditingMinistere(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (ministere: Ministere) => {
    setEditingMinistere(ministere);
    setFormData({
      nom: ministere.nom,
      sigle: ministere.sigle,
      code: ministere.code,
      type: ministere.type,
      adresse: ministere.adresse,
      telephone: ministere.telephone,
      email: ministere.email,
      responsable: ministere.responsable,
      statut: ministere.statut
    });
    setIsDialogOpen(true);
  };

  const handleViewDetails = (ministere: Ministere) => {
    setSelectedMinistere(ministere);
    setShowDetails(true);
  };

  const handleDelete = (id: string) => {
    setMinisteres(ministeres.filter(m => m.id !== id));
    toast({
      title: "Ministère supprimé",
      description: "Le ministère a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Ministère': return 'bg-guinea-red/10 text-guinea-red';
      case 'Institution': return 'bg-guinea-yellow/10 text-guinea-yellow';
      case 'Agence': return 'bg-guinea-green/10 text-guinea-green';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ministères et Institutions</h1>
          <p className="text-muted-foreground">Gérez les ministères et institutions de tutelle</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMinistere(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Ministère
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMinistere ? 'Modifier le Ministère' : 'Créer un Nouveau Ministère'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
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
                <div>
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value: 'Ministère' | 'Institution' | 'Agence') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ministère">Ministère</SelectItem>
                      <SelectItem value="Institution">Institution</SelectItem>
                      <SelectItem value="Agence">Agence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={formData.statut} onValueChange={(value: 'Actif' | 'Inactif') => setFormData({...formData, statut: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="responsable">Responsable</Label>
                <Input
                  id="responsable"
                  value={formData.responsable}
                  onChange={(e) => setFormData({...formData, responsable: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingMinistere ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par nom ou sigle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Ministères et Institutions</CardTitle>
          <CardDescription>
            Gérez tous les ministères et institutions de tutelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ministère/Institution</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMinisteres.map((ministere) => (
                <TableRow key={ministere.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ministere.sigle}</div>
                      <div className="text-sm text-muted-foreground">{ministere.nom}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Code: {ministere.code}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(ministere.type)}>
                      {ministere.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {ministere.responsable}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{ministere.telephone}</div>
                      <div className="text-muted-foreground">{ministere.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ministere.statut === 'Actif' ? 'default' : 'secondary'}>
                      {ministere.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(ministere)} title="Voir détails">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(ministere)} title="Modifier">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredMinisteres.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Aucun ministère trouvé</p>
        </div>
      )}

      {/* Dialog pour les détails du ministère */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                <Building className="h-6 w-6 mr-2 text-primary" />
                Détails de l'Institution
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedMinistere && (
            <div className="space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations Générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nom Complet</Label>
                      <p className="text-base font-medium">{selectedMinistere.nom}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Sigle</Label>
                      <p className="text-base font-medium">{selectedMinistere.sigle}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                      <Badge variant="outline" className="text-sm">{selectedMinistere.code}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <Badge className={getTypeColor(selectedMinistere.type)}>
                        {selectedMinistere.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Adresse</Label>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-base">{selectedMinistere.adresse}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact et Responsable */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Responsable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">{selectedMinistere.responsable}</p>
                        <p className="text-sm text-muted-foreground">Responsable principal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Coordonnées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <p>{selectedMinistere.telephone}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <p>{selectedMinistere.email}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Statut et Date de création */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statut et Informations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                      <div className="mt-1">
                        <Badge variant={selectedMinistere.statut === 'Actif' ? 'default' : 'secondary'}>
                          {selectedMinistere.statut}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date de Création</Label>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{new Date(selectedMinistere.dateCreation).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
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