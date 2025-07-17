from rest_framework import serializers
from django.apps import apps

# Récupération dynamique des modèles
Organisation = apps.get_model('gestion', 'Organisation')
SituationFinanciere = apps.get_model('gestion', 'SituationFinanciere')
Engagement = apps.get_model('gestion', 'Engagement')
Exercice = apps.get_model('gestion', 'Exercice')
LigneGblobale = apps.get_model('gestion', 'LigneGblobale')
Taux = apps.get_model('gestion', 'Taux')


class OrganisationSerializer(serializers.ModelSerializer):
    """Serializer pour les organisations"""
    class Meta:
        model = Organisation
        fields = ['id', 'nom']


class ExerciceSerializer(serializers.ModelSerializer):
    """Serializer pour les exercices"""
    class Meta:
        model = Exercice
        fields = ['id', 'statut']


class TauxSerializer(serializers.ModelSerializer):
    """Serializer pour les taux de change"""
    class Meta:
        model = Taux
        fields = ['devise', 'taux']


class SituationFinanciereSerializer(serializers.ModelSerializer):
    """Serializer pour les situations financières"""
    organisation_nom = serializers.CharField(source='organisation.nom', read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = SituationFinanciere
        fields = [
            'id', 'organisation_nom', 'contribution', 'arriere', 
            'paye', 'devise', 'total'
        ]
    
    def get_total(self, obj):
        return (obj.contribution or 0) + (obj.arriere or 0)


class EngagementSerializer(serializers.ModelSerializer):
    """Serializer pour les engagements"""
    organisation_nom = serializers.CharField(source='organisation.nom', read_only=True)
    
    class Meta:
        model = Engagement
        fields = [
            'id', 'organisation_nom', 'montant_engage', 
            'devise', 'date_engagement'
        ]


class LigneGblobaleSerializer(serializers.ModelSerializer):
    """Serializer pour la ligne globale"""
    class Meta:
        model = LigneGblobale
        fields = ['credit_actuel', 'credit_disponible']


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer pour les statistiques du dashboard"""
    credit_actuel = serializers.DecimalField(max_digits=15, decimal_places=2)
    credit_disponible = serializers.DecimalField(max_digits=15, decimal_places=2)
    contributions_demandees = serializers.DecimalField(max_digits=15, decimal_places=2)
    contributions_engagees = serializers.DecimalField(max_digits=15, decimal_places=2)
    contributions_payees = serializers.DecimalField(max_digits=15, decimal_places=2)
    taux_engagement = serializers.DecimalField(max_digits=5, decimal_places=2)
    taux_paiement = serializers.DecimalField(max_digits=5, decimal_places=2)


class DashboardDataSerializer(serializers.Serializer):
    """Serializer pour toutes les données du dashboard"""
    exercice = ExerciceSerializer()
    statistiques = DashboardStatsSerializer()
    contributions = SituationFinanciereSerializer(many=True)
    engagements = EngagementSerializer(many=True)
    taux_change = TauxSerializer(many=True)
    institutions = OrganisationSerializer(many=True)


# Ancien serializer gardé pour compatibilité
# class ItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Item
#         fields = '__all__'
