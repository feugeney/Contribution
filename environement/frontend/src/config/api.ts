// Configuration de l'API pour l'application React
const getApiBaseUrl = (): string => {
  // En développement avec Create React App, les variables d'environnement 
  // sont injectées au moment du build
  if (typeof window !== 'undefined' && (window as any).__API_URL__) {
    return (window as any).__API_URL__;
  }
  
  // URL par défaut pour le développement local
  return 'http://localhost:8000/api/';
};

export const API_CONFIG = {
  // URL de base - sera configurée automatiquement
  BASE_URL: getApiBaseUrl(),
  
  // Endpoints disponibles
  ENDPOINTS: {
    DASHBOARD: 'dashboard/',
    DASHBOARD_SUMMARY: 'dashboard/summary/',
    LOGIN: 'auth/login/',
    LOGOUT: 'auth/logout/',
  },
  
  // Configuration des timeouts
  TIMEOUT: 10000, // 10 secondes
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Fonction utilitaire pour construire les URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour récupérer les headers avec authentification
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export default API_CONFIG;
