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
from django.urls import path,re_path
from django.contrib.auth import views
from django.urls import include
from django.urls import reverse_lazy
from django.conf import settings
from .views import *


urlpatterns = [
    path('',LoginView.as_view(),name='login'),
    path('logout/', views.LogoutView.as_view(),name='logout'),
    path('change-password/', ChangementPasswordView.as_view(),name='change-password'),
    path('reinitialisation-users', DemandeReinitialisationView.as_view(),name='demande-reinitialisation'),
    path('info/', InformationsView.as_view(),name='info'),
    path('creation-utilisateur',create_user,name='creation-utilisateur'),
    path('liste-utilisateur',ListeUserView.as_view(),name='liste-utilisateur'),
    path('activation-users/<str:pk>', ActiverUserView.as_view(),name='activation-users'),
    path('desactivation-users/<str:pk>', DesactiverUserView.as_view(),name='desactivation-users'),
    path('modification-users/<uuid:id>', ModificationUserView.as_view(),name='modification-users'),
    path('commentaire/<str:pk>', CommentaireView.as_view(),name='commentaire'),
    path('liste-commentaire',ListeCommentaireView.as_view(),name='liste-commentaire'),
    path('visualisation-commentaire/<str:pk>', VisualisationCommentaireView.as_view(),name='visualisation-commentaire'),
    path('prisenecharge-commentaire/<str:pk>', PriseEncompteCommentaireView.as_view(),name='prisencharge-commentaire'),

   
]
