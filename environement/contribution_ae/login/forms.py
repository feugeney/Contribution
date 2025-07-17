from cgitb import enable
from ctypes import util
from faulthandler import disable
from django import forms
import re
from django.utils import timezone
from django.contrib.auth import (
    password_validation,login
)
from django.contrib.auth import (password_validation,login)
from django.contrib.auth.models import Group, Permission
from django.core.exceptions import ValidationError
from login.utils import generate_random_text,nbre_minute_ecoulee,get_random_alphanumeric_string
from django.db import transaction
from django.contrib import messages
from django.core.mail import send_mail
from django.template.loader import render_to_string
from login.models import *
from gestion.models import *
from login.utils_mouchard import create_mouchard

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

class LoginForm(forms.Form):
    email = forms.CharField(max_length=255, widget=forms.TextInput(
        attrs={'placeholder': 'Votre Identifiant', 'class': 'form-control' }))
    password = forms.CharField(max_length=20, min_length=5, widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'placeholder': 'Votre mot de passe', }))  # hides password on input
    error_messages = {
        'invalid_login': "Désolé,Vos données sont incorrectes ",
        'valid_login': "l'utilisateur connecte avec sucess ",
        'inactive': "Ce compte est désactivé",
    }
    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        self.user_cache = None
        super().__init__(*args, **kwargs)
    def clean(self):
        username = self.cleaned_data.get('email')
        password = self.cleaned_data.get('password')
        if username is not None and password is not None:
            user = Users.objects.filter(username__iexact=username).first()
            if user is None:
                raise self.get_error('invalid_login')
            else:
                if not user.check_password(password):
                    raise self.get_error('invalid_login')
                else:
                    if not user.is_active:
                        raise self.get_error('inactive')
                    login(self.request,user)
        return self.cleaned_data
    def get_user(self):
        return self.user_cache
   
    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            )
    def get_user(self):
        return self.user_cache

class CreationUserForm(forms.Form):
    prenom = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': 'Prenom', 'class': 'form-control' }))
    nom = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': 'Nom', 'class': 'form-control' }))
    email = forms.CharField(max_length=255, widget=forms.EmailInput(
        attrs={'placeholder': 'Adresse email', 'class': 'form-control' }))
    telephone = forms.CharField(max_length=255, widget=forms.TextInput(
        attrs={'placeholder': 'Telephone', 'class': 'form-control' }))
    service =    forms.ModelChoiceField(
        queryset=Tutelle.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Service', 'class': 'form-control','id':'Service'}),
        empty_label="Service",
        required=False
        )
    titre =    forms.ModelChoiceField(
        queryset=Titre.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Titre', 'class': 'form-control','id':'titre'}),
        empty_label="Titre",
        required=False
        )
    groupe = forms.ModelChoiceField(
        queryset=Group.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choissir la Structure', 'class': 'form-control','id':'structure_niveau2'}),
        empty_label="Structure",
        required=False
        )
    error_messages = {
        'existe_deja': "Désole,l'utilisateur existe deja ",
        'nom_groupe_invalid':'Nom du groupe existe deja'
    }
    def __init__(self, request=None, id=None, *args, **kwargs):
        self.request = request
        if id is not None:
            self.id = id
            user = Users.objects.filter(id=id).first()
            kwargs['initial'] = self.initial
        super().__init__(*args, **kwargs)

class ModificationUserForm(forms.Form):
    prenom = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': 'Prenom', 'class': 'form-control' }))
    nom = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': 'Nom', 'class': 'form-control' }))
    email = forms.CharField(max_length=255, widget=forms.EmailInput(
        attrs={'placeholder': 'Adresse email', 'class': 'form-control' }))
    telephone = forms.CharField(max_length=255, widget=forms.TextInput(
        attrs={'placeholder': 'Telephone', 'class': 'form-control' }))
    groupe =    forms.ModelChoiceField(
        queryset=Group.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Groupe', 'class': 'form-control','id':'groupe'}),
        empty_label="Groupe",
        required=False
        )
    service =    forms.ModelChoiceField(
        queryset=Tutelle.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'service', 'class': 'form-control','id':'service'}),
        empty_label="Groupe",
        required=False
        )
    
    error_messages = {
        'invalid_format_telephone': "Groupe invalide",
        'nom_groupe_invalid':'Nom du groupe existe deja'
    }

    def __init__(self, request=None,user=None, *args, **kwargs):
        self.request = request
        self.user = user
        super().__init__(*args, **kwargs)

    def clean(self):
        email = self.cleaned_data.get('email')
        telephone = self.cleaned_data.get('telephone')
        nom=self.cleaned_data.get('nom')
        prenom=self.cleaned_data.get('prenom')
        service=self.cleaned_data.get('service')
        groupe=self.cleaned_data.get('groupe')
        utilisateur = Users.objects.filter(email__iexact=email).first()
        if utilisateur is None:
            raise self.get_error('nom_groupe_invalid')
        if utilisateur.service != service:
                    create_mouchard(nom_table='USERS',nom_colonne='SERVICE',cle_avant=utilisateur.id,cle_apres=utilisateur.id,
                        user=self.request.user,
                        valeur_avant=utilisateur.service,valeur_apres=service
                    )
        if utilisateur.first_name != prenom:
                    create_mouchard(nom_table='USERS',nom_colonne='PRENOM',cle_avant=utilisateur.id,cle_apres=utilisateur.id,
                        user=self.request.user,
                        valeur_avant=utilisateur.first_name,valeur_apres=prenom
                    )
        if utilisateur.last_name != nom:
                    create_mouchard(nom_table='USERS',nom_colonne='NOM',cle_avant=utilisateur.id,cle_apres=utilisateur.id,
                        user=self.request.user,
                        valeur_avant=utilisateur.last_name,valeur_apres=nom
                    )
        if utilisateur.telephone != telephone:
                    create_mouchard(nom_table='USERS',nom_colonne='NOM',cle_avant=utilisateur.id,cle_apres=utilisateur.id,
                        user=self.request.user,
                        valeur_avant=utilisateur.telephone,valeur_apres=telephone
                    )
        if utilisateur.groupe != groupe:
                    create_mouchard(nom_table='USERS',nom_colonne='GROUPE',cle_avant=utilisateur.id,cle_apres=utilisateur.id,
                        user=self.request.user,
                        valeur_avant=utilisateur.groupe,valeur_apres=groupe
                    )
                    utilisateur.groups.add(groupe)
        utilisateur.email=email
        utilisateur.telephone=telephone
        utilisateur.last_name=nom
        utilisateur.first_name=prenom
        utilisateur.groupe=groupe
        utilisateur.service=service
        utilisateur.save()
        messages.success(self.request,'Modification effectuée avec succès')
        return self.cleaned_data

    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            )
    
class FiltreUserForm(forms.Form):
    service = forms.ModelChoiceField(queryset=Service.objects.all(),widget=forms.Select(attrs={'placeholder': 'Service', 'class': 'form-control','id':'groupe'}),empty_label="Service",required=False)    
    error_messages = {
    }    
    def __init__(self, request=None,queryset=None, *args, **kwargs):
        self.request = request
        self.queryset = queryset
        super().__init__(*args, **kwargs)
    def clean(self):
        representation = self.cleaned_data.get('representation')
        return self.cleaned_data
        
    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            )

class ChangementPasswordForm(forms.Form):
    old_password = forms.CharField(max_length=255, min_length=5, widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'placeholder': 'Ancien mot de passe', }))  # hides password on input
    new_password = forms.CharField(max_length=255, min_length=5, widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'placeholder': 'Nouveau mot de passe', }))  # hides password on input
    confirmation_password = forms.CharField(max_length=255, min_length=5, widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'placeholder': 'Confirmation mot de passe', }))  # hides password on input
        
    error_messages = {
        'invalid_old': "Ancien mot de passe incorrect",
        'email_confirmation': "La confirmation est différente du nouveau mot de passe",
    }

    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        super().__init__(*args, **kwargs)

    def clean(self):
        old_password = self.cleaned_data.get('old_password')
        new_password = self.cleaned_data.get('new_password')
        confirmation_password = self.cleaned_data.get('confirmation_password')
        user = self.request.user
        if new_password != confirmation_password:
            raise self.get_error('email_confirmation')
        if not user.check_password(old_password):
            raise self.get_error('invalid_old')
        try:
            password_validation.validate_password(new_password,user)
        except ValidationError as error:
            messages.error(self.request,error)
            raise ValidationError(
                error,
                code='invalid_password'
            )
        user.set_password(new_password)
        user.is_reseted = False
        user.save()
        return self.cleaned_data

    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            )
class DemandeReinitialisationForm(forms.Form):
    email = forms.CharField(max_length=255, widget=forms.EmailInput(
        attrs={'placeholder': 'Adresse email', 'class': 'form-control' }))   
    error_messages = {
        'invalid_data': "L'information de réinitilisation de votre compte est incorrecte",
        'time_reset': "Veuillez patienter 12heures avant de procéder à une autre réinitialisation",
    }
    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        super().__init__(*args, **kwargs)

    def clean(self):
        email = self.cleaned_data.get('email')
        user = Users.objects.filter(email=email).first()
        if user is None:
            raise self.get_error('invalid_data')
        else:
            messages.success(self.request,'Un mot de passe temporaire a été envoyé mail')
        if user is None:
            raise self.get_error('invalid_data')
        password = get_random_alphanumeric_string(8)
        user.set_password(password)
        user.is_reseted = True
        user.save()
        save_notification(user,password,'email/reinitialisation_compte.html','[Econtrib] Réinitialisation mot de passe')
        context= {
            'password':password,
            'nom':user.full_name
        }
        html_content= render_to_string('email/reinitialisation_compte.html',context)
        send_mail(
            '[eContrib]  Réinitialisation mot de passe',
             html_content,
            '<noreply.econtrib.@gmail.com>',
            [user.email],
            html_message=html_content,
            fail_silently = False,
        )
        return self.cleaned_data

    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            )

class MesInformationForm(forms.Form):
    matricule = forms.CharField(max_length=7, widget=forms.TextInput(
        attrs={'placeholder': 'Matricule', 'class': 'form-control' ,'disabled':True}))
    prenom = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': 'Prenom', 'class': 'form-control','disabled':True }))
    nom = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': 'Nom', 'class': 'form-control','disabled':True }))
    email = forms.CharField(max_length=255, widget=forms.EmailInput(
        attrs={'placeholder': 'Adresse email', 'class': 'form-control' }))
    telephone = forms.CharField(max_length=255, widget=forms.TextInput(
        attrs={'placeholder': 'Telephone', 'class': 'form-control' }))
    
    def __init__(self, request=None,user=None, *args, **kwargs):
        self.request = request
        self.user = user
        super().__init__(*args, **kwargs)


class CommentaireForms(forms.Form):
    organisation = forms.ModelChoiceField(queryset=Organisation.objects.all(),widget=forms.Select(attrs={'placeholder': 'Devise', 'class': 'form-control'})
                                  ,empty_label="organisation",required=False) 
    
    objet = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': 'Objet', 'class': 'form-control' }))
    commentaire = forms.CharField(widget=forms.Textarea(attrs={'name':'body', 'rows':4, 'cols':140}))
    
    date = forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "Fin de l'echance:", 
               'class': 'form-control','min':'1990-01-01' ,'max':'2100-12-31','type':'date' }) )
    
    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        super().__init__(*args, **kwargs)

    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            )
          
    error_messages = {
        'code_existe': "Evenement déjà créée. ",
        'libelle': "Le Libelle du type existe deja",
    }
    def clean(self):       
        organisation=self.cleaned_data.get('organisation')
        
        object = self.cleaned_data.get('object') 
        commentaire = self.cleaned_data.get('commentaire')    
        if organisation is not None:
            raise self.get_error('libelle')
        
        commentaire=Commentaire_tutelle()
        commentaire.organisation=organisation
        commentaire.auteur=self.request.user
        commentaire.date_analyse=timezone.now()
        commentaire.save()  
        messages.success(self.request,'Votre commentaire et prise en compte et l''administrateur est notifié')
        return self.cleaned_data
    


class ConnsultationCommentaireForms(forms.Form):
    organisation = forms.ModelChoiceField(queryset=Organisation.objects.all(),widget=forms.Select(attrs={'placeholder': 'Devise', 'class': 'form-control'})
                                  ,empty_label="organisation",required=False) 
    
    objet = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': 'Objet', 'class': 'form-control' }),disabled=True)
    commentaire = forms.CharField(widget=forms.Textarea(attrs={'name':'body', 'rows':4, 'cols':140}),disabled=True)
    
    date = forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "Fin de l'echance:", 
               'class': 'form-control','min':'1990-01-01' ,'max':'2100-12-31','type':'date' }),disabled=True )
    
    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        super().__init__(*args, **kwargs)

    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            )