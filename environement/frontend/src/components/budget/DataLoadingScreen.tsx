
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface DataLoadingItem {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  progress: number;
  lastUpdate?: string;
}

export const DataLoadingScreen = () => {
  const { toast } = useToast();
  const [loadingItems, setLoadingItems] = useState<DataLoadingItem[]>([
    {
      id: 'subventions',
      label: 'Subventions de l\'État',
      status: 'pending',
      progress: 0,
      lastUpdate: '2024-01-15'
    },
    {
      id: 'transferts',
      label: 'Transferts budgétaires',
      status: 'pending',
      progress: 0,
      lastUpdate: '2024-01-10'
    },
    {
      id: 'dotations',
      label: 'Dotations spéciales',
      status: 'pending',
      progress: 0,
      lastUpdate: '2024-01-08'
    }
  ]);

  const [globalProgress, setGlobalProgress] = useState(0);

  const startDataLoading = async () => {
    for (let i = 0; i < loadingItems.length; i++) {
      setLoadingItems(prev => 
        prev.map((item, index) => 
          index === i ? { ...item, status: 'loading', progress: 0 } : item
        )
      );

      // Simuler le chargement avec progression
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setLoadingItems(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, progress } : item
          )
        );
      }

      // Marquer comme terminé
      setLoadingItems(prev => 
        prev.map((item, index) => 
          index === i ? { 
            ...item, 
            status: 'success', 
            progress: 100,
            lastUpdate: new Date().toLocaleDateString('fr-FR')
          } : item
        )
      );

      setGlobalProgress(((i + 1) / loadingItems.length) * 100);
    }

    toast({
      title: "Chargement terminé",
      description: "Toutes les données ont été récupérées avec succès.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Chargement des Données de l'État</h1>
        <p className="text-muted-foreground">
          Récupération des subventions et transferts depuis l'application chaîne dépense
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Synchronisation des données</span>
            <Button onClick={startDataLoading} disabled={globalProgress > 0 && globalProgress < 100}>
              <Download className="h-4 w-4 mr-2" />
              Démarrer la synchronisation
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {globalProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression globale</span>
                <span>{Math.round(globalProgress)}%</span>
              </div>
              <Progress value={globalProgress} className="w-full" />
            </div>
          )}

          <div className="space-y-4">
            {loadingItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className={`text-sm ${getStatusColor(item.status)}`}>
                    {item.status === 'pending' && 'En attente'}
                    {item.status === 'loading' && 'Chargement...'}
                    {item.status === 'success' && 'Terminé'}
                    {item.status === 'error' && 'Erreur'}
                  </span>
                </div>
                
                {item.status === 'loading' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="w-full" />
                  </div>
                )}

                {item.lastUpdate && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Dernière mise à jour : {item.lastUpdate}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
