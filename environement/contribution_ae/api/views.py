from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.serializers import serialize
from django.db.models import Sum, Q
from django.http import JsonResponse
from django.apps import apps
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from decimal import Decimal
import json

# Récupération dynamique des modèles
Exercice = apps.get_model('gestion', 'Exercice')
SituationFinanciere = apps.get_model('gestion', 'SituationFinanciere')
Engagement = apps.get_model('gestion', 'Engagement')
LigneGblobale = apps.get_model('gestion', 'LigneGblobale')
Organisation = apps.get_model('gestion', 'Organisation')
Taux = apps.get_model('gestion', 'Taux')
Tutelle = apps.get_model('gestion', 'Tutelle')

@method_decorator(csrf_exempt, name='dispatch')
class DashboardAPIView(APIView):
    """
    API pour récupérer les données du dashboard des contributions
    """
    # Temporairement désactivé pour le développement
    # permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Retourne toutes les données nécessaires pour le dashboard React
        """
        try:
            # Test de base - vérifier que les modèles existent
            print("Tentative de récupération des modèles...")
            
            # Récupération de l'exercice en cours
            exercice_current = Exercice.objects.filter(statut='ENC').first()
            print(f"Exercice trouvé: {exercice_current}")
            
            if not exercice_current:
                # Si aucun exercice en cours, retourner des données par défaut
                return Response({
                    'success': True,
                    'data': {
                        'exercice': None,
                        'statistiques': {
                            'credit_actuel': 0,
                            'credit_disponible': 0,
                            'contributions_demandees': 0,
                            'contributions_engagees': 0,
                            'contributions_payees': 0,
                            'taux_engagement': 0,
                            'taux_paiement': 0
                        },
                        'contributions': [],
                        'engagements': [],
                        'taux_change': [],
                        'institutions': list(Organisation.objects.values('cd_organisation', 'nom')[:5])  # Utilisation de cd_organisation
                    },
                    'message': 'Aucun exercice en cours, données par défaut retournées'
                }, status=status.HTTP_200_OK)
            
            # Préparation des données
            data = {
                'exercice': {
                    'id': exercice_current.numero,  # Utilisation de numero au lieu de id
                    'nom': str(exercice_current),
                    'statut': exercice_current.statut.libelle if exercice_current.statut else exercice_current.statut
                },
                'statistiques': self._get_statistiques(exercice_current),
                'contributions': self._get_contributions(exercice_current),
                'engagements': self._get_engagements(exercice_current),
                'taux_change': self._get_taux_change(),
                'institutions': self._get_institutions()
            }
            
            return Response({
                'success': True,
                'data': data,
                'message': 'Données récupérées avec succès'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()
            print(f"Erreur dans DashboardAPIView: {str(e)}")
            print(f"Traceback: {error_traceback}")
            
            return Response({
                'success': False,
                'error': str(e),
                'traceback': error_traceback if request.GET.get('debug') else None,
                'data': None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_statistiques(self, exercice):
        """
        Récupère les statistiques principales
        """
        try:
            ligne_globale = LigneGblobale.objects.get(exercice=exercice)
            
            # Sommes payées
            somme_payee = SituationFinanciere.objects.filter(
                exercice=exercice
            ).aggregate(total=Sum('paye'))['total'] or 0
            
            # Sommes engagées
            somme_engagee = Engagement.objects.filter(
                exercice=exercice
            ).aggregate(total=Sum('montant_engage'))['total'] or 0
            
            # Contributions demandées (contribution + arriérés)
            contributions_demandees = SituationFinanciere.objects.filter(
                exercice=exercice
            ).aggregate(
                total_contribution=Sum('contribution'),
                total_arriere=Sum('arriere')
            )
            
            total_demande = (contributions_demandees['total_contribution'] or 0) + \
                           (contributions_demandees['total_arriere'] or 0)
            
            # Calcul des taux
            credit_actuel = ligne_globale.credit_actuel or 0
            taux_engagement = (somme_engagee * 100 / credit_actuel) if credit_actuel > 0 else 0
            taux_paiement = (somme_payee * 100 / credit_actuel) if credit_actuel > 0 else 0
            
            return {
                'credit_actuel': float(ligne_globale.credit_actuel or 0),
                'credit_disponible': float(ligne_globale.credit_disponible or 0),
                'contributions_demandees': float(total_demande),
                'contributions_engagees': float(somme_engagee),
                'contributions_payees': float(somme_payee),
                'taux_engagement': round(taux_engagement, 2),
                'taux_paiement': round(taux_paiement, 2)
            }
        except LigneGblobale.DoesNotExist:
            return {
                'credit_actuel': 0,
                'credit_disponible': 0,
                'contributions_demandees': 0,
                'contributions_engagees': 0,
                'contributions_payees': 0,
                'taux_engagement': 0,
                'taux_paiement': 0
            }
    
    def _get_contributions(self, exercice):
        """
        Récupère la liste des contributions
        """
        contributions = SituationFinanciere.objects.filter(exercice=exercice)
        return [
            {
                'id': contrib.id,
                'organisation': contrib.organisation.nom if contrib.organisation else '',
                'contribution': float(contrib.contribution or 0),
                'arriere': float(contrib.arriere or 0),
                'paye': float(contrib.paye or 0),
                'devise': contrib.devise.code if contrib.devise else '',  # Accès au code de la devise
                'total': float((contrib.contribution or 0) + (contrib.arriere or 0))
            }
            for contrib in contributions
        ]
    
    def _get_engagements(self, exercice):
        """
        Récupère la liste des engagements
        """
        engagements = Engagement.objects.filter(exercice=exercice)
        return [
            {
                'id': eng.id,
                'organisation': eng.organisation.nom if eng.organisation else '',
                'montant_engage': float(eng.montant_engage or 0),
                'devise': eng.devise.code if eng.devise else '',  # Accès au code de la devise
                'date_engagement': eng.date_engagement.isoformat() if eng.date_engagement else None
            }
            for eng in engagements
        ]
    
    def _get_taux_change(self):
        """
        Récupère les taux de change
        """
        taux = Taux.objects.all()
        return [
            {
                'devise': t.devise.code if t.devise else '',  # Accès au code de la devise
                'taux': float(t.taux or 0)
            }
            for t in taux
        ]
    
    def _get_institutions(self):
        """
        Récupère la liste des organisations/institutions
        """
        organisations = Organisation.objects.all()
        return [
            {
                'id': org.cd_organisation,  # Utilisation de cd_organisation au lieu de id
                'nom': org.nom,
                'sigle': getattr(org, 'sigle', ''),
                'type': getattr(org, 'type', '')
            }
            for org in organisations
        ]


@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Temporairement désactivé pour le développement
def dashboard_summary(request):
    """
    API simple pour récupérer un résumé des données du dashboard
    """
    try:
        exercice = Exercice.objects.filter(statut='ENC').first()
        if not exercice:
            return JsonResponse({
                'error': 'Aucun exercice en cours'
            }, status=404)
        
        # Statistiques rapides
        ligne_globale = LigneGblobale.objects.filter(exercice=exercice).first()
        total_paye = SituationFinanciere.objects.filter(
            exercice=exercice
        ).aggregate(Sum('paye'))['paye__sum'] or 0
        
        total_engage = Engagement.objects.filter(
            exercice=exercice
        ).aggregate(Sum('montant_engage'))['montant_engage__sum'] or 0
        
        return JsonResponse({
            'success': True,
            'exercice': str(exercice),
            'credit_actuel': float(ligne_globale.credit_actuel or 0) if ligne_globale else 0,
            'total_paye': float(total_paye),
            'total_engage': float(total_engage),
            'nb_organisations': Organisation.objects.count(),
            'nb_contributions': SituationFinanciere.objects.filter(exercice=exercice).count()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['GET'])
def test_api(request):
    """
    API de test simple pour vérifier que l'API fonctionne
    """
    return JsonResponse({
        'success': True,
        'message': 'API fonctionne!',
        'data': {
            'test': 'OK'
        }
    })


@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Temporairement désactivé pour le développement
def liste_institutions_api(request):
    """
    API pour récupérer la liste des institutions avec gestion des permissions par rôle
    """
    try:
        # Pour le développement, nous simulons différents rôles via un paramètre URL
        # En production, cela devrait être basé sur request.user
        user_role = request.GET.get('role', 'adm')  # rôle par défaut pour les tests
        user_service = request.GET.get('service', None)  # service de l'utilisateur
        
        # Récupération des tutelles (toujours nécessaire)
        tutelles = list(Tutelle.objects.values(
            'cd_tutelle', 'libelle', 'email', 'telephone',
            'type__cd_type', 'type__libelle'
        ))
        
        # Filtrage des institutions selon le rôle
        if user_role == 'tutelle' and user_service:
            # Si l'utilisateur est de type "tutelle", ne montrer que ses institutions
            institutions = Organisation.objects.filter(tutelle_id=user_service)
        elif user_role in ['adm', 'agent', 'daf', 'dgrm', 'chefequipe']:
            # Pour les autres rôles, montrer toutes les institutions triées par sigle
            institutions = Organisation.objects.all().order_by('sigle')
        else:
            # Par défaut, montrer toutes les institutions
            institutions = Organisation.objects.all().order_by('sigle')
        
        # Sérialisation des institutions
        institutions_data = []
        for org in institutions:
            institutions_data.append({
                'id': org.cd_organisation,
                'nom': org.nom,
                'sigle': org.sigle,
                'siege': org.siege,
                'date_adhesion': org.date_adhesion.isoformat() if org.date_adhesion else None,
                'document_adhesion': org.document_adhesion,
                'rib': org.rib,
                'tutelle': {
                    'id': org.tutelle.cd_tutelle if org.tutelle else None,
                    'libelle': org.tutelle.libelle if org.tutelle else None,
                    'type': org.tutelle.type.libelle if org.tutelle and org.tutelle.type else None
                },
                'devise_principale': org.Devise.code if org.Devise else None,
                'devise_secondaire': org.Devise_2 if hasattr(org, 'Devise_2') else None
            })
        
        return JsonResponse({
            'success': True,
            'data': {
                'tutelles': tutelles,
                'institutions': institutions_data,
                'user_role': user_role,
                'total_institutions': len(institutions_data)
            },
            'message': f'Liste des institutions récupérée avec succès pour le rôle {user_role}'
        })
        
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Erreur dans liste_institutions_api: {str(e)}")
        print(f"Traceback: {error_traceback}")
        
        return JsonResponse({
            'success': False,
            'error': str(e),
            'traceback': error_traceback if request.GET.get('debug') else None
        }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class ContributionsAPIView(APIView):
    """
    API pour récupérer les données des contributions financières
    """
    # Temporairement désactivé pour le développement
    # permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Retourne les données des contributions pour le composant ContributionsManagement
        """
        try:
            # Récupération des paramètres de requête
            role = request.GET.get('role', 'admin')
            service = request.GET.get('service', None)
            
            print(f"ContributionsAPIView - Role: {role}, Service: {service}")
            
            # Récupération de l'exercice en cours
            exercice_current = Exercice.objects.filter(statut='ENC').first()
            
            if not exercice_current:
                return Response({
                    'success': False,
                    'message': 'Aucun exercice en cours trouvé',
                    'data': {
                        'contributions': [],
                        'taux': [],
                        'totaux': {
                            'total_attendu': 0,
                            'total_arrieres': 0,
                            'total_global': 0,
                            'total_paye': 0,
                            'solde_restant': 0
                        }
                    }
                })
            
            # Filtrage selon le rôle de l'utilisateur
            if role == 'tutelle' and service:
                # Utilisateur tutelle : seulement ses institutions
                situations = SituationFinanciere.objects.filter(
                    exercice__statut='ENC'
                ).select_related('organisation', 'exercice').order_by('organisation__sigle')
                
                institutions = Organisation.objects.filter(
                    tutelle__cd_tutelle=service
                ) if hasattr(Organisation._meta.get_field('tutelle'), 'related_model') else Organisation.objects.all()
            else:
                # Utilisateur admin : toutes les institutions
                situations = SituationFinanciere.objects.filter(
                    exercice__statut='ENC'
                ).select_related('organisation', 'exercice').order_by('organisation__sigle')
                
                institutions = Organisation.objects.all().order_by('sigle')
            
            # Récupération des taux de change avec gestion d'erreur
            try:
                # Récupération des champs disponibles dans le modèle Taux
                taux_fields = [f.name for f in Taux._meta.get_fields()]
                print(f"Champs disponibles dans Taux: {taux_fields}")
                
                if 'devise' in taux_fields and 'taux' in taux_fields:
                    taux = list(Taux.objects.all().values('devise', 'taux'))
                else:
                    # Fallback si les champs sont différents
                    taux = []
                    for t in Taux.objects.all():
                        taux_data = {'taux': float(getattr(t, 'taux', 0))}
                        # Essayer différents noms de champs pour la devise
                        for field_name in ['devise', 'devise_id', 'code_devise']:
                            if hasattr(t, field_name):
                                devise_value = getattr(t, field_name)
                                if hasattr(devise_value, 'code'):
                                    taux_data['devise'] = devise_value.code
                                else:
                                    taux_data['devise'] = str(devise_value)
                                break
                        else:
                            taux_data['devise'] = 'USD'  # Fallback
                        taux.append(taux_data)
            except Exception as e:
                print(f"Erreur lors de la récupération des taux: {e}")
                taux = [{'devise': 'USD', 'taux': 8600.0}, {'devise': 'EUR', 'taux': 9460.0}]
            
            # Construction des données des contributions avec tous les champs disponibles
            contributions_data = []
            totaux = {
                'total_attendu': Decimal('0'),
                'total_arrieres': Decimal('0'),
                'total_global': Decimal('0'),
                'total_paye': Decimal('0'),
                'solde_restant': Decimal('0')
            }
            
            # Récupération des champs disponibles dans SituationFinanciere
            situation_fields = [f.name for f in SituationFinanciere._meta.get_fields()]
            print(f"Champs disponibles dans SituationFinanciere: {situation_fields}")
            
            for situation in situations:
                # Récupération dynamique de tous les champs disponibles
                situation_data = {}
                
                # Champs numériques principaux avec fallbacks
                montant_attendu = Decimal('0')
                montant_arrieres = Decimal('0')
                montant_paye = Decimal('0')
                
                # Tentative de récupération avec différents noms de champs possibles
                for field_name in ['contribution', 'contribution_attendue', 'montant_attendu', 'contribution_due']:
                    if hasattr(situation, field_name):
                        value = getattr(situation, field_name)
                        if value is not None:
                            montant_attendu = Decimal(str(value))
                            break
                
                for field_name in ['arrieres', 'arriere', 'montant_arrieres', 'arrieres_cumules']:
                    if hasattr(situation, field_name):
                        value = getattr(situation, field_name)
                        if value is not None:
                            montant_arrieres = Decimal(str(value))
                            break
                
                for field_name in ['paye', 'montant_paye', 'total_paye', 'montant_verse']:
                    if hasattr(situation, field_name):
                        value = getattr(situation, field_name)
                        if value is not None:
                            montant_paye = Decimal(str(value))
                            break
                
                montant_total = montant_attendu + montant_arrieres
                solde_restant = montant_total - montant_paye
                
                # Détermination de la situation de paiement
                if montant_paye >= montant_total and montant_total > 0:
                    situation_paiement = 'paye'
                elif montant_paye > 0:
                    situation_paiement = 'paye-partiellement'
                else:
                    situation_paiement = 'a-payer'
                
                # Récupération de la devise
                devise = 'USD'  # Valeur par défaut
                if hasattr(situation, 'devise') and situation.devise:
                    if hasattr(situation.devise, 'code'):
                        devise = situation.devise.code
                    else:
                        devise = str(situation.devise)
                
                # Récupération de la date d'échéance
                date_echeance = None
                for field_name in ['date_echeance', 'echeance', 'date_limite']:
                    if hasattr(situation, field_name):
                        date_field = getattr(situation, field_name)
                        if date_field:
                            try:
                                date_echeance = date_field.isoformat()
                            except AttributeError:
                                date_echeance = str(date_field)
                            break
                
                # Construction de l'objet contribution avec tous les champs disponibles
                contribution = {
                    'id': str(situation.id),
                    'organisation_id': str(situation.organisation.cd_organisation) if hasattr(situation.organisation, 'cd_organisation') else str(situation.organisation.id),
                    'annee': exercice_current.libelle if hasattr(exercice_current, 'libelle') else str(exercice_current),
                    'montant_attendu': float(montant_attendu),
                    'montant_paye': float(montant_paye),
                    'montant_arrieres': float(montant_arrieres),
                    'devise': devise,
                    'situation': situation_paiement,
                    'date_echeance': date_echeance,
                    'organisations': {
                        'nom': situation.organisation.nom,
                        'sigle': getattr(situation.organisation, 'sigle', situation.organisation.nom[:3])
                    }
                }
                
                # Ajout de tous les autres champs disponibles dans la situation financière
                for field_name in situation_fields:
                    if field_name not in ['id', 'organisation', 'exercice', 'devise'] and not field_name.endswith('_id'):
                        try:
                            field_value = getattr(situation, field_name)
                            if field_value is not None:
                                # Conversion des dates en format ISO
                                if hasattr(field_value, 'isoformat'):
                                    contribution[f'situation_{field_name}'] = field_value.isoformat()
                                # Conversion des decimaux/floats
                                elif isinstance(field_value, (Decimal, float, int)):
                                    contribution[f'situation_{field_name}'] = float(field_value)
                                # Autres types
                                else:
                                    contribution[f'situation_{field_name}'] = str(field_value)
                        except Exception as e:
                            print(f"Erreur lors de la récupération du champ {field_name}: {e}")
                            continue
                
                contributions_data.append(contribution)
                
                # Mise à jour des totaux
                totaux['total_attendu'] += montant_attendu
                totaux['total_arrieres'] += montant_arrieres
                totaux['total_global'] += montant_total
                totaux['total_paye'] += montant_paye
                totaux['solde_restant'] += solde_restant
            
            # Conversion des totaux en float pour JSON
            totaux_json = {
                'total_attendu': float(totaux['total_attendu']),
                'total_arrieres': float(totaux['total_arrieres']),
                'total_global': float(totaux['total_global']),
                'total_paye': float(totaux['total_paye']),
                'solde_restant': float(totaux['solde_restant'])
            }
            
            return Response({
                'success': True,
                'data': {
                    'contributions': contributions_data,
                    'taux': taux,
                    'totaux': totaux_json,
                    'exercice': {
                        'id': exercice_current.id if hasattr(exercice_current, 'id') else exercice_current.numero,
                        'libelle': getattr(exercice_current, 'libelle', str(exercice_current)),
                        'statut': getattr(exercice_current, 'statut', 'ENC')
                    } if exercice_current else None,
                    'debug_info': {
                        'situation_fields': situation_fields,
                        'taux_fields': [f.name for f in Taux._meta.get_fields()],
                        'total_situations': len(contributions_data)
                    }
                }
            })
            
        except Exception as e:
            print(f"Erreur dans ContributionsAPIView: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return Response({
                'success': False,
                'message': f'Erreur lors de la récupération des contributions: {str(e)}',
                'data': {
                    'contributions': [],
                    'taux': [],
                    'totaux': {
                        'total_attendu': 0,
                        'total_arrieres': 0,
                        'total_global': 0,
                        'total_paye': 0,
                        'solde_restant': 0
                    }
                },
                'error_details': str(e)
            }, status=500)


@api_view(['GET'])
def test_contributions_api(request):
    """
    Endpoint de test pour vérifier la connectivité de l'API contributions
    """
    # Données de test mockées
    mock_data = {
        'success': True,
        'data': {
            'contributions': [
                {
                    'id': '1',
                    'organisation_id': '1',
                    'annee': 2024,
                    'montant_attendu': 50000.0,
                    'montant_paye': 30000.0,
                    'montant_arrieres': 10000.0,
                    'devise': 'USD',
                    'situation': 'paye-partiellement',
                    'date_echeance': '2024-12-31',
                    'organisations': {
                        'nom': 'Banque Mondiale',
                        'sigle': 'BM'
                    }
                },
                {
                    'id': '2',
                    'organisation_id': '2',
                    'annee': 2024,
                    'montant_attendu': 25000.0,
                    'montant_paye': 25000.0,
                    'montant_arrieres': 0.0,
                    'devise': 'USD',
                    'situation': 'paye',
                    'date_echeance': '2024-12-31',
                    'organisations': {
                        'nom': 'Fonds Monétaire International',
                        'sigle': 'FMI'
                    }
                }
            ],
            'taux': [
                {
                    'devise': 'USD',
                    'taux': 8600.0
                },
                {
                    'devise': 'EUR',
                    'taux': 9460.0
                }
            ],
            'totaux': {
                'total_attendu': 75000.0,
                'total_arrieres': 10000.0,
                'total_global': 85000.0,
                'total_paye': 55000.0,
                'solde_restant': 30000.0
            },
            'exercice': {
                'id': '1',
                'libelle': '2024',
                'statut': 'ENC'
            }
        }
    }
    
    return Response(mock_data)
    