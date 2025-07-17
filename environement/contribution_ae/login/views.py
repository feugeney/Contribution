from dataclasses import fields
import json
from pdb import post_mortem
from sre_constants import SUCCESS
from django.db import transaction
from django.shortcuts import render,redirect
from django.contrib.auth import views
from django.views.generic import list,base
from django.shortcuts import render,redirect
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.views.generic import FormView,TemplateView,DetailView
from django.views.generic.base import View
from django.urls import reverse_lazy,reverse
from login.forms import *
from login.models import Users
from login.utils import get_random_alphanumeric_string
from django.contrib.auth.mixins import LoginRequiredMixin,PermissionRequiredMixin
from rolepermissions.mixins import HasRoleMixin
from django.contrib import messages
from django.views.generic.edit import SingleObjectMixin
from django.http import HttpResponse, JsonResponse
from django.core.serializers import serialize
from django.contrib.auth.decorators import login_required,permission_required
from faulthandler import disable
from tokenize import group
from django import forms
import re
from django.utils import timezone
from django.contrib.auth import (password_validation,login)
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.db import transaction
from django.contrib import messages
from login.models import Users,Commentaire_tutelle
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django import forms
from  .import forms
import re
from django.utils import timezone
from login.utils import generate_random_text,nbre_minute_ecoulee,get_random_alphanumeric_string
# Create your views here.


def save_notification(user,password,template,subject):
    data = {
        'source':'"Ministère des Affaires Etrangères\" <noreply.econtrib@gmail.com>',
        'destinataire':user.email,
        'template':template,
        'subject':subject,
        'context':{
            'matricule':user.email,
            'password':password,
            'nom':user.full_name()
        }
    }
    notification = Notification()
    notification.type = 'mail'
    notification.destinateur = user
    notification.data = data
    notification.flag_envoye= True
    notification.date_envoi=timezone.now()
    notification.save()

class LoginView (views.LoginView):
    template_name='login.html'
    form_class = forms.LoginForm
    def get_success_url(self):
        return reverse ('menus')
    
class CreationUserView (LoginView):
    template_name='creation_utilisateur.html'
    form_class = CreationUserForm
    def get_success_url(self):
        return reverse ('liste-utilisateur')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        id = self.kwargs.get('id') or None
        if id is not None:
            kwargs['id'] = id
        return kwargs
    

    
class MenusView (LoginRequiredMixin,TemplateView):
    template_name='menus.html'    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        context['permission'] = user.get_group_permissions()
        return context
    
class ListeUserView (list.MultipleObjectMixin,views.FormView):
    template_name='liste_utilisateur.html'
    form_class = forms.FiltreUserForm
    queryset = Users.objects.all()
    context_object_name = 'users'
    success_url = reverse_lazy('liste-utilisateur')
    def get_queryset(self): 
        queryset =  super().get_queryset()
        return queryset.filter()
    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        allow_empty = self.get_allow_empty()
        return super().get(request, *args, **kwargs)
    def form_valid(self, form):
        allow_empty = self.get_allow_empty()
        representation = form.cleaned_data.get('representation')
        if representation != '':
            self.queryset = self.get_queryset().filter(representation=representation)
        self.object_list = self.queryset
        return self.render_to_response(self.get_context_data(form=form))
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['queryset'] = self.queryset
        return kwargs


class ChangementPasswordView(LoginRequiredMixin,views.FormView):
    template_name='changement_password.html'
    form_class = forms.ChangementPasswordForm 
    success_url = reverse_lazy('login')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    

class  DemandeReinitialisationView(views.FormView):
    template_name='demande_reinitialisation.html'
    form_class = forms.DemandeReinitialisationForm 
    success_url = reverse_lazy('login')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs   

class  ActiverUserView(SingleObjectMixin,View):
    model = Users
    def post(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = True
        user.save()
        context= {
            'nom':user.full_name,
            'username':user.username,
            }
        html_content= render_to_string('email/activation_compte.html',context)
        send_mail(
           '[eContrib] Activation d''un compte',
             html_content,
            '<noreply.econtrib.@gmail.com>',
            [user.email],
            html_message=html_content,
            fail_silently = False,
        )
        messages.success(self.request,'Utilisateur activer avec succès')
        return redirect('liste-utilisateur')
    
class  DesactiverUserView(SingleObjectMixin, View):
    model = Users
    allowed_roles = ['superviseur','admin','super']
    def post(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = False
        user.save()
        context= {
            'nom':user.full_name,
        
            }
        html_content= render_to_string('email/desactivation_compte.html',context)
        send_mail(
            '[eContrib] Desactivation d''un compte',
             html_content,
            '<noreply.econtrib.@gmail.com>',
            [user.email],
            html_message=html_content,
            fail_silently = False,
        )
        messages.success(self.request,'Utilisateur desactiver avec succès')
        return redirect('liste-utilisateur')



class ModificationUserView(views.FormView):
    template_name='modification_user.html'
    form_class = forms.ModificationUserForm 
    success_url = reverse_lazy('liste-utilisateur')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        kwargs['user'] = Users.objects.get(id=self.kwargs.get('id'))
        return kwargs
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['id'] = self.kwargs.get('id')
        context['url'] = reverse('modification-users',kwargs={'id':self.kwargs.get('id')})
        return context  
    def get_initial(self):
        initial =  super().get_initial()
        user = Users.objects.get(id=self.kwargs.get('id'))
        initial['nom'] = user.last_name
        initial['email'] = user.email
        initial['prenom'] = user.first_name
        initial['telephone'] = user.telephone
        initial['groupe'] = user.groupe
        initial['service'] = user.service
        return initial

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['users'] = Users.objects.get(id=self.kwargs.get('id'))
        return context

class InformationsView(views.FormView):
    template_name='mes_informations.html'
    form_class = forms.MesInformationForm 
    success_url = reverse_lazy('dash')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_initial(self):
        initial =  super().get_initial()
        user = self.request.user
        initial['email'] = user.email
        initial['nom'] = user.last_name
        initial['prenom'] = user.first_name
        initial['telephone'] = user.telephone
        return initial


@login_required
def create_user(request):
    form  =  CreationUserForm
    if request.method == 'POST':
        prenom = request.POST.get('prenom')
        nom = request.POST.get('nom')
        email = request.POST.get('email')
        telephone = request.POST.get('telephone')
        groupe = request.POST.get('groupe')
        service = request.POST.get('service')
        titre = request.POST.get('titre')
        grp=Group.objects.get(pk=groupe)
        if grp is None:
            raise post_mortem.get_error('invalid_format_telephone')
        modif = False
        with transaction.atomic():
            password = get_random_alphanumeric_string(8)
            user=Users.objects.create_user(username=email,email=email,password=password,is_reseted=True,telephone=telephone,last_name = nom,
            first_name = prenom,
            groupe =grp ,
            titre=Titre.objects.get(code=titre),
            service=Tutelle.objects.get(cd_tutelle=service),
            date_joined = timezone.now())
            user.groups.add(grp)
            context= {
            'password':password,
            'nom':user.full_name,
            'username':user.username,
            }
            html_content= render_to_string('email/creation_compte.html',context)
            send_mail(
            '[eContrib] Création d''un compte',
             html_content,
            '<noreply.econtrib.@gmail.com>',
            [user.email],
            html_message=html_content,
            fail_silently = False,
        )   
            save_notification(user,password,'email/creation_compte.html','[Econtrib] Création de compte')
            messages.success(request,'Utilisateur créé avec succès')   
    return render(request, 'creation_utilisateur.html', {'form':form})




class CommentaireView (views.FormView):
    template_name='commentaire.html'
    form_class = forms.CommentaireForms
    def get_success_url(self):
        return reverse ('liste-institution')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_initial(self):
        initial =  super().get_initial()
        organisation =  Organisation.objects.get(cd_organisation=self.kwargs.get('pk'))
        initial['organisation'] = organisation.pk
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['organisation'] = Organisation.objects.get(cd_organisation=self.kwargs.get('pk'))
        return context
    def post(self,request,pk):
        form  =  CommentaireForms
        if request.method == 'POST':
            organisation = Organisation.objects.get(cd_organisation=pk)
            objet = request.POST.get('objet')
            comment = request.POST.get('commentaire')
            commentaire=Commentaire_tutelle()
            commentaire.commentaire=comment
            commentaire.organisation=organisation
            commentaire.objet=objet
            commentaire.statut=Statut.objects.get(code='ATT')
            commentaire.auteur=self.request.user
            commentaire.date_analyse=timezone.now()
            commentaire.save() 
            user=Users.objects.get(groupe=5) 
            context= {
            'organisation':organisation.nom,
            'objet':objet,
            'tutelle':self.request.user.service.libelle,
            'commentaire':comment,
            }
            html_content= render_to_string('email/commentaire_tutelle.html',context)
            send_mail(
            '[eContrib] Commentaire d''une tutelle',
             html_content,
            '<noreply.econtrib.@gmail.com>',
            [user.email],
            html_message=html_content,
            fail_silently = False,
        )                               
            messages.success(request,'Votre commentaire est envoyé avec sucess')
           
        return redirect('liste-institution')
           

class ListeCommentaireView (LoginRequiredMixin,views.FormView):
    template_name='liste_commentaire.html'
    form_class = forms.CommentaireForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['commentaires'] = Commentaire_tutelle.objects.all().order_by('-date_analyse')
        return context

class VisualisationCommentaireView(LoginRequiredMixin,views.FormView):
    template_name='consultation_commentaire.html'
    form_class = forms.ConnsultationCommentaireForms
    success_url = reverse_lazy('liste-institution')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        commentaire = Commentaire_tutelle.objects.get(pk=self.kwargs.get('pk'))
        initial['organisation'] = commentaire.organisation.nom
        initial['tutelle'] = commentaire.auteur.service
        initial['commentaire'] = commentaire.commentaire
        initial['date_analyse'] = None if commentaire.date_analyse is None else commentaire.date_analyse.strftime('%Y-%m-%d') 
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['commentaire'] = Commentaire_tutelle.objects.get(pk=self.kwargs.get('pk'))
        return context 
    

class PriseEncompteCommentaireView(list.MultipleObjectMixin,views.FormView):  
    def get (self, request, *args, **kwargs):
        commentaire = Commentaire_tutelle.objects.get(pk=self.kwargs.get('pk'))
        statut = Statut.objects.filter(code='Val').first()       
        if commentaire is None: 
            messages.error(request,'Aucune demande en instance de validation')
        else:              
            commentaire.date_val=timezone.now()
            commentaire.statut=statut 
            commentaire.validateur=request.user.email
            commentaire.save()                 
        messages.success(self.request,'La modification sera prise en compte ')
        return redirect('liste-institution')