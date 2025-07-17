"""contribution_ae URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from .views import *

urlpatterns = [
    path('menus',AcceuilView.as_view(),name='menus'),
    path('creation-exercice',ExerciceView.as_view(),name='creation-exercice'),
    path('liste-exercice',ListeExerciceView.as_view(),name='liste-exercice'),
    path('charge-ligne',ChargementLigneView.as_view(),name='charge-ligne'),
    path('modification-ligne/<str:pk>',ModificationChargementLigneView.as_view(),name='modification-ligne'),
    path('modification-tutelle/<str:pk>',ModificationTutelleView.as_view(),name='modification-tutelle'),



    path('liste-ligne',ListeLigneView.as_view(),name='liste-ligne'),
    path('modification-exercice/<int:pk>',ModificationExerciceView.as_view(),name='modification-exercice'),
    path('creation-tutelle',CreationTutelleView.as_view(),name='creation-tutelle'),
    path('transfert-credit/<str:pk>',TransfertCreditView.as_view(),name='transfert-credit'),


    path('liste-tutelle',ListeTutelleView.as_view(),name='liste-tutelle'),
    path('creation-institution',CreationInstitutionView.as_view(),name='creation-institution'),
    path('modification-devise/<str:pk>',ModificationDeviseView.as_view(),name='modification-devise'),

    path('creation-devise',DeviseView.as_view(),name='creation-devise'),
    path('liste-devise',ListeDeviseView.as_view(),name='liste-devise'),
    path('liste-taux',ListeTauxView.as_view(),name='liste-taux'),
    path('miseajour-taux/<int:pk>',MisajourTauxView.as_view(),name='miseajour-taux'),

    path('creation-planengagement',PlanEngagementView.as_view(),name='creation-planengagement'),
    path('liste-plan',HistoriquePlanView.as_view(),name='liste-plan'),
    path('simulation-plan/<str:exercice>/<int:pk>',SimulationPlanView.as_view(),name='simulation-plan'),

    path('liste-courrier',ListeCourriersRecusView.as_view(),name='liste-courrier'),
    path('courrier/document/<str:pk>/lire', AffichageCourrierView.as_view(),name='lire-courrier'),



    path('liste-institution',ListeInstitutionView.as_view(),name='liste-institution'),
    path('historique-situation',HistoriqueSituationView.as_view(),name='historique-situation'),
    path('modification-institution/<str:pk>',ModificationInstitutionView.as_view(),name='modification-institution'),
    path('consultation-institution/<str:pk>',ConsultationInstitutionView.as_view(),name='consultation-institution'),
    path('situation-financiere',SituationFinanciereView.as_view(),name='situation-financiere'),
    path('prise-enchargelettre',PriseEnChargeLettreView.as_view(),name='prise-enchargelettre'),
    path('historique/<str:pk>',HistoriqueSituationOrganisationView.as_view(),name='historique'),
    path('historique/document/<str:pk>/lire', AffichageLettreView.as_view(),name='lire-lettre'),
    path('organisation/document/<str:pk>/lire', AffichageDocumentView.as_view(),name='lire-document'),

    path('organisation/rib/<str:pk>/lire', AffichageRibView.as_view(),name='lire-rib'),
    path('organisation/engag/<str:pk>/lire', AffichageLiasseEngaView.as_view(),name='lire-enga'),
    path('organisation/avis/<str:pk>/lire', AffichageAvisView.as_view(),name='lire-avis'),
  
    path('engagement',EngagementView.as_view(),name='engagement'),
    path('liste-engagement-instance',EngagementInstanceView.as_view(),name='liste-engagement-instance'),
    path('liste-engagement-paye',EngagementPayerView.as_view(),name='liste-engagement-paye'),
    path('liste-engagement-rejete',EngagementRejeterView.as_view(),name='liste-engagement-rejete'),
    path('modification-engagement/<str:pk>',ModificationEngagementView.as_view(),name='modification-engagement'),
    path('consultation-engagement/<str:pk>',ConsultationEngagementView.as_view(),name='consultation-engagement'),
    path('situation-engagement/<int:pk>',SituationEngagementView.as_view(),name='situation-engagement'),
    path('proposition-engagement',EnregistrmentProposition.as_view(),name='enregistrement-proposition'),
   
    
    
    
    path('extration/sitatution',situationconrente,name='extration-situation'),
    path('extration-historique/<str:pk>',historique,name='extration-historique'),
    path('export-liste/',liste_organisation,name='export-liste'),
    path('export-engagement/',engagement,name='export-engagement'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
