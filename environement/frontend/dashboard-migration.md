# Dashboard Frontend - Intégration API Django

## 🔄 Migration Supabase → API Django

Le composant Dashboard a été entièrement modifié pour utiliser l'API Django `/dashboard/` au lieu de Supabase.

## 🚀 Changements Effectués

### ✅ Suppression de Supabase
- Suppression de toutes les références à Supabase
- Suppression des données mockées
- Remplacement par des appels à l'API Django

### ✅ Nouveau Hook `useDashboard`
Le hook personnalisé `useDashboard` gère :
- Appels à l'API `/dashboard/`
- Gestion des états (loading, error, data)
- Authentification par token
- Fonction de rafraîchissement

### ✅ Composant Dashboard Mis à Jour
- Utilise les vraies données de l'API Django
- Affiche les informations de l'exercice en cours
- Gère les erreurs et le chargement
- Bouton d'actualisation des données

## 📡 API Endpoints Utilisés

```
GET /api/dashboard/
```

Retourne :
```json
{
  "success": true,
  "data": {
    "exercice": { "id": 1, "nom": "2024", "statut": "ENC" },
    "statistiques": {
      "credit_actuel": 1000000.00,
      "credit_disponible": 750000.00,
      "contributions_demandees": 800000.00,
      "contributions_engagees": 250000.00,
      "contributions_payees": 150000.00,
      "taux_engagement": 25.00,
      "taux_paiement": 15.00
    },
    "contributions": [...],
    "engagements": [...],
    "taux_change": [...],
    "institutions": [...]
  }
}
```

## 🔧 Configuration

### 1. Variables d'Environnement
Créez un fichier `.env` :
```bash
REACT_APP_API_URL=http://localhost:8000/api/
```

### 2. Authentification
Le hook utilise les tokens stockés dans :
- `localStorage.getItem('authToken')` (permanent)
- `sessionStorage.getItem('authToken')` (session)

### 3. Gestion des Erreurs
- Redirection automatique si token expiré (401)
- Messages d'erreur explicites
- Bouton de retry

## 🎯 Fonctionnalités

### 📊 Données Réelles
- **Statistiques** : Crédit actuel, disponible, contributions
- **Organisations** : Liste des organisations avec montants
- **Engagements** : Suivi des engagements
- **Taux de change** : Conversion automatique en GNF
- **Exercice** : Affichage de l'exercice en cours

### 🔄 Mise à Jour
- Bouton "Actualiser" pour recharger les données
- Gestion automatique du loading
- Persistance des données entre les refreshs

### 📱 Interface
- Design responsive maintenu
- Animations et graphiques Recharts
- Cards avec statistiques colorées
- Indicateurs de progression

## 🚀 Utilisation

```tsx
import { Dashboard } from '@/components/dashboard/Dashboard';

function App() {
  return <Dashboard />;
}
```

Le composant gère automatiquement :
- ✅ Chargement des données
- ✅ Gestion des erreurs
- ✅ Authentification
- ✅ Conversion des devises
- ✅ Affichage responsive

## 🔐 Sécurité

- Headers d'authentification automatiques
- Gestion des tokens expirés
- Redirection sécurisée en cas d'erreur d'auth
- Validation des données reçues

## 📈 Performance

- Chargement asynchrone
- States optimisés (loading, error, data)
- Conversion des devises côté client
- Cache des données jusqu'au refresh manuel

Votre dashboard est maintenant entièrement connecté à l'API Django et ne dépend plus de Supabase ! 🎉
