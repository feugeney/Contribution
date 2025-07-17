
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Monitor, LogOut } from 'lucide-react';

interface Session {
  id: string;
  user: string;
  role: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  device: string;
  status: 'active' | 'terminated';
}

const mockSessions: Session[] = [
  {
    id: '1',
    user: 'Jean Camara',
    role: 'Ordonnateur',
    loginTime: '2024-06-13 09:15:30',
    logoutTime: '2024-06-13 17:45:20',
    ipAddress: '192.168.1.101',
    device: 'Windows 11 - Chrome',
    status: 'terminated'
  },
  {
    id: '2',
    user: 'Mariama Diallo',
    role: 'Contrôleur Financier',
    loginTime: '2024-06-13 08:30:15',
    ipAddress: '192.168.1.102',
    device: 'MacOS - Safari',
    status: 'active'
  },
  {
    id: '3',
    user: 'Ibrahim Conde',
    role: 'Comptable',
    loginTime: '2024-06-13 10:20:45',
    logoutTime: '2024-06-13 16:30:10',
    ipAddress: '192.168.1.103',
    device: 'Ubuntu - Firefox',
    status: 'terminated'
  },
  {
    id: '4',
    user: 'Fatou Bah',
    role: 'Gestionnaire Budget',
    loginTime: '2024-06-12 14:15:00',
    logoutTime: '2024-06-12 18:45:30',
    ipAddress: '192.168.1.104',
    device: 'Windows 10 - Edge',
    status: 'terminated'
  }
];

export const SessionsManagement = () => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionDuration = (loginTime: string, logoutTime?: string) => {
    const login = new Date(loginTime);
    const logout = logoutTime ? new Date(logoutTime) : new Date();
    const duration = logout.getTime() - login.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Historique des Sessions</h1>
        <p className="text-muted-foreground">
          Suivi des connexions et activités des utilisateurs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Sessions Récentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{session.user}</span>
                    <Badge variant="outline">{session.role}</Badge>
                    <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                      {session.status === 'active' ? 'Actif' : 'Terminé'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Durée: {getSessionDuration(session.loginTime, session.logoutTime)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Connexion:</span>
                    <span>{formatDateTime(session.loginTime)}</span>
                  </div>
                  
                  {session.logoutTime && (
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span className="text-gray-600">Déconnexion:</span>
                      <span>{formatDateTime(session.logoutTime)}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Appareil:</span>
                    <span>{session.device}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Adresse IP: {session.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
