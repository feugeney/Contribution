from datetime import date
from datetime import datetime
from faulthandler import disable
import os
from tokenize import group
from urllib import request
from django import forms
import re
from django.shortcuts import redirect
from django.utils import timezone
from django.contrib.auth import (password_validation,login)
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from rolepermissions.checkers import has_role
from django.db import transaction
from django.contrib import messages
from django.contrib.auth.models import User
from ged.models import *





class FiltreDocumentForms(forms.Form):
    cd_source_info = forms.CharField(max_length=7, widget=forms.TextInput(
        attrs={'placeholder': 'Code', 'class': 'form-control'}),required=False)    
    lib_long_source_info = forms.CharField(max_length=20, widget=forms.TextInput(
        attrs={'placeholder': 'Libelle Source Information', 'class': 'form-control'}),required=False)         
    error_messages = {
    }    
    def __init__(self, request=None,queryset=None, *args, **kwargs):
        self.request = request
        self.queryset = queryset
        super().__init__(*args, **kwargs)

    def clean(self):
        cd_source_info = self.cleaned_data.get('cd_source_info')
        lib_long_source_info = self.cleaned_data.get('lib_long_source_info')
        return self.cleaned_data
        
    def get_error(self,code_erreur):
        messages.error(self.request,self.error_messages[code_erreur])
        return ValidationError(
            self.error_messages[code_erreur],
            code=code_erreur
            )




