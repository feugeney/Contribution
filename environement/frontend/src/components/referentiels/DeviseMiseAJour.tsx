import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Devise {
  id: string;
  code: string;
  nom: string;
  symbole: string;
  pays: string;
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
}

const mockDevises: Devise[] = [
  { id: '1', code: 'USD', nom: 'Dollar Américain', symbole: '$', pays: 'États-Unis', statut: 'Actif', dateCreation: '2023-01-01' },
  { id: '2', code: 'EUR', nom: 'Euro', symbole: '€', pays: 'Zone Euro', statut: 'Actif', dateCreation: '2023-01-01' },
  { id: '3', code: 'GNF', nom: 'Franc Guinéen', symbole: 'GNF', pays: 'Guinée', statut: 'Actif', dateCreation: '2023-01-01' }
];

export const DeviseMiseAJour = () => {
  const { toast } = useToast();
  const [devises] = useState<Devise[]>(mockDevises);
  const [selectedDevise, setSelectedDevise] = useState<Devise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    symbole: '',
    pays: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const filteredDevises = devises.filter(devise =>
    devise.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devise.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (devise: Devise) => {
    setSelectedDevise(devise);
    setFormData({
      code: devise.code,
      nom: devise.nom,
      symbole: devise.symbole,
      pays: devise.pays,
      statut: devise.statut
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevise) return;

    toast({
      title: "Devise mise à jour",
      description: `Les informations de la devise ${formData.code} ont été mises à jour.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mise à Jour des Devises</h1>
        <p className="text-muted-foreground">Modifier les informations des devises existantes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Sélectionner une Devise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Rechercher par code ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredDevises.map((devise) => (
                  <div
                    key={devise.id}
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      selectedDevise?.id === devise.id 
                        ? 'border-guinea-red bg-guinea-red/5' 
                        : 'border-border hover:bg-muted'
                    }`}
                    onClick={() => handleSelect(devise)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{devise.code} - {devise.nom}</div>
                        <div className="text-sm text-muted-foreground">
                          {devise.symbole} • {devise.pays}
                        </div>
                      </div>
                      <Badge variant={devise.statut === 'Actif' ? 'default' : 'secondary'}>
                        {devise.statut}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Modifier la Devise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDevise ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Code Devise *</Label>
                    <Input
                      id="code"
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
                  <Button type="button" variant="outline" onClick={() => setSelectedDevise(null)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Mettre à Jour
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Sélectionnez une devise à modifier
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};