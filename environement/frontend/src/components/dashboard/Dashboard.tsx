import { Building2, DollarSign, CreditCard, AlertTriangle, TrendingUp, PieChart, BarChart3, RefreshCw } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';

export const Dashboard = () => {
  const { data, loading, error, refresh } = useDashboard();

  const formatCurrency = (amount: number, currency: string = 'GNF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ` ${currency}`;
  };

  const convertToGNF = (amount: number, originalCurrency: string, tauxChange: any[]) => {
    const taux = tauxChange.find(t => t.devise === originalCurrency);
    if (taux && originalCurrency !== 'GNF') {
      return amount * taux.taux;
    }
    return amount;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Erreur de chargement</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={refresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  const { statistiques, contributions, engagements, taux_change, exercice } = data;

  // Grouper les contributions par organisation (approximation des ministères)
  const contributionsParOrganisation = contributions.slice(0, 4).map(contrib => ({
    organisation: contrib.organisation,
    montant: convertToGNF(contrib.total, contrib.devise, taux_change),
    paye: convertToGNF(contrib.paye, contrib.devise, taux_change)
  }));

  // Créer des données mensuelles simulées basées sur les vrais totaux
  const totalPayeGNF = convertToGNF(statistiques.contributions_payees, 'GNF', taux_change);
  const evolutionPaiements = [
    { mois: 'Jan', paiements: totalPayeGNF * 0.12 },
    { mois: 'Fév', paiements: totalPayeGNF * 0.15 },
    { mois: 'Mar', paiements: totalPayeGNF * 0.14 },
    { mois: 'Avr', paiements: totalPayeGNF * 0.18 },
    { mois: 'Mai', paiements: totalPayeGNF * 0.20 },
    { mois: 'Jun', paiements: totalPayeGNF * 0.21 }
  ];

  // Grouper les contributions par devise
  const contributionsParDevise = contributions.reduce((acc, contrib) => {
    const devise = contrib.devise;
    if (!acc[devise]) {
      acc[devise] = 0;
    }
    acc[devise] += contrib.total;
    return acc;
  }, {} as Record<string, number>);

  const repartitionDevises = Object.entries(contributionsParDevise).map(([devise, montant], index) => ({
    devise: `${devise} (GNF)`,
    montant: convertToGNF(montant, devise, taux_change),
    color: ['#dc2626', '#ca8a04', '#16a34a', '#2563eb'][index % 4]
  }));

  const COLORS = ['#dc2626', '#ca8a04', '#16a34a', '#2563eb'];

  // Calculs des statistiques
  const totalBudgetAlloue = statistiques.credit_actuel;
  const totalContributionsAttendu = statistiques.contributions_demandees;
  const totalPaye = statistiques.contributions_payees;
  const tauxExecution = statistiques.taux_paiement;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des contributions aux organisations internationales - Exercice {exercice.nom}
        </p>
        <Button 
          onClick={refresh} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Budget Alloué"
          value={formatCurrency(totalBudgetAlloue)}
          change={`Exercice ${exercice.nom}`}
          changeType="neutral"
          icon={DollarSign}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        
        <StatsCard
          title="Contributions Demandées"
          value={formatCurrency(totalContributionsAttendu)}
          change={`${contributions.length} organisations`}
          changeType="neutral"
          icon={Building2}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
        
        <StatsCard
          title="Montant Payé"
          value={formatCurrency(totalPaye)}
          change={`${tauxExecution.toFixed(1)}% d'exécution`}
          changeType={tauxExecution > 70 ? "positive" : "negative"}
          icon={CreditCard}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
        />
        
        <StatsCard
          title="Crédit Disponible"
          value={formatCurrency(statistiques.credit_disponible)}
          change={`Taux engagement: ${statistiques.taux_engagement.toFixed(1)}%`}
          changeType={statistiques.taux_engagement > 50 ? "positive" : "negative"}
          icon={AlertTriangle}
          className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Exécution par Organisation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contributionsParOrganisation.map((item, index) => {
              const executionPercentage = item.montant > 0 ? (item.paye / item.montant) * 100 : 0;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.organisation}</span>
                    <span className="text-muted-foreground">
                      {executionPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={executionPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Payé: {formatCurrency(item.paye)}</span>
                    <span>Attendu: {formatCurrency(item.montant)}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Évolution des Paiements ({exercice.nom})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={evolutionPaiements}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Paiements']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="paiements" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Répartition par Devise</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={repartitionDevises}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ devise, percent }) => `${devise} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="montant"
                >
                  {repartitionDevises.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Montant']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {repartitionDevises.map((item, index) => (
                <div key={item.devise} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm font-medium">{item.devise}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(item.montant)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Statistiques Clés</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{contributions.length}</div>
                <div className="text-sm text-blue-800">Organisations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{repartitionDevises.length}</div>
                <div className="text-sm text-green-800">Devises</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Taux d'engagement</span>
                <span className="text-sm font-medium">{statistiques.taux_engagement.toFixed(1)}%</span>
              </div>
              <Progress value={statistiques.taux_engagement} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Taux de paiement</span>
                <span className="text-sm font-medium">{statistiques.taux_paiement.toFixed(1)}%</span>
              </div>
              <Progress value={statistiques.taux_paiement} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {formatCurrency(totalContributionsAttendu - totalPaye)}
                </div>
                <div className="text-sm text-muted-foreground">Reste à payer</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};