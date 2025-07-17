
import { useState } from 'react';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockBudgetLines } from '@/data/mockData';

export const BudgetOverview = () => {
  const [budgetLines] = useState(mockBudgetLines);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getNatureLabel = (nature: string) => {
    const labels = {
      'traitement_salaire': 'Traitements et salaires',
      'biens_services': 'Biens et services',
      'investissements': 'Investissements'
    };
    return labels[nature as keyof typeof labels] || nature;
  };

  const getNatureBadgeColor = (nature: string) => {
    const colors = {
      'traitement_salaire': 'bg-blue-100 text-blue-800',
      'biens_services': 'bg-green-100 text-green-800',
      'investissements': 'bg-purple-100 text-purple-800'
    };
    return colors[nature as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const totalBudget = budgetLines.reduce((sum, line) => sum + line.montant_prevu, 0);
  const totalEngaged = budgetLines.reduce((sum, line) => sum + line.montant_engage, 0);
  const totalPaid = budgetLines.reduce((sum, line) => sum + line.montant_paye, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion du Budget</h1>
          <p className="text-muted-foreground">
            Budget 2024 - EPAC-001
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="space-x-2">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
          <Button className="space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouvelle ligne budgétaire</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dotation budgétaire 2024
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engagements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEngaged)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalEngaged / totalBudget) * 100).toFixed(1)}% du budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalPaid / totalBudget) * 100).toFixed(1)}% d'exécution
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lignes Budgétaires par Nature Économique</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nature Économique</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead className="text-right">Montant Prévu</TableHead>
                <TableHead className="text-right">Engagé</TableHead>
                <TableHead className="text-right">Liquidé</TableHead>
                <TableHead className="text-right">Ordonnancé</TableHead>
                <TableHead className="text-right">Payé</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetLines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>
                    <Badge className={getNatureBadgeColor(line.nature)}>
                      {getNatureLabel(line.nature)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{line.libelle}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(line.montant_prevu)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(line.montant_engage)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(line.montant_liquide)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(line.montant_ordonnance)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(line.montant_paye)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
