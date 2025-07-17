import { useState, useEffect } from 'react';
import { buildApiUrl, getAuthHeaders } from '@/lib/api';

export interface Tutelle {
  cd_tutelle: string;
  libelle: string;
  email: string;
  telephone: string;
  type__cd_type: string;
  type__libelle: string;
}

export interface Institution {
  id: string;
  nom: string;
  sigle: string;
  siege: string;
  date_adhesion: string | null;
  document_adhesion: string;
  rib: string;
  tutelle: {
    id: string | null;
    libelle: string | null;
    type: string | null;
  };
  devise_principale: string | null;
  devise_secondaire: string | null;
}

export interface InstitutionsResponse {
  success: boolean;
  data: {
    tutelles: Tutelle[];
    institutions: Institution[];
    user_role: string;
    total_institutions: number;
  };
  message: string;
}

export const useInstitutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [tutelles, setTutelles] = useState<Tutelle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('adm');

  const fetchInstitutions = async (role: string = 'adm', service?: string) => {
    try {
      setLoading(true);
      setError(null);

      let url = buildApiUrl('/institutions/');
      const params = new URLSearchParams();
      params.append('role', role);
      if (service) {
        params.append('service', service);
      }
      url += '?' + params.toString();

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: InstitutionsResponse = await response.json();
      
      if (data.success) {
        setInstitutions(data.data.institutions);
        setTutelles(data.data.tutelles);
        setUserRole(data.data.user_role);
      } else {
        throw new Error('Erreur lors de la récupération des données');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des institutions:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createInstitution = async (institutionData: Partial<Institution>) => {
    try {
      // Pour l'instant, simulation d'une création
      // En production, il faudrait implémenter l'endpoint POST
      const newInstitution: Institution = {
        id: Date.now().toString(),
        nom: institutionData.nom || '',
        sigle: institutionData.sigle || '',
        siege: institutionData.siege || '',
        date_adhesion: institutionData.date_adhesion || null,
        document_adhesion: institutionData.document_adhesion || '',
        rib: institutionData.rib || '',
        tutelle: institutionData.tutelle || { id: null, libelle: null, type: null },
        devise_principale: institutionData.devise_principale || null,
        devise_secondaire: institutionData.devise_secondaire || null,
      };

      setInstitutions(prev => [...prev, newInstitution]);
      return newInstitution;
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      throw err;
    }
  };

  const updateInstitution = async (id: string, institutionData: Partial<Institution>) => {
    try {
      // Pour l'instant, simulation d'une mise à jour
      // En production, il faudrait implémenter l'endpoint PUT/PATCH
      setInstitutions(prev => 
        prev.map(inst => 
          inst.id === id 
            ? { ...inst, ...institutionData }
            : inst
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      throw err;
    }
  };

  const deleteInstitution = async (id: string) => {
    try {
      // Pour l'instant, simulation d'une suppression
      // En production, il faudrait implémenter l'endpoint DELETE
      setInstitutions(prev => prev.filter(inst => inst.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return {
    institutions,
    tutelles,
    loading,
    error,
    userRole,
    fetchInstitutions,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    refetch: () => fetchInstitutions(userRole),
  };
};
