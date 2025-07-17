import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, DollarSign, Calendar, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetAlloue {
  id: string;
  annee: number;
  montant: number;
  devise: string;
  ministere: string;
  description: string;
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
}

const mockBudgets: BudgetAlloue[] = [
  {
    id: '1',
    annee: 2024,
    montant: 50000000000,
    devise: 'GNF',
    ministere: 'Ministère des Affaires Étrangères',
    description: 'Budget alloué pour les contributions aux organisations internationales',
    statut: 'Actif',
    dateCreation: '2024-01-01'
  },
  {
    id: '2',
    annee: 2023,
    montant: 45000000000,
    devise: 'GNF',
    ministere: 'Ministère de l\'Économie et des Finances',
    description: 'Budget pour les contributions financières internationales',
    statut: 'Inactif',
    dateCreation: '2023-01-01'
  }
];

export const BudgetAlloueManagement = () => {
  const [budgets, setBudgets] = useState<BudgetAlloue[]>(mockBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetAlloue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    annee: new Date().getFullYear(),
    montant: 0,
    devise: 'GNF',
    ministere: '',
    description: '',
    statut: 'Actif' as 'Actif' | 'Inactif'
  });

  const filteredBudgets = budgets.filter(budget =>
    budget.ministere.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.annee.toString().includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBudget) {
      setBudgets(budgets.map(b => 
        b.id === editingBudget.id 
          ? { ...editingBudget, ...formData }
          : b
      ));
      toast({
        title: "Budget modifié",
        description: "Les informations ont été mises à jour avec succès.",
      });
    } else {
      const newBudget: BudgetAlloue = {
        id: Date.now().toString(),
        ...formData,
        dateCreation: new Date().toISOString().split('T')[0]
      };
      setBudgets([...budgets, newBudget]);
      toast({
        title: "Budget créé",
        description: "Le nouveau budget a été ajouté avec succès.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      annee: new Date().getFullYear(),
      montant: 0,
      devise: 'GNF',
      ministere: '',
      description: '',
      statut: 'Actif'
    });
    setEditingBudget(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (budget: BudgetAlloue) => {
    setEditingBudget(budget);
    setFormData({
      annee: budget.annee,
      montant: budget.montant,
      devise: budget.devise,
      ministere: budget.ministere,
      description: budget.description,
      statut: budget.statut
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
    toast({
      title: "Budget supprimé",
      description: "Le budget a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'GNF' ? 'GNF' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion du Budget Alloué</h1>
          <p className="text-muted-foreground">Gérez les budgets alloués pour les contributions internationales</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBudget(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Modifier le Budget' : 'Créer un Nouveau Budget'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="annee">Année *</Label>
                  <Input
                    id="annee"
                    type="number"
                    value={formData.annee}
                    onChange={(e) => setFormData({...formData, annee: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="devise">Devise *</Label>
                  <Select value={formData.devise} onValueChange={(value) => setFormData({...formData, devise: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GNF">GNF - Franc Guinéen</SelectItem>
                      <SelectItem value="USD">USD - Dollar Américain</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="montant">Montant *</Label>
                  <Input
                    id="montant"
                    type="number"
                    value={formData.montant}
                    onChange={(e) => setFormData({...formData, montant: parseFloat(e.target.value)})}
                    required
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

              <div>
                <Label htmlFor="ministere">Ministère de Tutelle *</Label>
                <Input
                  id="ministere"
                  value={formData.ministere}
                  onChange={(e) => setFormData({...formData, ministere: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingBudget ? 'Modifier' : 'Créer'}
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
            placeholder="Rechercher par ministère ou année..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budgets Alloués</CardTitle>
          <CardDescription>
            Liste des budgets alloués pour les contributions internationales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Année</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Ministère</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {budget.annee}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatAmount(budget.montant, budget.devise)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{budget.ministere}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {budget.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={budget.statut === 'Actif' ? 'default' : 'secondary'}>
                      {budget.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(budget)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
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

      {filteredBudgets.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Aucun budget trouvé</p>
        </div>
      )}
    </div>
  );
};