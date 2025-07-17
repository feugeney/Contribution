import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Key, 
  Edit, 
  Lock, 
  Unlock, 
  Trash2,
  Eye,
  Calendar,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  poste: string;
  ministere: string;
  role: 'administrateur' | 'gestionnaire' | 'consultation';
  statut: 'actif' | 'inactif' | 'suspendu';
  dateCreation: string;
  derniereConnexion: string;
  nombreConnexions: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    nom: 'TRAORE',
    prenoms: 'Mohamed Lamine',
    email: 'mohamed.traore@finances.gov.gn',
    telephone: '+224 622 345 678',
    poste: 'Directeur des Organisations Internationales',
    ministere: 'Ministère de l\'Économie et des Finances',
    role: 'administrateur',
    statut: 'actif',
    dateCreation: '2024-01-15',
    derniereConnexion: '2024-12-14T10:30:00',
    nombreConnexions: 156
  },
  {
    id: '2',
    nom: 'DIALLO',
    prenoms: 'Fatoumata',
    email: 'fatoumata.diallo@finances.gov.gn',
    telephone: '+224 655 123 456',
    poste: 'Chef de Service Contributions',
    ministere: 'Ministère de l\'Économie et des Finances',
    role: 'gestionnaire',
    statut: 'actif',
    dateCreation: '2024-02-10',
    derniereConnexion: '2024-12-13T16:45:00',
    nombreConnexions: 89
  },
  {
    id: '3',
    nom: 'CAMARA',
    prenoms: 'Ibrahima',
    email: 'ibrahima.camara@affaires-etrangeres.gov.gn',
    telephone: '+224 664 789 012',
    poste: 'Chargé des Relations Multilatérales',
    ministere: 'Ministère des Affaires Étrangères',
    role: 'consultation',
    statut: 'actif',
    dateCreation: '2024-03-05',
    derniereConnexion: '2024-12-12T09:15:00',
    nombreConnexions: 34
  }
];

export const AccountManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    email: '',
    telephone: '',
    poste: '',
    ministere: '',
    role: 'consultation' as User['role'],
    statut: 'actif' as User['statut']
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatut = !selectedStatut || user.statut === selectedStatut;
    
    return matchesSearch && matchesRole && matchesStatut;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
      toast({
        title: "Utilisateur modifié",
        description: "Les informations ont été mises à jour avec succès.",
      });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        dateCreation: new Date().toISOString().split('T')[0],
        derniereConnexion: new Date().toISOString(),
        nombreConnexions: 0
      };
      setUsers([...users, newUser]);
      toast({
        title: "Utilisateur créé",
        description: "Le nouvel utilisateur a été ajouté avec succès.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenoms: '',
      email: '',
      telephone: '',
      poste: '',
      ministere: '',
      role: 'consultation',
      statut: 'actif'
    });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenoms: user.prenoms,
      email: user.email,
      telephone: user.telephone,
      poste: user.poste,
      ministere: user.ministere,
      role: user.role,
      statut: user.statut
    });
    setIsDialogOpen(true);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, statut: user.statut === 'actif' ? 'inactif' : 'actif' }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: `Utilisateur ${user?.statut === 'actif' ? 'désactivé' : 'activé'}`,
      description: `Le compte de ${user?.prenoms} ${user?.nom} a été ${user?.statut === 'actif' ? 'désactivé' : 'activé'}.`,
    });
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Utilisateur supprimé",
      description: `Le compte de ${user?.prenoms} ${user?.nom} a été supprimé.`,
      variant: "destructive"
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'administrateur':
        return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>;
      case 'gestionnaire':
        return <Badge className="bg-blue-100 text-blue-800">Gestionnaire</Badge>;
      case 'consultation':
        return <Badge className="bg-green-100 text-green-800">Consultation</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactif':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      case 'suspendu':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const stats = {
    total: users.length,
    actifs: users.filter(u => u.statut === 'actif').length,
    administrateurs: users.filter(u => u.role === 'administrateur').length,
    gestionnaires: users.filter(u => u.role === 'gestionnaire').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Comptes</h1>
          <p className="text-muted-foreground">
            Administration des utilisateurs et gestion des accès
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Modifier l\'Utilisateur' : 'Créer un Nouvel Utilisateur'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenoms">Prénoms *</Label>
                  <Input
                    id="prenoms"
                    value={formData.prenoms}
                    onChange={(e) => setFormData({...formData, prenoms: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="poste">Poste *</Label>
                <Input
                  id="poste"
                  value={formData.poste}
                  onChange={(e) => setFormData({...formData, poste: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="ministere">Ministère/Institution *</Label>
                <Select value={formData.ministere} onValueChange={(value) => setFormData({...formData, ministere: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un ministère" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ministère de l'Économie et des Finances">Ministère de l'Économie et des Finances</SelectItem>
                    <SelectItem value="Ministère des Affaires Étrangères">Ministère des Affaires Étrangères</SelectItem>
                    <SelectItem value="Ministère du Commerce">Ministère du Commerce</SelectItem>
                    <SelectItem value="Ministère de la Santé">Ministère de la Santé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Rôle *</Label>
                  <Select value={formData.role} onValueChange={(value: User['role']) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="gestionnaire">Gestionnaire</SelectItem>
                      <SelectItem value="administrateur">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={formData.statut} onValueChange={(value: User['statut']) => setFormData({...formData, statut: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                      <SelectItem value="suspendu">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingUser ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Comptes Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Administrateurs</p>
              <p className="text-2xl font-bold text-red-600">{stats.administrateurs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Gestionnaires</p>
              <p className="text-2xl font-bold text-blue-600">{stats.gestionnaires}</p>
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
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="min-w-[150px]">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les rôles</SelectItem>
                  <SelectItem value="administrateur">Administrateur</SelectItem>
                  <SelectItem value="gestionnaire">Gestionnaire</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[150px]">
              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Liste des Utilisateurs ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière Connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.prenoms} {user.nom}</div>
                      <div className="text-sm text-muted-foreground">{user.ministere}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{user.email}</div>
                      <div className="text-sm text-muted-foreground">{user.telephone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{user.poste}</div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    {getStatutBadge(user.statut)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(user.derniereConnexion).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.nombreConnexions} connexions
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewingUser(user)}
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(user)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleUserStatus(user.id)}
                        title={user.statut === 'actif' ? 'Désactiver' : 'Activer'}
                      >
                        {user.statut === 'actif' ? 
                          <Lock className="h-4 w-4" /> : 
                          <Unlock className="h-4 w-4" />
                        }
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteUser(user.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};