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
from django.urls import reverse_lazy,reverse
from gestion.models import *
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
from ged.models import *
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django import forms
from  .import forms
import re 
from django.utils import timezone,dateformat
import xlsxwriter


class AcceuilView(list.MultipleObjectMixin,views.FormView):
    template_name='acceuil.html'
    form_class = forms.FiltreDocumentForms
    queryset = []
    paginate_by = 1000
    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        allow_empty = self.get_allow_empty()
        return super().get(request, *args, **kwargs)
    def get_context_data(self,*args, **kwargs):
        context = super().get_context_data(**kwargs)
        context['parents'] = Dossier.objects.filter(parent_dossier=None).order_by('nom_dossier')                                       
        return context


class RepertoireView (list.MultipleObjectMixin,views.FormView):
    template_name='repertoire_annee.html'
    form_class = forms.FiltreDocumentForms
    queryset = [] 
    paginate_by = 1000
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['queryset'] = self.queryset
        return kwargs
    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        allow_empty = self.get_allow_empty()
        return super().get(request, *args, **kwargs) 
    def get_context_data(self,*args, **kwargs):
        context = super().get_context_data(**kwargs)
        context['repertoires'] =Dossier.objects.filter(parent_dossier= self.kwargs.get('pk')).order_by('-nom_dossier')
        context['fichiers'] =   Fichier.objects.filter(dossier= self.kwargs.get('pk')).order_by('-nom_fichier')
        context['parents'] =   Dossier.objects.filter(id= self.kwargs.get('pk')).order_by('-nom_dossier')
        context['documents'] = Dossier.objects.filter(parent_dossier=None)                                       
        return context
        
    def form_valid(self, form):
        allow_empty = self.get_allow_empty()
        nom = form.cleaned_data.get('nom')
        if nom != '':
            self.queryset = self.get_queryset().filter(nom_dossier__istartswith=nom)
        self.object_list = self.queryset
        return self.render_to_response(self.get_context_data(form=form))





 

class AffichageGED(View):
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        fichier = Fichier.objects.filter(pk=pk).first()
        file_type,_ = mimetypes.guess_type(fichier.lien)
        if fichier is None:
            return redirect('document-not-found')        
        return FileResponse(open(f'{fichier.lien}', 'rb'), content_type=file_type)



