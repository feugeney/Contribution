import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, DollarSign, Calendar, Building2, FileText } from 'lucide-react';

interface Arriere {
  id: string;
  organisation: string;
  sigle: string;
  annee: number;
  montantDu: number;
  devise: string;
  ministereTutelle: string;
  nombreMoisRetard: number;
  priorite: 'haute' | 'moyenne' | 'basse';
}

const mockArrieres: Arriere[] = [
  {
    id: '1',
    organisation: 'Union Africaine',
    sigle: 'UA',
    annee: 2024,
    montantDu: 50000,
    devise: 'USD',
    ministereTutelle: 'Ministère des Affaires Étrangères',
    nombreMoisRetard: 6,
    priorite: 'haute'
  },
  {
    id: '2',
    organisation: 'Organisation Mondiale de la Santé',
    sigle: 'OMS',
    annee: 2023,
    montantDu: 35000,
    devise: 'USD',
    ministereTutelle: 'Ministère de la Santé',
    nombreMoisRetard: 12,
    priorite: 'haute'
  },
  {
    id: '3',
    organisation: 'UNESCO',
    sigle: 'UNESCO',
    annee: 2024,
    montantDu: 15000,
    devise: 'USD',
    ministereTutelle: 'Ministère de l\'Éducation',
    nombreMoisRetard: 3,
    priorite: 'moyenne'
  }
];

export const ArrieresSuivi = () => {
  const [arrieres] = useState<Arriere[]>(mockArrieres);

  const getPrioriteBadge = (priorite: string) => {
    switch (priorite) {
      case 'haute':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Haute</Badge>;
      case 'moyenne':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Moyenne</Badge>;
      case 'basse':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Basse</Badge>;
      default:
        return <Badge variant="secondary">{priorite}</Badge>;
    }
  };

  const formatAmount = (amount: number, devise: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalArrieres = arrieres.reduce((sum, arriere) => sum + arriere.montantDu, 0);
  const arrieresUrgents = arrieres.filter(a => a.priorite === 'haute').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suivi des Arriérés</h1>
          <p className="text-muted-foreground">
            Calcul automatique des montants impayés par organisation
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Arriérés</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(totalArrieres, 'USD')}</div>
            <p className="text-xs text-muted-foreground">
              Montant total des contributions impayées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arriérés Urgents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{arrieresUrgents}</div>
            <p className="text-xs text-muted-foreground">
              Organisations avec priorité haute
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organisations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{arrieres.length}</div>
            <p className="text-xs text-muted-foreground">
              Avec des arriérés de paiement
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détail des Arriérés</CardTitle>
          <CardDescription>
            Liste détaillée des contributions en retard de paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organisation</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Montant Dû</TableHead>
                <TableHead>Ministère Tutelle</TableHead>
                <TableHead>Retard (mois)</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arrieres.map((arriere) => (
                <TableRow key={arriere.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{arriere.sigle}</div>
                      <div className="text-sm text-muted-foreground">{arriere.organisation}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {arriere.annee}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center font-medium text-red-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatAmount(arriere.montantDu, arriere.devise)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{arriere.ministereTutelle}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                      <span className="font-medium">{arriere.nombreMoisRetard} mois</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPrioriteBadge(arriere.priorite)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Planifier Paiement
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