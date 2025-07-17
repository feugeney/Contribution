from dataclasses import fields
import io
import json
import mimetypes
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
from django.core.serializers import serialize
from django.urls import reverse_lazy,reverse
from gestion.models import *
from .pdf.liste_organisation import PDF_Organisation
from login.forms import *
from login.models import Users
from django.db.models import Sum

from django.contrib.auth.mixins import LoginRequiredMixin,PermissionRequiredMixin
from rolepermissions.mixins import HasRoleMixin
from django.contrib import messages
from django.views.generic.edit import SingleObjectMixin
from django.http import FileResponse, HttpResponse, JsonResponse
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
from login.models import Users
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django import forms
from  .import forms
import re
from django.utils import timezone,dateformat
import xlsxwriter
from fpdf import FPDF

# Create your views here.

class ExerciceView (LoginRequiredMixin,views.FormView):
    template_name='creation_exercice.html'
    form_class = forms.ExerciceForms
    def get_success_url(self):
        return reverse ('liste-exercice')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    

class PlanEngagementView (LoginRequiredMixin,views.FormView):
    template_name='creation_plan_engagement.html'
    form_class = forms.PlanEngagementForms
    def get_success_url(self):
        return reverse ('liste-plan')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    
class HistoriquePlanView (LoginRequiredMixin,views.FormView):
    template_name='historique_plan.html'
    form_class = forms.FiltrePlanEngagementForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['plans'] = PlanEngagement.objects.filter(exercice__statut='ENC')
        return context
 
   
class ListeExerciceView (LoginRequiredMixin,views.FormView):
    template_name='liste_exercice.html'
    form_class = forms.ExerciceForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['exercices'] = Exercice.objects.all().order_by('-numero')
        return context
    

class CreationTutelleView (LoginRequiredMixin,views.FormView):
    template_name='creation_tutelle.html'
    form_class = forms.TutelleForms
    def get_success_url(self):
        return reverse ('creation-tutelle')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    
class ListeTutelleView (LoginRequiredMixin,views.FormView):
    template_name='liste_tutelle.html'
    form_class = forms.TutelleForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['structures2'] = TypeTutelle.objects.all()
        context['structures3'] = Tutelle.objects.all().order_by('cd_tutelle')
        return context
    
class CreationInstitutionView (LoginRequiredMixin,views.FormView):
    template_name='creation_institution.html'
    form_class = forms.InstitutionForms
    def get_success_url(self):
        return reverse ('creation-institution')
    def get_initial(self):
        initial =  super().get_initial()
        numero=Organisation.objects.all().count()
        num=numero + 1
        if num < 10:
                num=f"{'0'}{num}"
        initial['cd_organisation'] = num
        return initial
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

class DeviseView (LoginRequiredMixin,views.FormView):
    template_name='creation_devise.html'
    form_class = forms.DeviseForms
    def get_success_url(self):
        return reverse ('liste-devise')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

class ListeDeviseView (LoginRequiredMixin,views.FormView):
    template_name='liste_devise.html'
    form_class = forms.DeviseForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['devises'] = Devise.objects.all()
        return context

class ListeTauxView (LoginRequiredMixin,views.FormView):
    template_name='liste_taux.html'
    form_class = forms.MiseajourTauxForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['tauxs'] = Taux.objects.all()
        return context

class MisajourTauxView(LoginRequiredMixin,views.FormView):
    template_name='mise_ajourtaux.html'
    form_class = forms.MiseajourTauxForms
    success_url = reverse_lazy('liste-taux')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        taux =  Taux.objects.get(pk=self.kwargs.get('pk'))
        initial['devise'] = taux.devise
        initial['taux'] = taux.taux
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['taux'] = Taux.objects.get(pk=self.kwargs.get('pk'))
        return context   
    

class ModificationDeviseView(LoginRequiredMixin,views.FormView):
    template_name='modification_devise.html'
    form_class = forms.DeviseForms
    success_url = reverse_lazy('liste-taux')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        devise =  Devise.objects.get(pk=self.kwargs.get('pk'))
        initial['code'] = devise.code
        initial['libelle'] = devise.libelle
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['devise'] = Devise.objects.get(pk=self.kwargs.get('pk'))
        return context   
    
class ListeInstitutionView (LoginRequiredMixin,views.FormView):
    template_name='liste_institution.html'
    form_class = forms.TutelleForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['tutelles'] = Tutelle.objects.all()
        if self.request.user.groupe.name in 'tutelle':
            context['institutions'] = Organisation.objects.filter(tutelle=self.request.user.service)
        elif self.request.user.groupe.name in 'adm,agent,daf,dgrm,chefequipe':
            context['institutions'] = Organisation.objects.all().order_by('sigle')
        return context
    
class PriseEnChargeLettreView (LoginRequiredMixin,views.FormView):
    template_name='prise_lettre.html'
    form_class = forms.ReceptionLettreForms
    def get_success_url(self):
        return reverse ('prise-enchargelettre')
    def get_initial(self):
        initial =  super().get_initial()
        exe=Exercice.objects.get(statut='ENC')
        initial ['exercice'] = exe
        return initial
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['situations'] =serialize('json',SituationFinanciere.objects.filter(exercice__statut='ENC'))
        return context 


class ChargementLigneView (LoginRequiredMixin,views.FormView):
    template_name='chargement_ligne.html'
    form_class = forms.LigneGlobaleForms
    def get_success_url(self):
        return reverse ('chargement-ligne')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_initial(self):
        initial =  super().get_initial()
        exercice = Exercice.objects.get(statut='ENC')
        initial['exercice'] = exercice
        return initial
    
class ModificationChargementLigneView (LoginRequiredMixin,views.FormView):
    template_name='modification_ligne.html'
    form_class = forms.LigneGlobaleLFRForms
    def get_success_url(self):
        return reverse ('liste-ligne')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_initial(self):
        initial =  super().get_initial()
        ligne = LigneGblobale.objects.get(pk=self.kwargs.get('pk'))
        initial['exercice'] = ligne.exercice
        initial['montant_initial'] = ligne.credit_lfi
        initial['montant_lfr'] = 0 if ligne.credit_lfr is None else ligne.credit_lfr
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lignes'] = LigneGblobale.objects.get(pk=self.kwargs.get('pk'))
        return context 
    

class TransfertCreditView (LoginRequiredMixin,views.FormView):
    template_name='transfert_credit.html'
    form_class = forms.TransfertCreditForms
    def get_success_url(self):
        return reverse ('liste-ligne')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_initial(self):
        initial =  super().get_initial()
        ligne = LigneGblobale.objects.get(pk=self.kwargs.get('pk'))
        initial['exercice'] = ligne.exercice
        initial['montant_initial'] = ligne.credit_lfi
        initial['montant_lfr'] = 0 if ligne.credit_lfr is None else ligne.credit_lfr
        initial['montant_actuel'] = ligne.credit_actuel 
        initial['montant_dispo'] = ligne.credit_disponible 
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lignes'] = LigneGblobale.objects.get(pk=self.kwargs.get('pk'))
        return context 
    

    
class ListeLigneView (LoginRequiredMixin,views.FormView):
    template_name='liste_ligne.html'
    form_class = forms.LigneGlobaleForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['lignes'] = LigneGblobale.objects.all().order_by('-exercice')
        return context

class SituationFinanciereView (LoginRequiredMixin,views.FormView):
    template_name='situation_financiere.html'
    form_class = forms.TutelleForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        if self.request.user.groupe.name in 'tutelle':
            context['institutions'] = Organisation.objects.filter(tutelle=self.request.user.service)
            context['situations'] = SituationFinanciere.objects.filter(exercice__statut='ENC',organisation__tutelle=self.request.user.service).order_by('organisation__sigle')
            context['taux']=serialize('json',Taux.objects.all())
            context['institutions_json'] = serialize('json',Organisation.objects.filter(tutelle=self.request.user.service))
            context['situations_json'] = serialize('json',SituationFinanciere.objects.filter(exercice__statut='ENC',organisation__tutelle=self.request.user.service))
        else:
            context['institutions'] = Organisation.objects.all().order_by('sigle')
            context['situations'] = SituationFinanciere.objects.filter(exercice__statut='ENC').order_by('organisation__sigle')
            context['taux']=serialize('json',Taux.objects.all())
            context['institutions_json'] = serialize('json',Organisation.objects.all())
            context['situations_json'] = serialize('json',SituationFinanciere.objects.filter(exercice__statut='ENC'))
       
        return context
    


class HistoriqueSituationOrganisationView (LoginRequiredMixin,views.FormView):
    template_name='historique_situation.html'
    form_class = forms.TutelleForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['institutions'] = Organisation.objects.filter(cd_organisation=self.kwargs.get('pk'))
        context['historiques'] = SituationFinanciere.objects.filter(organisation__cd_organisation=self.kwargs.get('pk')).order_by('-exercice')
        context['paye']= SituationFinanciere.objects.filter(organisation__cd_organisation=self.kwargs.get('pk')).values('organisation__cd_organisation')\
                        .order_by('organisation__cd_organisation')\
                        .annotate(total=Sum('paye')).first()
        context['arriere']= SituationFinanciere.objects.filter(organisation__cd_organisation=self.kwargs.get('pk')).values('organisation__cd_organisation')\
                        .order_by('organisation__cd_organisation')\
                        .annotate(total=Sum('arriere')).first()
        context['institution_json']=serialize('json',Organisation.objects.filter(cd_organisation=self.kwargs.get('pk')))
        context['historique_json']=serialize('json',SituationFinanciere.objects.filter(organisation__cd_organisation=self.kwargs.get('pk')).order_by('-exercice'))
        context['taux_json']=serialize('json',Taux.objects.all())
     
        return context
    

class AffichageLettreView(View):
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        document = SituationFinanciere.objects.filter(pk=pk).first()
        file_type,_ = mimetypes.guess_type(document.reference_lettre)
        if document is None:
            return redirect('document-not-found')        
        return FileResponse(open(f'{document.reference_lettre}', 'rb'), content_type=file_type)


class AffichageDocumentView(View):
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        document = Organisation.objects.filter(pk=pk).first()
        file_type,_ = mimetypes.guess_type(document.document_adhesion)
        if document is None:
            return redirect('document-not-found')        
        return FileResponse(open(f'{document.document_adhesion}', 'rb'), content_type=file_type)
    

class AffichageRibView(View):
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        document = Organisation.objects.filter(pk=pk).first()
        file_type,_ = mimetypes.guess_type(document.rib)
        if document is None:
            return redirect('document-not-found')        
        return FileResponse(open(f'{document.rib}', 'rb'), content_type=file_type)


class AffichageLiasseEngaView(View):
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        document = Engagement.objects.filter(pk=pk).first()
        file_type,_ = mimetypes.guess_type(document.bordereau_engagement)
        if document is None:
            return redirect('document-not-found')        
        return FileResponse(open(f'{document.bordereau_engagement}', 'rb'), content_type=file_type)
    
class AffichageAvisView(View):
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        document = Engagement.objects.filter(pk=pk).first()
        file_type,_ = mimetypes.guess_type(document.bordereau_avis)
        if document is None:
            return redirect('document-not-found')        
        return FileResponse(open(f'{document.bordereau_avis}', 'rb'), content_type=file_type)

class ModificationInstitutionView(LoginRequiredMixin,views.FormView):
    template_name='modification_institution.html'
    form_class = forms.MoficationInstitutionForms
    success_url = reverse_lazy('liste-institution')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        institution = Organisation.objects.get(pk=self.kwargs.get('pk'))
        initial['cd_organisation'] = institution.cd_organisation
        initial['nom'] = institution.nom
        initial['tutelle'] = institution.tutelle
        initial['sigle'] = institution.sigle
        initial['siege'] = institution.siege
        initial['devise'] = institution.Devise
        initial['date_adhesion'] = None if institution.date_adhesion is None else institution.date_adhesion.strftime('%Y-%m-%d') 
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['institution'] = Organisation.objects.get(pk=self.kwargs.get('pk'))
        return context    


class ConsultationInstitutionView(LoginRequiredMixin,views.FormView):
    template_name='consultation_institution.html'
    form_class = forms.ConsultationInstitutionForms
    success_url = reverse_lazy('liste-institution')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        institution = Organisation.objects.get(pk=self.kwargs.get('pk'))
       
        initial['cd_organisation'] = institution.cd_organisation
        initial['nom'] = institution.nom
        initial['tutelle'] = institution.tutelle
        initial['sigle'] = institution.sigle
        initial['siege'] = institution.siege
        initial['devise'] = institution.Devise
        initial['date_adhesion'] = None if institution.date_adhesion is None else institution.date_adhesion.strftime('%Y-%m-%d') 
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['institution'] = Organisation.objects.get(pk=self.kwargs.get('pk'))
        return context 

class AcceuilView (LoginRequiredMixin,views.FormView):
    template_name='menus.html'
    form_class = forms.TutelleForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['institutions'] = Organisation.objects.all()
        context['situations'] = SituationFinanciere.objects.filter(exercice__statut='ENC')
        context['somme']= SituationFinanciere.objects.filter(exercice__statut='ENC').values('exercice__statut')\
                        .order_by('exercice__statut')\
                        .annotate(total=Sum('paye')).first()
        exo=Exercice.objects.filter(statut='ENC').first()
        if exo is not None:
            context['exercices'] = Exercice.objects.get(statut='ENC') 
        else:
            context['exercices']=None
        context['ligneglobale'] = LigneGblobale.objects.get(exercice__statut='ENC') if context['exercices'] is not None else 0
        context['engagement'] = Engagement.objects.filter(exercice__statut='ENC').values('exercice__statut')\
                        .order_by('exercice__statut')\
                        .annotate(total=Sum('montant_engage')).first()
        context['contributions_json']=serialize('json',SituationFinanciere.objects.filter(exercice__statut='ENC'))
        context['taux']=serialize('json',Taux.objects.all())
        context['engagement_json'] =serialize('json', Engagement.objects.filter(exercice__statut='ENC'))
        context['somme_payee']= serialize('json',SituationFinanciere.objects.filter(exercice__statut='ENC'))               
        return context
    

class ModificationExerciceView(LoginRequiredMixin,views.FormView):
    template_name='modification_exercice.html'
    form_class = forms.ExerciceForms
    success_url = reverse_lazy('liste-exercice')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        exercice = Exercice.objects.get(pk=self.kwargs.get('pk'))
        initial['numero'] = exercice.numero
        initial['statut'] = exercice.statut 
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['exercice'] = Exercice.objects.get(pk=self.kwargs.get('pk'))
        return context 
    
class EngagementView (views.FormView):
    template_name='engagement.html'
    form_class = forms.EngagementForms
    def get_success_url(self):
        return reverse ('liste-engagement-instance')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_initial(self):
        initial =  super().get_initial()
        ligne = LigneGblobale.objects.get(exercice__statut='ENC')
        initial['exercice'] = ligne.exercice
        source=SourceFinancement.objects.get(code=1)
        initial ['source'] = source
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        ligne = LigneGblobale.objects.get(exercice__statut='ENC')
        context['montant_dispo']=ligne.credit_disponible 
        context['organisation']=serialize('json',SituationFinanciere.objects.all())
        return context
class EngagementInstanceView (LoginRequiredMixin,views.FormView):
    template_name='liste_engagement_instance.html'
    form_class = forms.EngagementForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['engagements']= Engagement.objects.filter(etat_dossier='01',exercice__statut ='ENC').order_by('id')
        return context
    
class EngagementPayerView (LoginRequiredMixin,views.FormView):
    template_name='liste_engagement_payer.html'
    form_class = forms.EngagementForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['engagements']= Engagement.objects.filter(etat_dossier='02',exercice__statut='ENC').order_by('id')
        return context

class EngagementRejeterView (LoginRequiredMixin,views.FormView):
    template_name='liste_engagement_rejeter.html'
    form_class = forms.EngagementForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['engagements']= Engagement.objects.filter(etat_dossier='03',exercice__statut='ENC').order_by('id')
        return context
    


class ModificationEngagementView(LoginRequiredMixin,views.FormView):
    template_name='modification_engagement.html'
    form_class = forms.ModificationEngagementForms
    success_url = reverse_lazy('liste-engagement-instance')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        engagement = Engagement.objects.get(pk=self.kwargs.get('pk'))
        initial['exercice'] = engagement.exercice
        initial['contribution_op'] = engagement.contribution_apaye 
        initial['objet'] = engagement.objet 
        initial['source'] = engagement.source_financement 
        initial['montant_engage'] = engagement.montant_engage 
        initial['etat_dossier'] = engagement.etat_dossier 
        initial['devise'] = engagement.devise
        initial['engagement'] = engagement.pk 
        initial['date_engagement'] = None if engagement.date_engagement is None else engagement.date_engagement.strftime('%Y-%m-%d') 
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['engagement'] = Engagement.objects.get(pk=self.kwargs.get('pk'))
        return context

class ConsultationEngagementView(LoginRequiredMixin,views.FormView):
    template_name='consultation_engagement.html'
    form_class = forms.ModificationEngagementForms
    success_url = reverse_lazy('menus')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        engagement = Engagement.objects.get(pk=self.kwargs.get('pk'))
        print(engagement.contribution_apaye)
        initial['exercice'] = engagement.exercice
        initial['contribution'] = engagement.contribution_apaye
        initial['objet'] = engagement.objet 
        initial['source'] = engagement.source_financement 
        initial['montant_engage'] = engagement.montant_engage 
        initial['etat_dossier'] = engagement.etat_dossier
        initial['devise'] = engagement.devise
        initial['montant_paye'] = 0 if engagement.montant_paye is None else engagement.montant_paye
        initial['engagement'] = engagement.pk 
        initial['date_engagement'] = None if engagement.date_engagement is None else engagement.date_engagement.strftime('%Y-%m-%d') 
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['engagement'] = Engagement.objects.get(pk=self.kwargs.get('pk'))
        return context 



class SituationEngagementView (views.FormView):
    template_name='situation_engagement.html'
    form_class = forms.TutelleForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['situation']=Engagement.objects.filter(contribution_apaye=self.kwargs.get('pk')).first()
        context['engagements'] = Engagement.objects.filter(contribution_apaye=self.kwargs.get('pk'))
        context['paye']= Engagement.objects.filter(contribution_apaye=self.kwargs.get('pk')).values('contribution_apaye')\
                        .order_by('contribution_apaye')\
                        .annotate(total=Sum('montant_paye')).first()
        return context

class HistoriqueSituationView (LoginRequiredMixin,list.MultipleObjectMixin,views.FormView):
    template_name='historique.html'
    form_class = forms.FiltreSituationForms
    queryset = []
    paginate_by = 40
    context_object_name = 'situations'
    success_url = reverse_lazy('liste-personnel')
    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        allow_empty = self.get_allow_empty()
        return super().get(request, *args, **kwargs)
    def form_valid(self, form):
        allow_empty = self.get_allow_empty()
        exercice=form.cleaned_data.get('exercice')
        if exercice is not None:
            if self.request.user.groupe.name in 'tutelle':
                self.queryset = SituationFinanciere.objects.filter(exercice=exercice.numero,organisation__tutelle=self.request.user.service)    
            else:
                self.queryset = SituationFinanciere.objects.filter(exercice=exercice.numero)    

        self.object_list = self.get_queryset()
        return self.render_to_response(self.get_context_data(form=form))
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        if self.request.user.groupe.name in 'tutelle':
            context['situations_json'] = serialize('json',SituationFinanciere.objects.filter(organisation__tutelle=self.request.user.service))
            context['taux']=serialize('json',Taux.objects.all())
        else:
            context['situations_json'] = serialize('json',SituationFinanciere.objects.all())
            context['taux']=serialize('json',Taux.objects.all())
        return context
    

class SimulationPlanView (views.FormView):
    template_name='simulation_plan.html'
    form_class = forms.PlanEngagementForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['situations'] = SituationFinanciere.objects.filter(exercice__statut='ENC')
        context['planens']=PlanEngagement.objects.filter(pk=self.kwargs.get('pk'))
        context['situations_json'] = serialize('json',SituationFinanciere.objects.filter(exercice__statut='ENC'))
        context['institution_json'] = serialize('json',Organisation.objects.all())
        context['taux']=serialize('json',Taux.objects.all())
        context['proposition_plan']=serialize('json',Proposition_Plan.objects.all())
        return context


class EnregistrmentProposition(LoginRequiredMixin,views.FormView):
    template_name='simulation_plan.html'
    form_class = forms.PlanEngagementForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get(self, request, *args, **kwargs):
        if request.method == 'GET':
            exo=self.request.GET.get('exercice')
            plan=PlanEngagement.objects.filter(pk=self.request.GET.get('plan')).first()
 
            tab_pro=self.request.GET.getlist('tab_pro[]')
            tab_orga=self.request.GET.getlist('tab_orga[]') 
            exercice_plan=Exercice.objects.filter(numero=exo).first()
            # pro_plan=Proposition_Plan.objects.filter(plan=plan).first()  
            for i in  range(len(tab_orga)):
                
                orga=Organisation.objects.filter(cd_organisation=tab_pro[i]).first()
                pro_plan=Proposition_Plan.objects.filter(organisation=orga,plan=plan,exercice=exercice_plan).first()
               
                if pro_plan is None:
                      
                        plan_p=Proposition_Plan() 
                        plan_p.exercice=exercice_plan
                        plan_p.plan=plan
                        plan_p.montant=int(tab_orga[i].replace(" ",""))
                        plan_p.organisation=orga
                        plan_p.save()
                else :
                    pro_plan.montant=int(tab_orga[i].replace(" ",""))
                    pro_plan.save() 
                message='Proposition enregistrer avec success'

        return redirect('enregistrement-proposition')
            




























# ******************EXPORTATION*********************


def situationconrente(request):
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet('Situation Courante')
    cell_num_format = workbook.add_format()
    cell_num_format.set_num_format('# ### ### ### ##0')
    bold = workbook.add_format({'bold': True})
    datejour=dateformat.format(timezone.now(), 'd-m-Y')
    doc=f"{'situation_contribution_du'}-{datejour}"
    situations = SituationFinanciere.objects.filter(exercice__statut__code='ENC')
    row = 1
    col = 0
    for situation in situations:
        taux=Taux.objects.get(devise=situation.devise)
        montant=int(situation.contribution) + int(situation.arriere)
        montant_du_gnf=int(montant)*int(taux.taux)
        paye_gnf=int(situation.paye)*int(taux.taux)
        reste_apaye= int(montant)-int(situation.paye)
        reste_du_gnf=int(reste_apaye)*int(taux.taux)
        worksheet.write(row, col, situation.exercice.numero)
        worksheet.write(row, col + 1, situation.organisation.nom)
        worksheet.write(row, col + 2, situation.organisation.sigle)
        worksheet.write(row, col + 3, situation.devise.code)
        worksheet.write(row, col + 4, situation.contribution,cell_num_format)
        worksheet.write(row, col + 5, situation.arriere,cell_num_format)
        worksheet.write(row, col + 6, montant,cell_num_format)
        worksheet.write(row, col + 7, montant_du_gnf,cell_num_format)
        worksheet.write(row, col + 8, situation.paye,cell_num_format)
        worksheet.write(row, col + 9, paye_gnf,cell_num_format)
        worksheet.write(row, col + 10, reste_apaye,cell_num_format)
        worksheet.write(row, col + 11, reste_du_gnf,cell_num_format)
        row += 1
        worksheet.write('A1', 'EXERCICE', bold)
        worksheet.write('B1', 'INSTITUTION', bold)
        worksheet.write('C1', 'SIGLE', bold)
        worksheet.write('D1', 'DEVISE', bold)
        worksheet.write('E1', 'CONTRIBUTION', bold)
        worksheet.write('F1', 'ARRIERE',bold)
        worksheet.write('G1', 'MONTANT DU DEVISE',bold)
        worksheet.write('H1', 'MONTANT DU GNF',bold )
        worksheet.write('I1', 'MONTANT PAYE',bold )
        worksheet.write('J1', 'MONTANT PAYE GNF',bold )
        worksheet.write('K1', 'RESTE PAYE',bold )
        worksheet.write('L1', 'RESTE PAYE GNF',bold )
        worksheet.set_column('A:A',5)
        worksheet.set_column('B:B',65)
        worksheet.set_column('C:C',10)
        worksheet.set_column('D:D',7)
        worksheet.set_column('E:E',15)
        worksheet.set_column('F:F',15)
        worksheet.set_column('G:G',15)
        worksheet.set_column('H:H',15)
        worksheet.set_column('I:I',15)
        worksheet.set_column('J:J',15)
        worksheet.set_column('K:K',15)
    workbook.close()
    output.seek(0)
    response = HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = "attachment; filename={0}.xlsx".format(doc)
    return response

def historique(request,pk):
    organisation=Organisation.objects.get(cd_organisation=pk)
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet('Historique des contributions')
    cell_num_format = workbook.add_format()
    cell_num_format.set_num_format('# ### ### ### ##0')
    bold = workbook.add_format({'bold': True})
    datejour=dateformat.format(timezone.now(), 'd-m-Y')
    doc=f"{'historique_contributions'}-{organisation.sigle}-{datejour}"
    situations = SituationFinanciere.objects.filter(organisation=pk)
    
    row = 1
    col = 0
    for situation in situations:
        montant=int(situation.contribution) + int(situation.arriere)
        reliquat=int(montant)- int(situation.paye)
        worksheet.write(row, col, situation.exercice.numero)
        worksheet.write(row, col + 1, situation.organisation.nom )
        worksheet.write(row, col + 2, situation.organisation.sigle)
        worksheet.write(row, col + 3, situation.devise.code)
        worksheet.write(row, col + 4, montant,cell_num_format)
        worksheet.write(row, col + 5, situation.paye,cell_num_format)
        worksheet.write(row, col + 6, reliquat,cell_num_format)
        row += 1
        worksheet.write('A1', 'EXERCICE', bold)
        worksheet.write('B1', 'INSTITUTION', bold)
        worksheet.write('C1', 'SIGLE', bold)
        worksheet.write('D1', 'DEVISE', bold)
        worksheet.write('E1', 'MONTANT A PAYER', bold)
        worksheet.write('F1', 'PAYE',bold)
        worksheet.write('G1', 'RELIQUAT',bold)
        worksheet.set_column('A:A',5)
        worksheet.set_column('B:B',70)
        worksheet.set_column('C:C',8)
        worksheet.set_column('D:D',6)
        worksheet.set_column('E:E',15)
        worksheet.set_column('F:F',11)
        worksheet.set_column('G:G',11)
        worksheet.set_column('H:H',11)
    workbook.close()
    output.seek(0)
    response = HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = "attachment; filename={0}.xlsx".format(doc)
    return response



def engagement(request):
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet('Situations des engagements')
    cell_num_format = workbook.add_format()
    cell_num_format.set_num_format('# ### ### ### ##0')
    bold = workbook.add_format({'bold': True})
    datejour=dateformat.format(timezone.now(), 'd-m-Y')
    doc=f"{'situation_engagement'}-{datejour}"
    engagements = Engagement.objects.filter(exercice__statut='ENC')
    
    row = 1
    col = 0
    for engagement in engagements:
        worksheet.write(row, col, engagement.exercice.numero)
        worksheet.write(row, col + 1, engagement.organisation.nom )
        worksheet.write(row, col + 2, engagement.organisation.sigle)
        worksheet.write(row, col + 3, engagement.objet)
        worksheet.write(row, col + 4, engagement.devise.code)
        worksheet.write(row, col + 5, engagement.montant_engage,cell_num_format)
        worksheet.write(row, col + 6, engagement.montant_paye,cell_num_format)
        row += 1
        worksheet.write('A1', 'EXERCICE', bold)
        worksheet.write('B1', 'INSTITUTION', bold)
        worksheet.write('C1', 'SIGLE', bold)
        worksheet.write('D1', 'OBJET', bold)
        worksheet.write('E1', 'DEVISE', bold)
        worksheet.write('F1', 'MONTANT ENGAGE',bold)
        worksheet.write('G1', 'MONTANT PAYE',bold)
        worksheet.set_column('A:A',5)
        worksheet.set_column('B:B',70)
        worksheet.set_column('C:C',8)
        worksheet.set_column('D:D',20)
        worksheet.set_column('E:E',10)
        worksheet.set_column('F:F',11)
        worksheet.set_column('G:G',11)
        worksheet.set_column('H:H',11)
    workbook.close()
    output.seek(0)
    response = HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = "attachment; filename={0}.xlsx".format(doc)
    return response

@login_required()
def liste_organisation(request):
    pdf = PDF_Organisation()
    pdf.body()
    response = HttpResponse(pdf.output(dest='S',name="liste_organisation.pdf").encode('latin-1'))
    response['Content-Type']='application/pdf'
    return response 




class ModificationTutelleView(LoginRequiredMixin,views.FormView):
    template_name='modification_tutelle.html'
    form_class = forms.ModificationTutelleForms
    success_url = reverse_lazy('liste-tutelle')
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs    
    def get_initial(self):
        initial =  super().get_initial()
        tutelle = Tutelle.objects.get(pk=self.kwargs.get('pk'))
        initial['cd_tutelle'] = tutelle.cd_tutelle
        initial['libelle'] = tutelle.libelle 
        initial['email'] = tutelle.email 
        initial['type'] = tutelle.type 
        initial['telephone'] = tutelle.telephone
        return initial
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['tutelle'] = tutelle = Tutelle.objects.get(pk=self.kwargs.get('pk'))
        return context 
    


class ListeCourriersRecusView (LoginRequiredMixin,views.FormView):
    template_name='liste_courier.html'
    form_class = forms.ReceptionLettreForms
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs
    def get_context_data(self, **  kwargs ):
        context = super().get_context_data(**kwargs)
        context['courriers'] = Lettre.objects.filter(exercice__statut='ENC').order_by('date')
        context['expediteurs'] = Tutelle.objects.all()
        return context
    
class AffichageCourrierView(View):
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        document = Lettre.objects.filter(pk=pk).first()
        file_type,_ = mimetypes.guess_type(document.document)
        if document is None:
            return redirect('document-not-found')        
        return FileResponse(open(f'{document.document}', 'rb'), content_type=file_type)