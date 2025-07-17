from django.db import models
# from django.contrib.contenttypes import GenericForeignkey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from login.models import *
from django.contrib.auth.models import AbstractUser,Group,Permission
import uuid
from django.contrib.auth.models import AbstractUser,Group,Permission
# Create your models here.

class Statut(models.Model):
    code = models.CharField(primary_key=True,max_length=10)
    libelle = models.CharField(max_length=10)
    class Meta:
            db_table = 'statut'
            verbose_name= 'Statut'
    def __str__(self):
            return "{}".format(self.libelle)
    

    
class Exercice(models.Model):
    numero = models.CharField(primary_key=True,max_length=10)
    statut = models.ForeignKey(Statut,on_delete=models.CASCADE,null=True)
    class Meta:
            db_table = 'exercice'
            verbose_name= 'Exercice'
    def __str__(self):
            return "{}".format(self.numero)

class TypeTutelle(models.Model):
    cd_type = models.CharField(primary_key=True,max_length=4)
    libelle = models.CharField(max_length=70)
    class Meta:
            db_table = 'type_tutelle'
            verbose_name= 'Type Tutelle'
    def __str__(self):
            return "{} {}".format(self.cd_type,self.libelle)


class Devise(models.Model):
    code = models.CharField(primary_key=True,max_length=4)
    libelle = models.CharField(max_length=70)

    class Meta:
            db_table = 'devise'
            verbose_name= 'Devise'
    def __str__(self):
            return "{}".format(self.code)
    
class Taux(models.Model):
    devise = models.ForeignKey(Devise,on_delete=models.CASCADE,null=True)
    taux = models.FloatField()
    class Meta:
            db_table = 'taux'
            verbose_name= 'taux'
    def __str__(self):
            return "{}".format(self.devise)

class SourceFinancement(models.Model):
    code = models.CharField(max_length=70)
    libelle = models.CharField(max_length=70)
    class Meta:
            db_table = 'source_financement'
            verbose_name= 'Source Financement'
    def __str__(self):
            return "{} {} ".format(self.code,self.libelle)


class Tutelle(models.Model):
    type = models.ForeignKey(TypeTutelle,on_delete=models.CASCADE,null=True)
    cd_tutelle = models.CharField(primary_key=True,max_length=4)
    libelle = models.CharField(max_length=150)
    email = models.CharField(max_length=100)
    telephone = models.CharField(max_length=70)
    class Meta:
            db_table = 'tutelle'
            verbose_name= 'Tutelle'
    def __str__(self):
            return "{}".format(self.libelle)
    



class Organisation(models.Model):
    tutelle = models.ForeignKey(Tutelle,on_delete=models.CASCADE,null=False)
    cd_organisation = models.CharField(primary_key=True,max_length=4)
    nom = models.CharField(max_length=200)
    sigle = models.CharField(max_length=80)
    siege = models.CharField(max_length=80)
    date_adhesion =  models.DateTimeField()
    document_adhesion = models.CharField(max_length=100)
    rib = models.CharField(max_length=100)
    Devise = models.ForeignKey(Devise,on_delete=models.CASCADE,null=False)
    Devise_2 = models.CharField(max_length=100)
    class Meta:
            db_table = 'organisation'
            verbose_name= ' Organisation'
    def __str__(self):
            return "{}".format(self.nom)


class SituationFinanciere(models.Model):
    exercice = models.ForeignKey(Exercice,on_delete=models.CASCADE,null=False)
    organisation = models.ForeignKey(Organisation,on_delete=models.CASCADE,null=False)
    contribution = models.BigIntegerField()
    arriere = models.BigIntegerField()
    devise= models.ForeignKey(Devise,on_delete=models.CASCADE,null=False)
    paye = models.BigIntegerField()
    reference_lettre =  models.CharField(max_length=200)

    class Meta:
            db_table = 'situation_financiere'
            verbose_name= ' Situation Financiere'
    def __str__(self):
            return "{} {}".format(self.exercice,self.organisation)
    

class LigneGblobale(models.Model):
    exercice = models.ForeignKey(Exercice,on_delete=models.CASCADE,null=False)
    credit_lfi = models.BigIntegerField()
    credit_lfr = models.BigIntegerField()
    credit_actuel = models.BigIntegerField()
    credit_disponible = models.BigIntegerField()
    class Meta:
            db_table = 'ligne_globale'
            verbose_name= ' Situation Financiere'
    def __str__(self):
            return "{}".format(self.pk)



class EtatDossier(models.Model):
    code = models.CharField(primary_key=True,max_length=4)
    libelle = models.CharField(max_length=70)

    class Meta:
            db_table = 'etat_dossier'
            verbose_name= 'Etat Dossier'
    def __str__(self):
            return "{} {}".format(self.code,self.libelle)
    

class Periode(models.Model):
    code = models.CharField(primary_key=True,max_length=4)
    libelle = models.CharField(max_length=70)

    class Meta:
            db_table = 'periode'
            verbose_name= 'Periode'
    def __str__(self):
            return "{} {}".format(self.code,self.libelle)
    
class PlanEngagement(models.Model):
    exercice = models.ForeignKey(Exercice,on_delete=models.CASCADE,null=False)
    periode = models.ForeignKey(Periode,on_delete=models.CASCADE,null=False)
    montant = models.BigIntegerField(null=False)
    class Meta:
            db_table = 'plan_engagement'
            verbose_name= ' Plan Engagement'
    def __str__(self):
            return "{} {} {}".format(self.exercice,self.periode,self.montant)
    
class Proposition_Plan(models.Model):
    exercice = models.ForeignKey(Exercice,on_delete=models.CASCADE,null=False)
    plan = models.ForeignKey(PlanEngagement,on_delete=models.CASCADE,null=False)
    organisation = models.ForeignKey(Organisation,on_delete=models.CASCADE,null=False)
    montant = models.BigIntegerField(null=False)
    class Meta:
            db_table = 'proposition_plan'
            verbose_name= ' Proposition Plan'
    def __str__(self):
            return "{} {} {}".format(self.exercice,self.plan,self.organisation)
    

    
class Engagement(models.Model):

    objet =  models.CharField(max_length=400)
    exercice = models.ForeignKey(Exercice,on_delete=models.CASCADE,null=False)
    organisation = models.ForeignKey(Organisation,on_delete=models.CASCADE,null=False)
    contribution_apaye = models.ForeignKey(SituationFinanciere,on_delete=models.CASCADE,null=False)
    devise = models.ForeignKey(Devise,on_delete=models.CASCADE,null=False)
    source_financement = models.ForeignKey(SourceFinancement,on_delete=models.CASCADE,null=False)
    montant_engage = models.BigIntegerField(null=False)
    montant_paye = models.BigIntegerField(null=True)
    date_engagement=models.DateTimeField()
    date_miseajour=models.DateTimeField(null=True)
    etat_dossier = models.ForeignKey(EtatDossier,on_delete=models.CASCADE,null=False)
    referenceov= models.CharField(max_length=20,null=True)
    bordereau_engagement = models.CharField(max_length=400)
    bordereau_avis = models.CharField(max_length=400)
    class Meta:
            db_table = 'engagement'
            verbose_name= 'Engagement'
    def __str__(self):
            return "{} {} {}".format(self.exercice,self.organisation,self.montant_engage)



class Lettre(models.Model):
    exercice = models.ForeignKey(Exercice,on_delete=models.CASCADE,null=True)
    expediteur = models.ForeignKey(Tutelle,on_delete=models.CASCADE,null=True)
    organisation = models.ForeignKey(Organisation,on_delete=models.CASCADE,null=False)
    date =  models.DateTimeField()
    document = models.CharField(max_length=100)
    class Meta:
            db_table = 'lettre'
            verbose_name= 'Lettre'
    def __str__(self):
            return "{} {}".format(self.expediteur,self.objects)
