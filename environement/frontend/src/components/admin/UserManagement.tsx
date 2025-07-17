
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/budget';

interface UserFormData {
  name: string;
  email: string;
  role: 'administrateur' | 'directeur_general' | 'daf' | 'controleur_financier' | 'agent_comptable';
  epa: string;
}

export const UserManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [users] = useState<User[]>([
    {
      id: '1',
      nom: 'Système',
      prenom: 'Admin',
      name: 'Admin Système',
      email: 'admin@epac001.gov.gn',
      role: 'administrateur',
      epa_id: '1',
      epa: 'EPAC-001',
      actif: true,
      date_creation: '2024-01-01'
    },
    {
      id: '2',
      nom: 'DIALLO',
      prenom: 'Alpha',
      name: 'M. DIALLO Alpha',
      email: 'dg@epac001.gov.gn',
      role: 'directeur_general',
      epa_id: '1',
      epa: 'EPAC-001',
      actif: true,
      date_creation: '2024-01-15'
    }
  ]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<UserFormData>();
  const { toast } = useToast();

  const roleLabels = {
    'administrateur': 'Administrateur',
    'directeur_general': 'Directeur Général',
    'daf': 'Directeur Administratif et Financier',
    'controleur_financier': 'Contrôleur Financier',
    'agent_comptable': 'Agent Comptable'
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      'administrateur': 'bg-red-100 text-red-800',
      'directeur_general': 'bg-purple-100 text-purple-800',
      'daf': 'bg-blue-100 text-blue-800',
      'controleur_financier': 'bg-orange-100 text-orange-800',
      'agent_comptable': 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const onSubmit = (data: UserFormData) => {
    console.log('Nouvel utilisateur:', data);
    toast({
      title: "Utilisateur créé",
      description: `L'utilisateur ${data.name} a été créé avec succès.`,
    });
    reset();
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Administration des comptes utilisateurs</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          Créer un utilisateur
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Ce champ est requis' })}
                    placeholder="Nom et prénoms"
                  />
                  {errors.name && <span className="text-sm text-red-600">{errors.name.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Ce champ est requis' })}
                    placeholder="utilisateur@epa.gov.gn"
                  />
                  {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle *</Label>
                  <Select onValueChange={(value) => setValue('role', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="epa">EPA *</Label>
                  <Select onValueChange={(value) => setValue('epa', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un EPA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EPAC-001">EPAC-001</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Créer l'utilisateur
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs existants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {roleLabels[user.role as keyof typeof roleLabels]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{user.epa}</span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Modifier</Button>
                    <Button variant="destructive" size="sm">Supprimer</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
