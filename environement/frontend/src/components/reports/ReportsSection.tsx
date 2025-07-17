
import { useState } from 'react';
import { Download, Calendar, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const ReportsSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [reportType, setReportType] = useState('execution');

  const reports = [
    {
      id: 'execution',
      title: 'Rapport d\'Exécution Budgétaire',
      description: 'État détaillé des engagements, liquidations et paiements',
      icon: BarChart3,
      lastGenerated: '2024-06-30',
      status: 'Disponible'
    },
    {
      id: 'retenues',
      title: 'Rapport des Retenues Fiscales',
      description: 'Suivi des retenues TVA, ARMP et précomptes',
      icon: FileText,
      lastGenerated: '2024-06-30',
      status: 'Disponible'
    },
    {
      id: 'mensuel',
      title: 'Rapport Mensuel',
      description: 'Synthèse mensuelle des opérations budgétaires',
      icon: Calendar,
      lastGenerated: '2024-06-30',
      status: 'En attente'
    },
    {
      id: 'trimestriel',
      title: 'Rapport Trimestriel',
      description: 'Bilan trimestriel et analyse des tendances',
      icon: BarChart3,
      lastGenerated: '2024-03-31',
      status: 'Disponible'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rapports Financiers</h1>
        <p className="text-muted-foreground">
          Génération et consultation des rapports réglementaires
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de Génération</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Période</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">Année 2024</SelectItem>
                  <SelectItem value="2024-q2">2ème Trimestre 2024</SelectItem>
                  <SelectItem value="2024-06">Juin 2024</SelectItem>
                  <SelectItem value="2024-05">Mai 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Type de rapport</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="execution">Exécution budgétaire</SelectItem>
                  <SelectItem value="retenues">Retenues fiscales</SelectItem>
                  <SelectItem value="synthese">Synthèse financière</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Générer le rapport
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span>{report.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {report.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Dernière génération</p>
                    <p className="text-sm font-medium">
                      {new Date(report.lastGenerated).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Statut</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      report.status === 'Disponible' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Consulter
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Rapports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Rapport Mensuel - Juin 2024', date: '2024-07-01', format: 'PDF', size: '2.4 MB' },
              { name: 'Rapport Trimestriel Q2 2024', date: '2024-07-01', format: 'Excel', size: '1.8 MB' },
              { name: 'Retenues Fiscales - Juin 2024', date: '2024-07-01', format: 'PDF', size: '980 KB' },
              { name: 'Rapport Mensuel - Mai 2024', date: '2024-06-01', format: 'PDF', size: '2.2 MB' },
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Généré le {new Date(file.date).toLocaleDateString('fr-FR')} • {file.format} • {file.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
