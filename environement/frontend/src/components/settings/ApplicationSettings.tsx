
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export const ApplicationSettings = () => {
  const [settings, setSettings] = useState({
    appName: 'EPAC-001 Budget Management',
    appVersion: '1.0.0',
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    sessionTimeout: 30,
    maxFileSize: 10,
    currency: 'GNF',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: '01/01',
  });

  const { toast } = useToast();

  const handleSave = () => {
    console.log('Paramètres sauvegardés:', settings);
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de l'application ont été mis à jour.",
    });
  };

  const handleReset = () => {
    setSettings({
      appName: 'EPAC-001 Budget Management',
      appVersion: '1.0.0',
      maintenanceMode: false,
      emailNotifications: true,
      autoBackup: true,
      sessionTimeout: 30,
      maxFileSize: 10,
      currency: 'GNF',
      dateFormat: 'DD/MM/YYYY',
      fiscalYearStart: '01/01',
    });
    toast({
      title: "Paramètres réinitialisés",
      description: "Les paramètres ont été remis aux valeurs par défaut.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres de l'Application</h1>
        <p className="text-muted-foreground">Configuration générale du système</p>
      </div>

      <div className="grid gap-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appName">Nom de l'application</Label>
                <Input
                  id="appName"
                  value={settings.appName}
                  onChange={(e) => setSettings({...settings, appName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appVersion">Version</Label>
                <Input
                  id="appVersion"
                  value={settings.appVersion}
                  onChange={(e) => setSettings({...settings, appVersion: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres système */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres système</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode maintenance</Label>
                <p className="text-sm text-muted-foreground">
                  Activer le mode maintenance pour bloquer l'accès aux utilisateurs
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Envoyer des notifications par email pour les actions importantes
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sauvegarde automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Effectuer des sauvegardes automatiques quotidiennes
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout session (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Taille max fichier (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de l'application */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres métier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Format de date</Label>
                <Input
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiscalYearStart">Début année fiscale</Label>
                <Input
                  id="fiscalYearStart"
                  value={settings.fiscalYearStart}
                  onChange={(e) => setSettings({...settings, fiscalYearStart: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>
              <Button onClick={handleSave}>
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
