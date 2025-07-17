from datetime import date
from datetime import datetime
from faulthandler import disable
import re, os
from tokenize import group
from urllib import request
from django import forms
import re
from django.shortcuts import redirect
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth import (password_validation,login)
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from rolepermissions.checkers import has_role
from django.db import transaction
from django.contrib import messages
from django.contrib.auth.models import User
from gestion.models import *
from login.models import *
from ged.models import *
from django.core.mail import send_mail
from django.template.loader import render_to_string
from login.utils_mouchard import create_mouchard
from django.utils import timezone,dateformat

class TutelleForms(forms.Form):
    cd_tutelle = forms.CharField(max_length=10, widget=forms.TextInput(
        attrs={'placeholder': 'cd_tutelle', 'class': 'form-control' }))
    libelle = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'libelle', 'class': 'form-control' }))
    email = forms.CharField(max_length=255, widget=forms.EmailInput(
        attrs={'placeholder': 'Adresse email', 'class': 'form-control' }),required=True)
    telephone = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'telephone', 'class': 'form-control' }))
    type = forms.ModelChoiceField(queryset=TypeTutelle.objects.all(),widget=forms.Select(attrs={'placeholder': 'Type de la Tutelle', 'class': 'form-control'})
                                  ,empty_label="Type de la Tutelle",required=True)    

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
        cd_tutelle=self.cleaned_data.get('cd_tutelle')
        email=self.cleaned_data.get('email')
        telephone=self.cleaned_data.get('telephone')
        libelle = self.cleaned_data.get('libelle') 
        type = self.cleaned_data.get('type') 
        tutelle = Tutelle.objects.filter(type=type,cd_tutelle=cd_tutelle).first()    
        if tutelle is not None:
            raise self.get_error('libelle')
        tutelle=Tutelle()
        tutelle.cd_tutelle=cd_tutelle
        tutelle.email=email
        tutelle.telephone=telephone
        tutelle.type=type
        tutelle.libelle=libelle
        tutelle.save()  
        messages.success(self.request,'La tutelle est créée avec succes')
        return self.cleaned_data



class DeviseForms(forms.Form):
    code = forms.CharField(max_length=10, widget=forms.TextInput(
        attrs={'placeholder': 'code', 'class': 'form-control' }))
    libelle = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'libelle', 'class': 'form-control' }))
    
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
        code=self.cleaned_data.get('code')
        libelle = self.cleaned_data.get('libelle') 
        devise = Devise.objects.filter(code=code,libelle=libelle).first()    
        if devise is not None:
            devise.code=code
            devise.libelle=libelle
        else:
            devise=Devise()
            devise.code=code
            devise.libelle=libelle
            devise.save() 
        taux=Taux.objects.filter(devise=code).first()
        if taux is None:
            taux=Taux()
            taux.devise=devise
            taux.taux= 0
            taux.save()
        messages.success(self.request,'La devise est créée avec succes')
        return self.cleaned_data
    

class MiseajourTauxForms(forms.Form):
    devise = forms.ModelChoiceField(queryset=Devise.objects.all(),widget=forms.Select(attrs={'placeholder': 'Devise', 'class': 'form-control'})
                                  ,empty_label="devise",required=False)  
    taux = forms.FloatField(required=False, max_value=1000000, min_value=0, widget=forms.NumberInput(attrs={'id': 'taux', 'step': "0.00001",'class': 'form-control'}))
    
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
        devise=self.cleaned_data.get('devise')
        tau=self.cleaned_data.get('taux')
        taux = Taux.objects.filter(devise=devise).first()    
      
        if taux is  None:
            raise self.get_error('libelle')
        else:
            taux.devise=Devise.objects.get(code=devise)
            taux.taux=tau
            taux.save()
        messages.success(self.request,'Le taux est mise à jour avec succes')
        return self.cleaned_data
    

class   ExerciceForms(forms.Form):
    numero = forms.CharField(max_length=10, widget=forms.TextInput(
        attrs={'placeholder': 'code', 'class': 'form-control' }))
    statut = forms.ModelChoiceField(queryset=Statut.objects.all(),widget=forms.Select(attrs={'placeholder': 'Statut', 'class': 'form-control'})
                                  ,empty_label="Statut",required=False)
    montant = forms.CharField(max_length=80, widget=forms.TextInput(
        attrs={'placeholder': 'code', 'class': 'form-control format' }))
    
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
        'ouvert': "Desole,un exercice est deja ouvert",
    }
    def clean(self):       
        numero=self.cleaned_data.get('numero')
        montant=self.cleaned_data.get('montant')
        statut = self.cleaned_data.get('statut') 
        exercice = Exercice.objects.filter(numero=numero).first()
        if exercice is not None:
            exercice_ouvert=  Exercice.objects.filter(statut='ENC').count()
            if statut.code == 'ENC':
                if exercice_ouvert != 0:
                    raise self.get_error('ouvert')
                else:
                    exercice.numero=numero
                    exercice.statut=statut       
            else:
                exercice.numero=numero
                exercice.statut=statut 
        else: 
            exercice=Exercice()
            exercice.numero=numero
            exercice.statut=statut
            exercice.save()
            ################################# Situation pour le nouveau exercice 
            orgnisation=Organisation.objects.all()
            ex=int(exercice.numero)-1
            situations=SituationFinanciere.objects.filter(exercice=str(ex))
            for orga in orgnisation :
                situation=SituationFinanciere()
                situation.organisation =orga
                situation.devise=orga.Devise
                situation.exercice=exercice
                situation.contribution=0
                situation.paye= 0
                situation.arriere=0
                situation.save() 
            situation_courant=  SituationFinanciere.objects.filter(exercice=exercice) 
            for sit in situations :
                for sit_c in situation_courant :
                    if sit.organisation==sit_c.organisation :
                            sit_c.arriere=sit.contribution + sit.arriere - sit.paye
                            sit_c.save()
            ligne=LigneGblobale()
            ligne.exercice=exercice
            ligne.credit_actuel=int(montant.replace(" ",""))
            ligne.credit_disponible=int(montant.replace(" ",""))
            ligne.credit_lfi=int(montant.replace(" ",""))
            ligne.save()
            plan_engagement=PlanEngagement()
            plan_engagement.exercice=exercice
            plan_engagement.periode=Periode.objects.get(code='01')
            plan_engagement.montant=int(montant.replace(" ",""))
            plan_engagement.save()
        exercice.save() 
        
        messages.success(self.request,'L''exercice est ouvert avec succes')
        return self.cleaned_data

class InstitutionForms(forms.Form):
    tutelle = forms.ModelChoiceField(queryset=Tutelle.objects.all(),widget=forms.Select(attrs={'placeholder': 'La Tutelle', 'class': 'form-control','id':'La Tutelle'})
                                  ,empty_label="La Tutelle",required=False) 
    devise = forms.ModelChoiceField(queryset=Devise.objects.all(),widget=forms.Select(attrs={'placeholder': 'Devise', 'class': 'form-control','id':'La Tutelle'})
                                  ,empty_label="Devise",required=False) 
    cd_organisation = forms.CharField(max_length=10, widget=forms.TextInput(
        attrs={'placeholder': 'cd_institution', 'class': 'form-control' }))
    nom = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'nom', 'class': 'form-control' }))
    sigle = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'sigle', 'class': 'form-control' }))
    siege = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'siege', 'class': 'form-control' }))   
    date_adhesion =forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "date_adhesion:", 
               'class': 'form-control','min':'1958-01-01' ,'max':'2100-12-31','type':'date' }) ) 
    coordonnes_bancaire = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'coordonnes_bancaire', 'class': 'form-control' }))
    coordonnes_iban = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'coordonnes_iban', 'class': 'form-control' }))
    document = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}))
    rib = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}))
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
        'orga_existe': "Desolé cette Organisation est déja créee",
    }
    def clean(self):   
        ALLOWED_TYPES=['pdf','jpeg','jpg','png']    
        tutelle=self.cleaned_data.get('tutelle')
        devise=self.cleaned_data.get('devise')
        cd_organisation = self.cleaned_data.get('cd_organisation') 
        nom=self.cleaned_data.get('nom')
        sigle = self.cleaned_data.get('sigle') 
        siege=self.cleaned_data.get('siege')
        date_adhesion = self.cleaned_data.get('date_adhesion') 
        rib = self.request.FILES.get('rib')
        document = self.request.FILES.get('document')
       
        institution = Organisation.objects.filter(sigle=sigle).first()  
       
        if institution is not None:
            raise self.get_error('orga_existe')
        institution=Organisation()
        institution.tutelle=tutelle
        institution.Devise=devise
        institution.cd_organisation=cd_organisation
        institution.nom=nom
        institution.sigle=sigle.upper()
        institution.siege=siege
        institution.date_adhesion=date_adhesion
        filename_doc = f"document_adhesion.{document.name.split('.')[1]}"
        extension=document.name.split('.')[1]
        if extension.lower() not in ALLOWED_TYPES:
                messages.error(self.request,f"L'extension du fichier {document.name} n'est pas autorisée.Les exensions autorisées sont:{ALLOWED_TYPES}")
                return redirect('creation-evenement')
        if document.size > 20000000 :
                messages.error(self.request,f"La taille du fichier {document.name} est trop grand {round(document.size/2048)} Mo: La taille ne doit pas depasser 2Mo")
                return redirect('creation-evenement') 
        dir_name=f'DOCUMENTS/DOCUMENT_ADHESION/{sigle}'
        if not os.path.exists(dir_name):
                os.makedirs(dir_name)  
        lien_doc = f"{dir_name}/{filename_doc}" 
        with open(lien_doc,'wb+') as destination:
            for chunk in document.chunks():
                destination.write(chunk)
        institution.document_adhesion  = lien_doc
        dossier=f"{'DOCUMENT_BASE'}"
        repertoire =Dossier.objects.filter(nom_dossier='DOCUMENT_BASE').first()
        if repertoire is None:
            repertoire=Dossier()
            repertoire.nom_dossier='DOCUMENT_BASE'
            repertoire.save()
            # sous_repertoire
        sousrepertoire=Dossier.objects.filter(parent_dossier=repertoire,nom_dossier=sigle).first()
        if sousrepertoire is None:
            sousrepertoire=Dossier()
            sousrepertoire.parent_dossier=repertoire
            sousrepertoire.nom_dossier=sigle
            sousrepertoire.save()
        # fichier
        doc_adhesion=Fichier()
        doc_adhesion.lien=lien_doc
        doc_adhesion.nom_fichier=filename_doc
        doc_adhesion.dossier=sousrepertoire
        doc_adhesion.save()
        filename_rib = f"coordonées_bancaire.{rib.name.split('.')[1]}"
        extension=document.name.split('.')[1]
        if extension.lower() not in ALLOWED_TYPES:
                messages.error(self.request,f"L'extension du fichier {rib.name} n'est pas autorisée.Les exensions autorisées sont:{ALLOWED_TYPES}")
                return redirect('creation-institution')
        if document.size > 20000000 :
                messages.error(self.request,f"La taille du fichier {rib.name} est trop grand {round(rib.size/2048)} Mo: La taille ne doit pas depasser 2Mo")
                return redirect('creation-institution') 
        dir_name=f'DOCUMENTS/DOCUMENT_ADHESION/{sigle}'
        if not os.path.exists(dir_name):
                os.makedirs(dir_name)  
        lien_doc = f"{dir_name}/{filename_rib}" 
        with open(lien_doc,'wb+') as destination:
            for chunk in document.chunks():
                destination.write(chunk)
        institution.rib  = lien_doc
        repertoire =Dossier.objects.filter(nom_dossier='DOCUMENT_BASE').first()
        if repertoire is None:
            repertoire=Dossier()
            repertoire.nom_dossier='DOCUMENT_BASE'
            repertoire.save()
            # sous_repertoire
        sousrepertoire=Dossier.objects.filter(parent_dossier=repertoire,nom_dossier=sigle).first()
        if sousrepertoire is None:
            sousrepertoire=Dossier()
            sousrepertoire.parent_dossier=repertoire
            sousrepertoire.nom_dossier=sigle
            sousrepertoire.save()
        # fichier
        doc_banque=Fichier()
        doc_banque.lien=lien_doc
        doc_banque.nom_fichier=filename_rib
        doc_banque.dossier=sousrepertoire
        doc_banque.save()
        institution.save()
        situation=SituationFinanciere()
        situation.organisation=institution
        situation.exercice=Exercice.objects.get(statut='ENC')
        situation.contribution=0
        situation.arriere=0
        situation.paye=0
        situation.devise=devise
        situation.save()
        messages.success(self.request,'Organisation est créée avec succes')
        return self.cleaned_data
    

class ReceptionLettreForms(forms.Form):
    exercice = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': '', 'class': 'form-control format' }),disabled=True)
    organisation = forms.ModelChoiceField(queryset=Organisation.objects.all().order_by('nom'),widget=forms.Select(attrs={'placeholder': 'Organisation', 'class': 'form-control','id':'organisation'})
                                  ,empty_label="Choisissez l'Institution",required=False)
    devise = forms.ModelChoiceField(queryset=Devise.objects.all(),widget=forms.Select(attrs={'placeholder': 'La Tutelle', 'class': 'form-control','id':'devise'})
                                  ,empty_label="Devise",required=False)
    contribution = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': '', 'class': 'form-control format' }))
    arriere = forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': '', 'class': 'form-control format' }))
    lettre = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}))
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
        'existe_deja': "Cette lettre a déja été receptionnée. ",
        'libelle': "Le Libelle du type existe deja",
    } 
    def clean(self):
            ALLOWED_TYPES=['pdf','jpeg','jpg','png']
            exercice = self.cleaned_data.get('exercice')
            organisation = self.cleaned_data.get('organisation')
            devise = self.cleaned_data.get('devise')
            contribution = self.cleaned_data.get('contribution')
            arriere = self.cleaned_data.get('arriere')
            lettre = self.request.FILES.get('lettre')
            orga= Organisation.objects.filter(cd_organisation=organisation.cd_organisation).first()
            situation=SituationFinanciere.objects.filter(exercice=exercice,organisation=organisation).first()
            if situation is  None:
                raise self.get_error('existe_deja')
            else:
                situation.contribution=int(contribution.replace(" ",""))
                situation.arriere=int(arriere.replace(" ",""))
                filename = f"{exercice}-{orga.sigle}-.{lettre.name.split('.')[1]}"
                extension=lettre.name.split('.')[1]
                if extension.lower() not in ALLOWED_TYPES:
                            messages.error(self.request,f"L'extension du fichier {lettre.name} n'est pas autorisée.Les exensions autorisées sont:{ALLOWED_TYPES}")
                            return redirect('prise-enchargelettre')
                if lettre.size > 20000000 :
                                messages.error(self.request,f"La taille du fichier {lettre.name} est trop grand {round(lettre.size/2048)} Mo: La taille ne doit pas depasser 2Mo")
                                return redirect('prise-enchargelettre') 
                dir_name=f'DOCUMENTS/LETTRE/{orga.sigle}'
                if not os.path.exists(dir_name):
                            os.makedirs(dir_name)  
                lien_doc = f"{dir_name}/{filename}" 
                with open(lien_doc,'wb+') as destination:
                                for chunk in lettre.chunks():
                                    destination.write(chunk)
                situation.reference_lettre  = lien_doc
                repertoire =Dossier.objects.filter(nom_dossier='LETTRE').first()
                if repertoire is None:
                    repertoire=Dossier()
                    repertoire.nom_dossier='LETTRE'
                    repertoire.save()
                # sous_repertoire
                sousrepertoire=Dossier.objects.filter(parent_dossier=repertoire,nom_dossier=orga.sigle).first()
                if sousrepertoire is None:
                    sousrepertoire=Dossier()
                    sousrepertoire.parent_dossier=repertoire
                    sousrepertoire.nom_dossier=orga.sigle
                    sousrepertoire.save()
                # fichier
                fichier=Fichier()
                fichier.lien=lien_doc
                fichier.nom_fichier=filename
                fichier.dossier=sousrepertoire
                fichier.save()
                lettre=Lettre()
                lettre.exercice=Exercice.objects.get(numero=exercice)
                print(organisation)
                lettre.organisation=organisation
                lettre.expediteur=organisation.tutelle
                lettre.date=timezone.now()
                lettre.document=lien_doc
                lettre.save()
                situation.save()
                messages.success(self.request,'La lettre a été receptionnée avec succes')
                return self.cleaned_data




class MoficationInstitutionForms(forms.Form):
    tutelle = forms.ModelChoiceField(queryset=Tutelle.objects.all(),widget=forms.Select(attrs={'placeholder': 'La Tutelle', 'class': 'form-control','id':'La Tutelle'})
                                  ,empty_label="La Tutelle",required=False) 
    devise = forms.ModelChoiceField(queryset=Devise.objects.all(),widget=forms.Select(attrs={'placeholder': 'Devise', 'class': 'form-control','id':'La Tutelle'})
                                  ,empty_label="Devise",required=False) 
    cd_organisation = forms.CharField(max_length=10, widget=forms.TextInput(
        attrs={'placeholder': 'cd_institution', 'class': 'form-control' }))
    nom = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'nom', 'class': 'form-control' }))
    sigle = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'sigle', 'class': 'form-control' }))
    siege = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'siege', 'class': 'form-control' }))   
    date_adhesion =forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "date_adhesion:", 
               'class': 'form-control','min':'1958-01-01' ,'max':'2100-12-31','type':'date' }) ) 
    document = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}),required=False)
    rib = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}),required=False)
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
        'code_existe': "Organisation n'existe pas. ",
        'libelle': "Le Libelle du type existe deja",
        'nom_existe': "Ce nom existe déja",
    }
    def clean(self):
        ALLOWED_TYPES=['pdf','jpeg','jpg','png']       
        tutelle=self.cleaned_data.get('tutelle')
        cd_organisation = self.cleaned_data.get('cd_organisation') 
        nom=self.cleaned_data.get('nom')
        sigle = self.cleaned_data.get('sigle') 
        siege=self.cleaned_data.get('siege')
        date_adhesion = self.cleaned_data.get('date_adhesion') 
        date=date_adhesion.strftime('%Y-%m-%d') 


        rib = self.request.FILES.get('rib')
        document = self.request.FILES.get('document')
        

        organisation = Organisation.objects.filter(cd_organisation=cd_organisation).first()
        if organisation is  None:
            raise self.get_error('libelle')
        if organisation.nom != nom:     
            i = Organisation.objects.filter(nom=nom).first()
            if i is not None:
                raise self.get_error('nom_existe')
            create_mouchard(nom_table='ORGANISATION',nom_colonne='nom',cle_avant=cd_organisation,cle_apres=cd_organisation,
                    user=self.request.user,
                    valeur_avant=organisation.nom,valeur_apres=nom
            )
        if organisation.tutelle != tutelle:    
            create_mouchard(nom_table='ORGANISATION',nom_colonne='tutelle',cle_avant=cd_organisation,cle_apres=cd_organisation,
                    user=self.request.user,
                    valeur_avant=organisation.tutelle,valeur_apres=tutelle
            )
        if organisation.siege != siege:    
            create_mouchard(nom_table='ORGANISATION',nom_colonne='siege',cle_avant=cd_organisation,cle_apres=cd_organisation,
                    user=self.request.user,
                    valeur_avant=organisation.siege,valeur_apres=siege
            )
        if organisation.sigle != sigle:    
            create_mouchard(nom_table='ORGANISATION',nom_colonne='sigle',cle_avant=cd_organisation,cle_apres=cd_organisation,
                    user=self.request.user,
                    valeur_avant=organisation.sigle,valeur_apres=sigle
            )
        # if organisation.date_adhesion.strftime('%Y-%m-%d') != date_adhesion:    
        #     create_mouchard(nom_table='Organisation',nom_colonne='date_adhesion',cle_avant=cd_organisation,cle_apres=cd_organisation,
        #             user=self.request.user,
        #             valeur_avant=organisation.date_adhesion,valeur_apres=date_adhesion
        #     )
        # Modification_document
        if document is not None:
            filename_document = f"document_adhesion.{document.name.split('.')[1]}"
            extension=document.name.split('.')[1]
            if extension.lower() not in ALLOWED_TYPES:
                    messages.error(self.request,f"L'extension du fichier {document.name} n'est pas autorisée.Les exensions autorisées sont:{ALLOWED_TYPES}")
                    return redirect('creation-institution')
            if document.size > 20000000 :
                    messages.error(self.request,f"La taille du fichier {document.name} est trop grand {round(rib.size/2048)} Mo: La taille ne doit pas depasser 2Mo")
                    return redirect('creation-institution') 
            dir_name=f'DOCUMENTS/DOCUMENT_ADHESION/{sigle}'
            if not os.path.exists(dir_name):
                    os.makedirs(dir_name)  
            lien_doc = f"{dir_name}/{filename_document}" 
            with open(lien_doc,'wb+') as destination:
                for chunk in document.chunks():
                    destination.write(chunk)
            organisation.doc_adhesion  = lien_doc
    # Modification_rib
        if rib is not None:
            filename_rib = f"coordonées_bancaire.{rib.name.split('.')[1]}"
            extension=rib.name.split('.')[1]
            if extension.lower() not in ALLOWED_TYPES:
                    messages.error(self.request,f"L'extension du fichier {rib.name} n'est pas autorisée.Les exensions autorisées sont:{ALLOWED_TYPES}")
                    return redirect('creation-institution')
            if rib.size > 20000000 :
                    messages.error(self.request,f"La taille du fichier {rib.name} est trop grand {round(rib.size/2048)} Mo: La taille ne doit pas depasser 2Mo")
                    return redirect('creation-institution') 
            dir_name=f'DOCUMENTS/DOCUMENT_ADHESION/{sigle}'
            if not os.path.exists(dir_name):
                    os.makedirs(dir_name)  
            lien_doc = f"{dir_name}/{filename_rib}" 
            with open(lien_doc,'wb+') as destination:
                for chunk in rib.chunks():
                    destination.write(chunk)
            organisation.rib  = lien_doc
        organisation.tutelle=tutelle
        organisation.cd_organisation=cd_organisation
        organisation.nom=nom
        organisation.sigle=sigle
        organisation.siege=siege
        organisation.date_adhesion=date_adhesion
        organisation.save() 
        messages.success(self.request,'Modification effectuée avec succes')
        return self.cleaned_data
    

class ConsultationInstitutionForms(forms.Form):
    tutelle = forms.ModelChoiceField(queryset=Tutelle.objects.all(),widget=forms.Select(attrs={'placeholder': 'La Tutelle', 'class': 'form-control','id':'La Tutelle'}),disabled=True
                                  ,empty_label="La Tutelle",required=False) 
    devise = forms.ModelChoiceField(queryset=Devise.objects.all(),widget=forms.Select(attrs={'placeholder': 'Devise', 'class': 'form-control','id':'La Tutelle'}),disabled=True
                                  ,empty_label="Devise",required=False) 
    cd_organisation = forms.CharField(max_length=10, widget=forms.TextInput(
        attrs={'placeholder': 'cd_institution', 'class': 'form-control' }),disabled=True)
    nom = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'nom', 'class': 'form-control' }),disabled=True)
    sigle = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'sigle', 'class': 'form-control' }),disabled=True)
    siege = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'siege', 'class': 'form-control' }),disabled=True)   
    date_adhesion =forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "date_adhesion:", 
               'class': 'form-control','min':'1958-01-01' ,'max':'2100-12-31','type':'date' }),disabled=True ) 
    coordonnes_bancaire = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'coordonnes_bancaire', 'class': 'form-control' }),disabled=True)
    coordonnes_iban = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'coordonnes_iban', 'class': 'form-control' }),disabled=True)
    document = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}),disabled=True)
    rib = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}),disabled=True)
    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        super().__init__(*args, **kwargs)

    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            ) 
    

class EngagementForms(forms.Form):
    organisation =  forms.ModelChoiceField(
        queryset=Organisation.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez une Tutelle', 'class': 'form-control','id':'tutelle'}),
        empty_label="Choisissez une Tutelle",
        required=False,
        )
    exercice =  forms.ModelChoiceField(
        queryset=Exercice.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez la contribution à payer', 'class': 'form-control','id':'exercice'}),
        empty_label="Choisissez un exercice",
        required=False,disabled=True,
        )
    contribution =  forms.ModelChoiceField(
        queryset=SituationFinanciere.objects.filter(exercice__statut='ENC'),
        widget=forms.Select(attrs={'placeholder': 'Choisissez la contribution à payer', 'class': 'form-control','id':'contribution'}),
        empty_label="Choisissez la contribution à payer",
        required=True,
        )
    devise =  forms.ModelChoiceField(
        queryset=Devise.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Devise', 'class': 'form-control','id':'devise'}),
        empty_label="Devise",
        required=False,
        )
    source =  forms.ModelChoiceField(
        queryset=SourceFinancement.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisir la source', 'class': 'form-control','id':'source'}),
        empty_label="Choisir la source",
        required=True,
        )
    montant_engage = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_engage', 'class': 'form-control format'}))
    montant_paye = forms.IntegerField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_engage', 'class': 'form-control format'}))
    objet = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'objet', 'class': 'form-control' })) 
    liasse = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}))   
    date_engagement =forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "date_adhesion:", 
               'class': 'form-control','min':'1958-01-01' ,'max':'2100-12-31','type':'date' })) 
    
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
        'credit': "Désole, le credit est insuffisant",
    }
    def clean(self): 

        ALLOWED_TYPES=['pdf','jpeg','jpg','png']
        
        contribution=self.cleaned_data.get('contribution')
        montant_engage = self.cleaned_data.get('montant_engage') 
        exercice = self.cleaned_data.get('exercice') 
        objet = self.cleaned_data.get('objet') 
        source = self.cleaned_data.get('source') 
        liasse = self.request.FILES.get('liasse')
        date_engagement=self.cleaned_data.get('date_engagement')
        etat=EtatDossier.objects.get(code='01')
        engagement=Engagement()
        engagement.exercice=exercice
        engagement.organisation=contribution.organisation
        engagement.contribution_apaye=contribution
        engagement.objet=objet
        engagement.date_engagement=date_engagement
        engagement.etat_dossier=etat
        engagement.devise=contribution.devise
        engagement.objet=objet
        engagement.montant_paye=0
        credit=LigneGblobale.objects.get(exercice=exercice)
        if int(montant_engage.replace(" ","")) <=credit.credit_disponible :
            if source.code == '1' :
                taux=Taux.objects.get(devise=contribution.devise)
                credit.credit_disponible=credit.credit_disponible-int(montant_engage.replace(" ","")) * taux.taux
            engagement.montant_engage=int(montant_engage.replace(" ",""))
        else:
            raise self.get_error('credit')
        engagement.source_financement=source
        filename_doc = f"bon_engagement_{engagement.date_engagement}.{liasse.name.split('.')[1]}"
        extension=liasse.name.split('.')[1]
        if extension.lower() not in ALLOWED_TYPES:
            messages.error(self.request,f"L'extension du fichier {liasse.name} n'est pas autorisée.Les exensions autorisées sont:{ALLOWED_TYPES}")
            return redirect('engagement')
        if liasse.size > 20000000 :
            messages.error(self.request,f"La taille du fichier {liasse.name} est trop grand {round(liasse.size/2048)} Mo: La taille ne doit pas depasser 2Mo")
            return redirect('engagement') 
        dir_name=f'DOCUMENTS/ENGAGEMENT/{contribution.organisation.sigle}'
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)  
        lien_doc = f"{dir_name}/{filename_doc}" 
        with open(lien_doc,'wb+') as destination:
            for chunk in liasse.chunks():
                destination.write(chunk)
        engagement.bordereau_engagement  = lien_doc
        engagement.save() 
        credit.save()
        rep=f"{engagement}"
        dossier=f"{'ENGAGEMENT'}"
        repertoire =Dossier.objects.filter(nom_dossier='ENGAGEMENT').first()
        if repertoire is None:
            repertoire=Dossier()
            repertoire.nom_dossier='ENGAGEMENT'
            repertoire.save()
            # sous_repertoire
        sousrepertoire=Dossier.objects.filter(parent_dossier=repertoire,nom_dossier=contribution.organisation.sigle).first()
        if sousrepertoire is None:
            sousrepertoire=Dossier()
            sousrepertoire.parent_dossier=repertoire
            sousrepertoire.nom_dossier=contribution.organisation.sigle
            sousrepertoire.save()
        # fichier
        bon_engagement=Fichier()
        bon_engagement.lien=lien_doc
        bon_engagement.nom_fichier=filename_doc
        bon_engagement.dossier=sousrepertoire
        bon_engagement.save()
        messages.success(self.request,'Engagement enregistré avec succes')
        return self.cleaned_data
    

class ModificationEngagementForms(forms.Form):
    exercice =  forms.ModelChoiceField(
        queryset=Exercice.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez la contribution à payer', 'class': 'form-control','id':'tutelle'}),
        empty_label="Choisissez un exercice",
        required=False,disabled=True,
        )
    contribution_op =  forms.ModelChoiceField(
        queryset=SituationFinanciere.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez la contribution à payer', 'class': 'form-control','id':'tutelle'}),
        empty_label="Choisissez un exercice",
        required=False,
        )
    devise =  forms.ModelChoiceField(
        queryset=Devise.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Devise', 'class': 'form-control','id':'devise'}),
        empty_label="Devise",
        required=False,disabled=True,
        )
    source =  forms.ModelChoiceField(
        queryset=SourceFinancement.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisir la source', 'class': 'form-control','id':'source'}),
        empty_label="Choisir la source",
        required=False,disabled=True,
        )
    etat_dossier =  forms.ModelChoiceField(
        queryset=EtatDossier.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisir la source', 'class': 'form-control','id':'source'}),
        empty_label="Choisir la source",
        required=False,
        )
    montant_engage = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_engage', 'class': 'form-control format'}),disabled=True)
    engagement = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'engagement', 'class': 'form-control format'}),disabled=True)
    montant_paye = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_paye', 'class': 'form-control format'}),required=False)
    objet = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'objet', 'class': 'form-control' })) 
    liasse = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}),required=False) 
    avis = forms.CharField(widget=forms.FileInput(
        attrs={'placeholder': 'lettre ', 'class': 'form-control', 'disabled': False}),required=False)   
    date_engagement =forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "date_adhesion:", 
               'class': 'form-control','min':'1958-01-01' ,'max':'2100-12-31','type':'date' }),disabled=True) 
    date_miseajour =forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "date_adhesion:", 
               'class': 'form-control','min':'1958-01-01' ,'max':'2100-12-31','type':'date' }),required=False) 
    
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
        'credit': "Désole, le credit est insuffisant",
        'montant_sup': "Désole, le montant payé doit pas etre superieur au montant engage",
    }
    def clean(self): 
        ALLOWED_TYPES=['pdf','jpeg','jpg','png']
        avis = self.request.FILES.get('avis')
        contribution= self.cleaned_data.get('contribution_op')
        montant_engage =  self.cleaned_data.get('montant_engage') 
        montant_paye =  self.cleaned_data.get('montant_paye')
        exercice =  self.cleaned_data.get('exercice')
        engagement= self.cleaned_data.get('engagement')
        objet =  self.cleaned_data.get('objet')
        devise =  self.cleaned_data.get('devise')
        etat =  self.cleaned_data.get('etat_dossier')
        date_miseajour=self.cleaned_data.get('date_miseajour')
        date_engagement=self.cleaned_data.get('date_engagement')
        eng = Engagement.objects.get(pk=engagement) 
        contrib=SituationFinanciere.objects.get(pk=contribution.pk)
        if engagement is None:
            raise self.get_error('libelle')
        eng.exercice= Exercice.objects.get(numero=exercice)
        eng.organisation=contrib.organisation
        eng.contribution_apaye=contrib    
        eng.montant_engage=int(montant_engage.replace(" ",""))
        if etat.code =='02':
            if int(montant_paye.replace(" ",""))> int(montant_engage.replace(" ","")):
                raise self.get_error('montant_sup')
            else:
                situtation=SituationFinanciere.objects.get(exercice=exercice,organisation=contrib.organisation)
               
                if situtation.paye is not None:
                    situtation.paye=situtation.paye+int(montant_paye.replace(" ",""))
                else:
                    situtation.paye=int(montant_paye.replace(" ",""))
                situtation.save()
            eng.montant_paye=int(montant_paye.replace(" ",""))
        elif etat.code == '03':
            credit=LigneGblobale.objects.get(exercice=exercice)
            tau=Taux.objects.get(devise=devise)
            montant=int(montant_engage.replace(" ","")) * tau.taux
            credit.credit_disponible=credit.credit_disponible+ montant
            credit.save()
        eng.objet=objet
        
        eng.date_engagement=date_engagement
        eng.date_miseajour=date_miseajour
        eng.etat_dossier=EtatDossier.objects.get(code=etat.code)
        if avis is not None:

            filename_doc = f"avis_paiement_{eng.date_miseajour}.{avis.name.split('.')[1]}"
            extension=avis.name.split('.')[1]
            if extension.lower() not in ALLOWED_TYPES:
                messages.error(self.request,f"L'extension du fichier {avis.name} n'est pas autorisée.Les exensions autorisées sont:{ALLOWED_TYPES}")
                return redirect('modification-engagement')
            if avis.size > 20000000 :
                messages.error(self.request,f"La taille du fichier {avis.name} est trop grand {round(avis.size/2048)} Mo: La taille ne doit pas depasser 2Mo")
                return redirect('modification-engagement') 
            dir_name=f'DOCUMENTS/ENGAGEMENT/{contribution.organisation.sigle}'
            if not os.path.exists(dir_name):
                os.makedirs(dir_name)  
            lien_doc = f"{dir_name}/{filename_doc}" 
            with open(lien_doc,'wb+') as destination:
                for chunk in avis.chunks():
                    destination.write(chunk)
            eng.bordereau_avis  = lien_doc
            rep=f"{engagement}"
            dossier=f"{'ENGAGEMENT'}"
            repertoire =Dossier.objects.filter(nom_dossier='ENGAGEMENT').first()
            if repertoire is None:
                repertoire=Dossier()
                repertoire.nom_dossier='ENGAGEMENT'
                repertoire.save()
                # sous_repertoire
            sousrepertoire=Dossier.objects.filter(parent_dossier=repertoire,nom_dossier=contribution.organisation.sigle).first()
            if sousrepertoire is None:
                sousrepertoire=Dossier()
                sousrepertoire.parent_dossier=repertoire
                sousrepertoire.nom_dossier=contribution.organisation.sigle
                sousrepertoire.save() 
                # fichier
            avis_paiement=Fichier()
            avis_paiement.lien=lien_doc
            avis_paiement.nom_fichier=filename_doc
            avis_paiement.dossier=sousrepertoire
            avis_paiement.save()
            eng.save()
            # user=Users.objects.get(service=situtation.organisation.tutelle)
            # context= {
            #         'exercice':eng.exercice,
            #         'organisation':eng.organisation.nom,
            #         'montant': montant_paye,
            #         'devise':eng.devise.code,
            #         'nom':user.full_name
                
            #         }
            # html_content= render_to_string('email/contribution.html',context)
            # send_mail(
            # '[eContrib] Paiement de contribution',
            # html_content,
            # '<noreply.econtrib.@gmail.com>',
            # [user.email],
            # html_message=html_content,
            # fail_silently = False,
            # ) 
        eng.save() 
        messages.success(self.request,'Mise à jour effectuée avec succes.') 
        return self.cleaned_data

        
        

class ConsultationEngagementForms(forms.Form):
    organisation =  forms.ModelChoiceField(
        queryset=Organisation.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez une Organisation', 'class': 'form-control','id':'tutelle'}),
        empty_label="Choisissez une Organisation",
        required=False,disabled=True
        )
    exercice =  forms.ModelChoiceField(
        queryset=Exercice.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez un exercice', 'class': 'form-control','id':'tutelle'}),
        empty_label="Choisissez un exercice",
        required=False,disabled=True
        )
    contribution =  forms.ModelChoiceField(
        queryset=SituationFinanciere.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez la contribution à payer', 'class': 'form-control','id':'tutelle'}),
        empty_label="Choisissez la contribution à payer",
        required=False,disabled=True
        )
    etat =  forms.ModelChoiceField(
        queryset=EtatDossier.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez l''Etat', 'class': 'form-control','id':'etat'}),
        empty_label="Choisissez le Niveau ",
        required=False,disabled=True
        )
    montant_engage = forms.CharField(max_length=40, widget=forms.TextInput(
        attrs={'placeholder': 'montant_engage', 'class': 'form-control format'}),disabled=True)
    montant_paye = forms.CharField(max_length=40, widget=forms.TextInput(
        attrs={'placeholder': 'montant_engage', 'class': 'form-control format'}),disabled=True)
    reference = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'reference', 'class': 'form-control' }),disabled=True)  
    objet = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'objet', 'class': 'form-control' }),disabled=True)    
    date_engagement =forms.DateField(widget=forms.DateInput(
                attrs={'placeholder': "date_adhesion:", 
               'class': 'form-control','min':'1958-01-01' ,'max':'2100-12-31','type':'date' }),disabled=True) 
    reference_ov = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'Reference ov', 'class': 'form-control' }),disabled=True)
    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        super().__init__(*args, **kwargs)

        
        


class LigneGlobaleForms(forms.Form):
    exercice =  forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': '', 'class': 'form-control format' }),disabled=True)
    montant_initial = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_initial', 'class': 'form-control format' }))
    montant_disponible = forms.IntegerField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_disponible', 'class': 'form-control format' }))
    
    montant_lfr = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_lfr', 'class': 'form-control format' }))
    
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
        'existe': "Cette ligne est deja chargée,vous pouvez la réajusté",
    }
    def clean(self):       
        exercice=self.cleaned_data.get('exercice')
        montant_initial = self.cleaned_data.get('montant_initial')
        ligne = LigneGblobale.objects.filter(exercice=exercice).first()    
        if ligne is not  None:
            raise self.get_error('existe')
        else:
            ligne=LigneGblobale()
            ligne.exercice=Exercice.objects.get(numero=exercice)
            ligne.credit_lfi=int(montant_initial.replace(" ",""))
            ligne.credit_actuel=int(montant_initial.replace(" ",""))
            ligne.credit_disponible=int(montant_initial.replace(" ",""))
            ligne.credit_lfr=0
        ligne.save()
        messages.success(self.request,'La ligne a été chargée avec succes')
        return self.cleaned_data
    

class LigneGlobaleLFRForms(forms.Form):
    exercice =  forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': '', 'class': 'form-control format' }),disabled=True)
    montant_initial = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_initial', 'class': 'form-control format' }))
    montant_disponible = forms.IntegerField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_disponible', 'class': 'form-control format' }))
    
    montant_lfr = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_lfr', 'class': 'form-control format' }))
    
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
        'existe': "Cette ligne est deja chargée,vous pouvez la réajusté",
    }
    def clean(self):       
        exercice=self.cleaned_data.get('exercice')
        montant_initial = self.cleaned_data.get('montant_initial')
        montant_lfr = self.cleaned_data.get('montant_lfr')  
        ligne = LigneGblobale.objects.filter(exercice=exercice).first()    
        if ligne is None:
            raise self.get_error('existe')
        else:
            ligne.exercice=Exercice.objects.get(numero=exercice)
            ligne.credit_lfi=int(montant_initial.replace(" ",""))
            ligne.credit_lfr=int(montant_lfr.replace(" ",""))
            ligne.credit_actuel=int(montant_lfr.replace(" ",""))
            ligne.credit_disponible=int(montant_lfr.replace(" ",""))
        ligne.save()
        messages.success(self.request,'La ligne a été chargée avec succes')
        return self.cleaned_data
    

class TransfertCreditForms(forms.Form):
    exercice =  forms.CharField(max_length=100, widget=forms.TextInput(
        attrs={'placeholder': '', 'class': 'form-control format' }),disabled=True)
    montant_initial = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_initial', 'class': 'form-control format' }),disabled=True)
    montant_dispo = forms.IntegerField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_disponible', 'class': 'form-control format' }),disabled=True)
    
    montant_lfr = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_lfr', 'class': 'form-control format' }),disabled=True)
    
    montant_actuel = forms.CharField(widget=forms.TextInput(
        attrs={'placeholder': 'montant_lfr', 'class': 'form-control format' }))
    
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
        'existe': "Cette ligne est deja chargée,vous pouvez la réajusté",
    }
    def clean(self):       
        exercice=self.cleaned_data.get('exercice')
        montant_initial = self.cleaned_data.get('montant_initial')
        montant_lfr = self.cleaned_data.get('montant_lfr') 
        montant_actuel = self.cleaned_data.get('montant_actuel')  
        ligne = LigneGblobale.objects.filter(exercice=exercice).first()    
        if ligne is None:
            raise self.get_error('existe')
        else:
            ligne.exercice=Exercice.objects.get(numero=exercice)
            ligne.credit_actuel=int(montant_actuel.replace(" ",""))
            ligne.credit_disponible=int(montant_actuel.replace(" ",""))
        ligne.save()
        messages.success(self.request,'Le transfert est prise en charge avec succes')
        return self.cleaned_data
    
    



class FiltreSituationForms(forms.Form):
    exercice = forms.ModelChoiceField(
        queryset=Exercice.objects.filter(statut='FER'),
        widget=forms.Select(attrs={'placeholder': 'Exercice', 'class': 'form-control'}),
        empty_label="Exercice",
        required=False
        )
    error_messages = {
    }    
    def __init__(self, request=None,queryset=None, *args, **kwargs):
        self.request = request
        self.queryset = queryset
        super().__init__(*args, **kwargs)

class FiltrePlanEngagementForms(forms.Form):
    exercice = forms.ModelChoiceField(
        queryset=Exercice.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Exercice', 'class': 'form-control'}),
        empty_label="Exercice",
        required=False
        )
    error_messages = {
    }    
    def __init__(self, request=None,queryset=None, *args, **kwargs):
        self.request = request
        self.queryset = queryset
        super().__init__(*args, **kwargs)

class PlanEngagementForms(forms.Form):
    exercice =  forms.ModelChoiceField(
        queryset=Exercice.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez l''Exercice', 'class': 'form-control','id':'etat'}),
        empty_label="Choisissez le Niveau ",
        required=False,
        )
    periode =  forms.ModelChoiceField(
        queryset=Periode.objects.all(),
        widget=forms.Select(attrs={'placeholder': 'Choisissez la periode', 'class': 'form-control','id':'periode '}),
        empty_label="Choisissez la periode ",
        required=False,
        )
    
    montant = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'telephone', 'class': 'form-control format' }))
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
        'code_existe': "Ce plan d'engagement existe. ",
        'libelle': "Le Libelle du type existe deja",
    }
    def clean(self):       
        exercice=self.cleaned_data.get('exercice')
        periode=self.cleaned_data.get('periode')
        montant = self.cleaned_data.get('montant') 
        plan = PlanEngagement.objects.filter(exercice=exercice,periode=periode).first()    
        if plan is not None:
            raise self.get_error('code_existe')
        plan=PlanEngagement()
        plan.exercice=exercice
        plan.periode=periode
        plan.montant=int(montant.replace(" ",""))
        plan.save()  
        messages.success(self.request,'Le plan d''engagement  est créé avec succes')
        return self.cleaned_data
    


class ModificationTutelleForms(forms.Form):
    cd_tutelle = forms.CharField(max_length=10, widget=forms.TextInput(
        attrs={'placeholder': 'cd_tutelle', 'class': 'form-control' }),disabled=True)
    libelle = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'libelle', 'class': 'form-control' }))
    email = forms.CharField(max_length=255, widget=forms.EmailInput(
        attrs={'placeholder': 'Adresse email', 'class': 'form-control' }),required=True)
    telephone = forms.CharField(max_length=500, widget=forms.TextInput(
        attrs={'placeholder': 'telephone', 'class': 'form-control' }))
    type = forms.ModelChoiceField(queryset=TypeTutelle.objects.all(),widget=forms.Select(attrs={'placeholder': 'Type de la Tutelle', 'class': 'form-control'})
                                  ,empty_label="Type de la Tutelle",required=True)    

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
        cd_tutelle=self.cleaned_data.get('cd_tutelle')
        email=self.cleaned_data.get('email')
        telephone=self.cleaned_data.get('telephone')
        libelle = self.cleaned_data.get('libelle') 
        type = self.cleaned_data.get('type') 
        tutelle = Tutelle.objects.filter(type=type,cd_tutelle=cd_tutelle).first()    
        if tutelle is  None:
            raise self.get_error('libelle')
        if tutelle.libelle != libelle:     
            create_mouchard(nom_table='TUTELLE',nom_colonne='libelle',cle_avant=cd_tutelle,cle_apres=cd_tutelle,
                    user=self.request.user,
                    valeur_avant=tutelle.libelle,valeur_apres=libelle
            )
        if tutelle.email != email:     
            create_mouchard(nom_table='TUTELLE',nom_colonne='email',cle_avant=cd_tutelle,cle_apres=cd_tutelle,
                    user=self.request.user,
                    valeur_avant=tutelle.email,valeur_apres=email
            )
        if tutelle.telephone != telephone:     
            create_mouchard(nom_table='TUTELLE',nom_colonne='tuelle',cle_avant=cd_tutelle,cle_apres=cd_tutelle,
                    user=self.request.user,
                    valeur_avant=tutelle.telephone,valeur_apres=telephone
            )
        if tutelle.type != type:     
            create_mouchard(nom_table='TUTELLE',nom_colonne='type',cle_avant=cd_tutelle,cle_apres=cd_tutelle,
                    user=self.request.user,
                    valeur_avant=tutelle.type,valeur_apres=type
            )
        tutelle.cd_tutelle=cd_tutelle
        tutelle.email=email
        tutelle.telephone=telephone
        tutelle.type=type
        tutelle.libelle=libelle
        tutelle.save()  
        messages.success(self.request,'Modification effectuée avec succes')
        return self.cleaned_data
