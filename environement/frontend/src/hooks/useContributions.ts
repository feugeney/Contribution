import { useState, useEffect } from 'react';
import { buildApiUrl, getAuthHeaders } from '@/lib/api';

export interface Contribution {
  id: string;
  organisation_id: string;
  annee: number;
  montant_attendu: number;
  montant_paye: number;
  montant_arrieres: number;
  devise: string;
  situation: 'a-payer' | 'paye-partiellement' | 'paye';
  date_echeance: string | null;
  organisations: {
    nom: string;
    sigle: string;
  };
}

export interface Taux {
  devise: string;
  taux: number;
}

export interface Totaux {
  total_attendu: number;
  total_arrieres: number;
  total_global: number;
  total_paye: number;
  solde_restant: number;
}

export interface Exercice {
  id: string;
  libelle: string;
  statut: string;
}

export interface ContributionsResponse {
  success: boolean;
  data: {
    contributions: Contribution[];
    taux: Taux[];
    totaux: Totaux;
    exercice: Exercice | null;
  };
  message?: string;
}

export const useContributions = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [taux, setTaux] = useState<Taux[]>([]);
  const [totaux, setTotaux] = useState<Totaux>({
    total_attendu: 0,
    total_arrieres: 0,
    total_global: 0,
    total_paye: 0,
    solde_restant: 0
  });
  const [exercice, setExercice] = useState<Exercice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async (role: string = 'admin', service?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Utilisation temporaire de l'API de test pour déboguer
      let url = buildApiUrl('/contributions/test/');
      
      console.log('Fetching contributions from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: ContributionsResponse = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        setContributions(data.data.contributions);
        setTaux(data.data.taux);
        setTotaux(data.data.totaux);
        setExercice(data.data.exercice);
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des données');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des contributions:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createContribution = async (contributionData: Partial<Contribution>) => {
    try {
      // Pour l'instant, simulation d'une création
      // En production, il faudrait implémenter l'endpoint POST
      const newContribution: Contribution = {
        id: Date.now().toString(),
        organisation_id: contributionData.organisation_id || '',
        annee: contributionData.annee || new Date().getFullYear(),
        montant_attendu: contributionData.montant_attendu || 0,
        montant_paye: contributionData.montant_paye || 0,
        montant_arrieres: contributionData.montant_arrieres || 0,
        devise: contributionData.devise || 'USD',
        situation: contributionData.situation || 'a-payer',
        date_echeance: contributionData.date_echeance || null,
        organisations: contributionData.organisations || { nom: '', sigle: '' }
      };
      
      setContributions(prev => [...prev, newContribution]);
      return newContribution;
    } catch (error) {
      console.error('Erreur lors de la création de la contribution:', error);
      throw error;
    }
  };

  const updateContribution = async (id: string, contributionData: Partial<Contribution>) => {
    try {
      // Pour l'instant, simulation d'une mise à jour
      // En production, il faudrait implémenter l'endpoint PUT/PATCH
      setContributions(prev => 
        prev.map(contrib => 
          contrib.id === id 
            ? { ...contrib, ...contributionData }
            : contrib
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la contribution:', error);
      throw error;
    }
  };

  const deleteContribution = async (id: string) => {
    try {
      // Pour l'instant, simulation d'une suppression
      // En production, il faudrait implémenter l'endpoint DELETE
      setContributions(prev => prev.filter(contrib => contrib.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la contribution:', error);
      throw error;
    }
  };

  return {
    contributions,
    taux,
    totaux,
    exercice,
    loading,
    error,
    fetchContributions,
    createContribution,
    updateContribution,
    deleteContribution
  };
};
