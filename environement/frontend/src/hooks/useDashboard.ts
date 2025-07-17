import { useState, useEffect } from 'react';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '@/config/api';

interface DashboardStats {
  credit_actuel: number;
  credit_disponible: number;
  contributions_demandees: number;
  contributions_engagees: number;
  contributions_payees: number;
  taux_engagement: number;
  taux_paiement: number;
}

interface Contribution {
  id: number;
  organisation: string;
  contribution: number;
  arriere: number;
  paye: number;
  devise: string;
  total: number;
}

interface Engagement {
  id: number;
  organisation: string;
  montant_engage: number;
  devise: string;
  date_engagement: string | null;
}

interface TauxChange {
  devise: string;
  taux: number;
}

interface Institution {
  id: number;
  nom: string;
}

interface Exercice {
  id: number;
  nom: string;
  statut: string;
}

interface DashboardData {
  exercice: Exercice;
  statistiques: DashboardStats;
  contributions: Contribution[];
  engagements: Engagement[];
  taux_change: TauxChange[];
  institutions: Institution[];
}

interface ApiResponse {
  success: boolean;
  data: DashboardData;
  message: string;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = buildApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD);
      const headers = getAuthHeaders();
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé. Veuillez vous connecter.');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors du chargement du dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const refresh = () => {
    fetchDashboard();
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
};
