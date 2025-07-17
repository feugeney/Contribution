import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfileData {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  telephone: string;
  poste: string;
  ministere: string;
  role: string;
  dateCreation: string;
  derniereConnexion: string;
  avatar: string;
  statut: 'actif' | 'inactif';
}

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<UserProfileData>({
    id: '1',
    nom: 'TRAORE',
    prenoms: 'Mohamed Lamine',
    email: 'mohamed.traore@finances.gov.gn',
    telephone: '+224 622 345 678',
    poste: 'Directeur des Organisations Internationales',
    ministere: 'Ministère de l\'Économie et des Finances',
    role: 'Administrateur',
    dateCreation: '2024-01-15',
    derniereConnexion: '2024-12-14T10:30:00',
    avatar: '',
    statut: 'actif'
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès.",
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const getInitials = (nom: string, prenoms: string) => {
    return `${prenoms.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrateur': return 'bg-red-100 text-red-800';
      case 'Gestionnaire': return 'bg-blue-100 text-blue-800';
      case 'Consultation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-lg">
                  {getInitials(profileData.nom, profileData.prenoms)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{profileData.prenoms} {profileData.nom}</CardTitle>
            <CardDescription>{profileData.poste}</CardDescription>
            <div className="flex justify-center mt-2">
              <Badge className={getRoleColor(profileData.role)}>
                <Shield className="h-3 w-3 mr-1" />
                {profileData.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="break-all">{profileData.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profileData.telephone}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-xs">{profileData.ministere}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Inscrit le {new Date(profileData.dateCreation).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>
              Mettez à jour vos informations personnelles et de contact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenoms">Prénoms</Label>
                <Input
                  id="prenoms"
                  value={isEditing ? editData.prenoms : profileData.prenoms}
                  onChange={(e) => setEditData({...editData, prenoms: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={isEditing ? editData.nom : profileData.nom}
                  onChange={(e) => setEditData({...editData, nom: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? editData.email : profileData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={isEditing ? editData.telephone : profileData.telephone}
                  onChange={(e) => setEditData({...editData, telephone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="poste">Poste</Label>
              <Input
                id="poste"
                value={isEditing ? editData.poste : profileData.poste}
                onChange={(e) => setEditData({...editData, poste: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="ministere">Ministère/Institution</Label>
              <Input
                id="ministere"
                value={isEditing ? editData.ministere : profileData.ministere}
                onChange={(e) => setEditData({...editData, ministere: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Activité du Compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">47</p>
              <p className="text-sm text-muted-foreground">Courriers traités</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">23</p>
              <p className="text-sm text-muted-foreground">Contributions validées</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-muted-foreground">Rapports générés</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-purple-600">156</p>
              <p className="text-sm text-muted-foreground">Connexions totales</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-2">
            <h3 className="font-semibold">Dernière activité</h3>
            <p className="text-sm text-muted-foreground">
              Dernière connexion: {new Date(profileData.derniereConnexion).toLocaleString('fr-FR')}
            </p>
            <p className="text-sm text-muted-foreground">
              Statut du compte: <Badge variant={profileData.statut === 'actif' ? 'default' : 'secondary'}>
                {profileData.statut}
              </Badge>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};