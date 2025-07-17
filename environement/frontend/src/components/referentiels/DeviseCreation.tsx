import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DeviseCreation = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    symbole: '',
    pays: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Devise créée",
      description: `La devise ${formData.code} a été créée avec succès.`,
    });
    setFormData({
      code: '',
      nom: '',
      symbole: '',
      pays: '',
      statut: 'Actif'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Création de Devise</h1>
        <p className="text-muted-foreground">Ajouter une nouvelle devise au système</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Devise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code Devise *</Label>
                <Input
                  id="code"
                  placeholder="ex: USD, EUR, GNF"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  maxLength={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="symbole">Symbole *</Label>
                <Input
                  id="symbole"
                  placeholder="ex: $, €, GNF"
                  value={formData.symbole}
                  onChange={(e) => setFormData({...formData, symbole: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nom">Nom Complet *</Label>
              <Input
                id="nom"
                placeholder="ex: Dollar Américain, Euro, Franc Guinéen"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pays">Pays/Zone</Label>
                <Input
                  id="pays"
                  placeholder="ex: États-Unis, Zone Euro, Guinée"
                  value={formData.pays}
                  onChange={(e) => setFormData({...formData, pays: e.target.value})}
                />
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

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Annuler
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Créer la Devise
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};