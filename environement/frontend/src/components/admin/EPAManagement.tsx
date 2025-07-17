
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { EPA } from '@/types/budget';

interface EPAFormData {
  nom: string;
  code: string;
  directeur_general: string;
  ministere_id: string;
  secteur_activite: string;
  region: string;
  prefecture: string;
  sous_prefecture: string;
  adresse: string;
  telephone: string;
  email: string;
}

export const EPAManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [epas] = useState<EPA[]>([
    {
      id: '1',
      nom: 'EPAC-001',
      code: 'EPAC001',
      directeur_general: 'M. DIALLO Alpha',
      ministere_id: '1',
      secteur_activite: 'Enseignement supérieur',
      region: 'Conakry',
      prefecture: 'Conakry',
      sous_prefecture: 'Kaloum',
      adresse: 'Conakry, République de Guinée',
      telephone: '+224 622 123 456',
      email: 'contact@epac001.gov.gn',
      date_creation: '2023-01-01'
    }
  ]);

  // Mock data pour les listes déroulantes
  const ministeres = [
    { id: '1', nom: 'Ministère de l\'Économie et des Finances' },
    { id: '2', nom: 'Ministère de l\'Enseignement Supérieur' }
  ];

  const regions = [
    'Conakry', 'Kindia', 'Boké', 'Mamou', 'Labé', 'Faranah', 'Kankan', 'N\'Zérékoré'
  ];

  const prefectures = {
    'Conakry': ['Conakry'],
    'Kindia': ['Kindia', 'Coyah', 'Dubréka', 'Forécariah', 'Télimélé'],
    'Boké': ['Boké', 'Boffa', 'Fria', 'Gaoual', 'Koundara'],
    // ... autres préfectures
  };

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<EPAFormData>();
  const { toast } = useToast();
  const selectedRegion = watch('region');

  const onSubmit = (data: EPAFormData) => {
    console.log('Nouvel EPA:', data);
    toast({
      title: "EPA créé",
      description: `L'EPA ${data.nom} a été créé avec succès.`,
    });
    reset();
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des EPAs</h1>
          <p className="text-muted-foreground">Administration des Établissements Publics Administratifs</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          Créer un EPA
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel EPA</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de l'EPA *</Label>
                  <Input
                    id="nom"
                    {...register('nom', { required: 'Ce champ est requis' })}
                    placeholder="Nom de l'établissement"
                  />
                  {errors.nom && <span className="text-sm text-red-600">{errors.nom.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code EPA *</Label>
                  <Input
                    id="code"
                    {...register('code', { required: 'Ce champ est requis' })}
                    placeholder="Code unique"
                  />
                  {errors.code && <span className="text-sm text-red-600">{errors.code.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ministere">Ministère de tutelle *</Label>
                  <Select onValueChange={(value) => setValue('ministere_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un ministère" />
                    </SelectTrigger>
                    <SelectContent>
                      {ministeres.map((ministere) => (
                        <SelectItem key={ministere.id} value={ministere.id}>
                          {ministere.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ministere_id && <span className="text-sm text-red-600">Ce champ est requis</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secteur_activite">Secteur d'activité *</Label>
                  <Select onValueChange={(value) => setValue('secteur_activite', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enseignement">Enseignement supérieur</SelectItem>
                      <SelectItem value="sante">Santé</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="industrie">Industrie</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.secteur_activite && <span className="text-sm text-red-600">Ce champ est requis</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="directeur_general">Directeur Général *</Label>
                  <Input
                    id="directeur_general"
                    {...register('directeur_general', { required: 'Ce champ est requis' })}
                    placeholder="Nom du directeur général"
                  />
                  {errors.directeur_general && <span className="text-sm text-red-600">{errors.directeur_general.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Région *</Label>
                  <Select onValueChange={(value) => setValue('region', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && <span className="text-sm text-red-600">Ce champ est requis</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prefecture">Préfecture *</Label>
                  <Select onValueChange={(value) => setValue('prefecture', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une préfecture" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRegion && prefectures[selectedRegion as keyof typeof prefectures]?.map((prefecture) => (
                        <SelectItem key={prefecture} value={prefecture}>
                          {prefecture}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.prefecture && <span className="text-sm text-red-600">Ce champ est requis</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sous_prefecture">Sous-préfecture</Label>
                  <Input
                    id="sous_prefecture"
                    {...register('sous_prefecture')}
                    placeholder="Sous-préfecture"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    {...register('telephone')}
                    placeholder="+224 xxx xxx xxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="contact@epa.gov.gn"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="adresse">Adresse complète</Label>
                  <Input
                    id="adresse"
                    {...register('adresse')}
                    placeholder="Adresse complète"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Créer l'EPA
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>EPAs existants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {epas.map((epa) => (
              <div key={epa.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{epa.nom}</h3>
                    <p className="text-sm text-muted-foreground">Code: {epa.code}</p>
                    <p className="text-sm">Directeur: {epa.directeur_general}</p>
                    <p className="text-sm">Secteur: {epa.secteur_activite}</p>
                    <p className="text-sm">Localisation: {epa.region}, {epa.prefecture}</p>
                    <p className="text-sm">{epa.telephone} • {epa.email}</p>
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
