import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileText, Calendar, DollarSign, Download } from 'lucide-react';

interface Paiement {
  id: string;
  organisation: string;
  sigle: string;
  montant: number;
  devise: string;
  datePaiement: string;
  referenceChaineDepense: string;
  statut: 'valide' | 'en-attente' | 'rejete';
}

const mockPaiements: Paiement[] = [
  {
    id: '1',
    organisation: 'CEDEAO',
    sigle: 'CEDEAO',
    montant: 25000,
    devise: 'USD',
    datePaiement: '2024-03-15',
    referenceChaineDepense: 'CD-2024-001',
    statut: 'valide'
  },
  {
    id: '2',
    organisation: 'Organisation des Nations Unies',
    sigle: 'ONU',
    montant: 75000,
    devise: 'USD',
    datePaiement: '2024-06-20',
    referenceChaineDepense: 'CD-2024-002',
    statut: 'valide'
  },
  {
    id: '3',
    organisation: 'Union Africaine',
    sigle: 'UA',
    montant: 15000,
    devise: 'USD',
    datePaiement: '2024-07-10',
    referenceChaineDepense: 'CD-2024-003',
    statut: 'en-attente'
  }
];

export const PaiementsManagement = () => {
  const [paiements] = useState<Paiement[]>(mockPaiements);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPaiements = paiements.filter(paiement =>
    paiement.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.referenceChaineDepense.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'valide':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Validé</Badge>;
      case 'en-attente':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En attente</Badge>;
      case 'rejete':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const formatAmount = (amount: number, devise: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise,
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paiements</h1>
          <p className="text-muted-foreground">
            Suivi des paiements réalisés via la Chaîne Dépense
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Enregistrer un Paiement
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un paiement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Paiements</CardTitle>
          <CardDescription>
            Liste de tous les paiements enregistrés dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organisation</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date Paiement</TableHead>
                <TableHead>Référence Chaîne Dépense</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaiements.map((paiement) => (
                <TableRow key={paiement.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{paiement.sigle}</div>
                      <div className="text-sm text-muted-foreground">{paiement.organisation}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatAmount(paiement.montant, paiement.devise)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {paiement.referenceChaineDepense}
                    </code>
                  </TableCell>
                  <TableCell>
                    {getStatutBadge(paiement.statut)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Justificatif
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