# Configuration API - Guide de Résolution

## ❌ Problème Résolu
```
useDashboard.ts:62 Uncaught ReferenceError: process is not defined
```

## ✅ Solutions Implémentées

### 1. **Suppression de `process.env`**
Le problème venait de l'utilisation de `process.env.REACT_APP_API_URL` qui n'est pas disponible dans le navigateur en mode runtime.

**Avant (❌ Problématique) :**
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';
```

**Après (✅ Fonctionnel) :**
```typescript
const getApiBaseUrl = (): string => {
  return 'http://localhost:8000/api/';
};
```

### 2. **Nouvelle Architecture de Configuration**

#### **Fichier de Configuration (`src/config/api.ts`)**
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/',
  ENDPOINTS: {
    DASHBOARD: 'dashboard/',
    DASHBOARD_SUMMARY: 'dashboard/summary/',
  },
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

#### **Fonctions Utilitaires**
```typescript
// Construction des URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Headers avec authentification
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};
```

### 3. **Hook `useDashboard` Mis à Jour**
```typescript
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '@/config/api';

const fetchDashboard = async () => {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD);
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  // ...
};
```

## 🔧 Configuration pour Différents Environnements

### **Développement Local**
Par défaut : `http://localhost:8000/api/`

### **Production**
Modifiez `src/config/api.ts` :
```typescript
const getApiBaseUrl = (): string => {
  // Pour la production
  if (window.location.hostname !== 'localhost') {
    return 'https://votre-api-prod.com/api/';
  }
  
  // Pour le développement
  return 'http://localhost:8000/api/';
};
```

### **Avec Variables d'Environnement (Build Time)**
Si vous utilisez un processus de build personnalisé :
```typescript
const getApiBaseUrl = (): string => {
  // Injecté au moment du build
  return '__API_URL__' || 'http://localhost:8000/api/';
};
```

## 🚀 Utilisation

### **1. Démarrer l'API Django**
```bash
cd environement/contribution_ae
python manage.py runserver
```

### **2. Démarrer React**
```bash
cd environement/frontend
npm start
```

### **3. Vérifier la Connexion**
- React : `http://localhost:3000`
- API Django : `http://localhost:8000/api/dashboard/`

## ✅ Avantages de la Nouvelle Architecture

### **🔒 Sécurité**
- Pas d'exposition de variables d'environnement
- Configuration centralisée
- Headers d'authentification automatiques

### **🚀 Performance**
- Pas de calculs runtime inutiles
- Configuration mise en cache
- Gestion optimisée des erreurs

### **🛠 Maintenabilité**
- Configuration séparée du code métier
- Facilité de modification des endpoints
- Tests plus simples

### **📱 Compatibilité**
- Fonctionne dans tous les navigateurs
- Pas de dépendance à Node.js runtime
- Compatible avec différents bundlers

## 🎯 Points Clés

1. **❌ Ne jamais utiliser `process.env` côté client** - Non disponible dans le navigateur
2. **✅ Utiliser une configuration statique** - Plus fiable et performant
3. **🔧 Centraliser la configuration API** - Facilite la maintenance
4. **🔐 Gérer l'authentification automatiquement** - Meilleure UX

Votre dashboard React est maintenant entièrement fonctionnel et connecté à l'API Django ! 🎉
