import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileText, Calendar, DollarSign, Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContributions, type Contribution } from '@/hooks/useContributions';

export const ContributionsManagement = () => {
  const { contributions, taux, totaux, exercice, loading, error } = useContributions();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Affichage d'un message d'erreur si nécessaire
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const filteredContributions = contributions.filter(contrib =>
    contrib.organisations?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrib.organisations?.sigle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSituationBadge = (situation: string) => {
    switch (situation) {
      case 'paye':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Payé</Badge>;
      case 'paye-partiellement':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Payé partiellement</Badge>;
      case 'a-payer':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">À payer</Badge>;
      default:
        return <Badge variant="secondary">{situation}</Badge>;
    }
  };

  // Taux de change fixe USD vers GNF (exemple: 1 USD = 8600 GNF)
  const tauxChangeGNF = 8600;

  const formatAmount = (amount: number, devise: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: devise,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatAmountGNF = (amount: number, deviseOriginale: string) => {
    let montantGNF = amount;
    if (deviseOriginale === 'USD') {
      montantGNF = amount * tauxChangeGNF;
    } else if (deviseOriginale === 'EUR') {
      montantGNF = amount * (tauxChangeGNF * 1.1); // Approximation EUR/GNF
    }
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(montantGNF);
  };

  // Calculs pour les totaux - on utilise directement les totaux de l'API
  // Les totaux sont déjà calculés côté serveur pour une meilleure performance

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des contributions...</span>
        </div>
      )}
      
      {!loading && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contributions Annuelles</h1>
              <p className="text-muted-foreground">
                Suivi des contributions financières aux organisations internationales
                {exercice && ` - Exercice ${exercice.libelle}`}
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Contribution
            </Button>
          </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une contribution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Résumé des totaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Contribution Année Courante</p>
              <p className="text-lg font-bold text-primary">{formatAmountGNF(totaux.total_attendu, 'GNF')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Arriérés</p>
              <p className="text-lg font-bold text-orange-600">{formatAmountGNF(totaux.total_arrieres, 'GNF')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Général</p>
              <p className="text-lg font-bold text-foreground">{formatAmountGNF(totaux.total_global, 'GNF')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Montant Payé</p>
              <p className="text-lg font-bold text-green-600">{formatAmountGNF(totaux.total_paye, 'GNF')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Solde Restant</p>
              <p className="text-lg font-bold text-red-600">{formatAmountGNF(totaux.solde_restant, 'GNF')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Contributions</CardTitle>
          <CardDescription>
            Aperçu de toutes les contributions pour l'année en cours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead rowSpan={2} className="text-center align-middle">
                  <strong>ORGANISATION</strong>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle">
                  <strong>ARRIERE</strong>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle">
                  <strong>CONTRIBUTION</strong>
                </TableHead>
                <TableHead colSpan={2} className="text-center">
                  <strong>MONTANT TOTAL DU</strong>
                </TableHead>
                <TableHead colSpan={2} className="text-center align-middle">
                  <strong>PAYE</strong>
                </TableHead>
                <TableHead colSpan={2} className="text-center align-middle">
                  <strong>RESTE DEVOIR</strong>
                </TableHead>
                <TableHead rowSpan={2} className="text-center align-middle">
                  <strong>ACTIONS</strong>
                </TableHead>
              </TableRow>
              <TableRow className="bg-primary/10">
                <TableHead className="text-center">
                  <strong>Devise</strong>
                </TableHead>
                <TableHead className="text-center">
                  <strong>Equivalent</strong>
                </TableHead>
                <TableHead className="text-center">
                  <strong>Devise</strong>
                </TableHead>
                <TableHead className="text-center">
                  <strong>Equivalent</strong>
                </TableHead>
                <TableHead className="text-center">
                  <strong>Devise</strong>
                </TableHead>
                <TableHead className="text-center">
                  <strong>Equivalent</strong>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContributions.map((contrib) => {
                const totalDu = contrib.montant_attendu + contrib.montant_arrieres;
                const solde = totalDu - contrib.montant_paye;
                
                return (
                  <TableRow key={contrib.id}>
                    <TableCell className="text-center">
                      <div>
                        <div className="font-medium">{contrib.organisations?.sigle}</div>
                        <div className="text-sm text-muted-foreground">{contrib.organisations?.nom}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmount(contrib.montant_arrieres, contrib.devise)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmount(contrib.montant_attendu, contrib.devise)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmount(totalDu, contrib.devise)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmountGNF(totalDu, contrib.devise)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmount(contrib.montant_paye, contrib.devise)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmountGNF(contrib.montant_paye, contrib.devise)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmount(solde, contrib.devise)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmountGNF(solde, contrib.devise)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex space-x-1 justify-center">
                        <Button variant="ghost" size="sm" title="Voir courrier électronique">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
};