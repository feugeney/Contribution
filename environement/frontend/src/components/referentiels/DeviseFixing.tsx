import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Calendar as CalendarIcon, Save, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface TauxChange {
  id: string;
  deviseSource: string;
  deviseCible: string;
  taux: number;
  date: Date;
  source: string;
  statut: 'Actif' | 'Archivé';
}

const mockTaux: TauxChange[] = [
  { id: '1', deviseSource: 'USD', deviseCible: 'GNF', taux: 8600, date: new Date(), source: 'BCRG', statut: 'Actif' },
  { id: '2', deviseSource: 'EUR', deviseCible: 'GNF', taux: 9200, date: new Date(), source: 'BCRG', statut: 'Actif' },
  { id: '3', deviseSource: 'USD', deviseCible: 'EUR', taux: 0.85, date: new Date(), source: 'BCE', statut: 'Actif' }
];

export const DeviseFixing = () => {
  const { toast } = useToast();
  const [taux, setTaux] = useState<TauxChange[]>(mockTaux);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    deviseSource: '',
    deviseCible: '',
    taux: '',
    source: ''
  });

  const devises = ['USD', 'EUR', 'GNF', 'XOF', 'CHF', 'GBP'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTaux: TauxChange = {
      id: Date.now().toString(),
      deviseSource: formData.deviseSource,
      deviseCible: formData.deviseCible,
      taux: parseFloat(formData.taux),
      date: selectedDate,
      source: formData.source,
      statut: 'Actif'
    };

    setTaux([newTaux, ...taux]);
    toast({
      title: "Taux de change fixé",
      description: `Taux ${formData.deviseSource}/${formData.deviseCible} : ${formData.taux}`,
    });

    setFormData({
      deviseSource: '',
      deviseCible: '',
      taux: '',
      source: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fixing des Devises</h1>
        <p className="text-muted-foreground">Fixer les taux de change officiels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Nouveau Taux de Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deviseSource">Devise Source *</Label>
                  <Select value={formData.deviseSource} onValueChange={(value) => setFormData({...formData, deviseSource: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {devises.map(devise => (
                        <SelectItem key={devise} value={devise}>{devise}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deviseCible">Devise Cible *</Label>
                  <Select value={formData.deviseCible} onValueChange={(value) => setFormData({...formData, deviseCible: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {devises.filter(d => d !== formData.deviseSource).map(devise => (
                        <SelectItem key={devise} value={devise}>{devise}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="taux">Taux de Change *</Label>
                <Input
                  id="taux"
                  type="number"
                  step="0.0001"
                  placeholder="Ex: 8600.5"
                  value={formData.taux}
                  onChange={(e) => setFormData({...formData, taux: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>Date du Fixing *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="source">Source *</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la source..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BCRG">Banque Centrale de Guinée</SelectItem>
                    <SelectItem value="BCE">Banque Centrale Européenne</SelectItem>
                    <SelectItem value="FED">Réserve Fédérale US</SelectItem>
                    <SelectItem value="MANUAL">Saisie Manuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Fixer le Taux
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Taux Actuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paire</TableHead>
                    <TableHead>Taux</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taux.slice(0, 5).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">
                        {t.deviseSource}/{t.deviseCible}
                      </TableCell>
                      <TableCell>{t.taux.toLocaleString()}</TableCell>
                      <TableCell>
                        {format(t.date, "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={t.statut === 'Actif' ? 'default' : 'secondary'}>
                          {t.statut}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};