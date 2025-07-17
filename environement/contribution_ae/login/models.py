from django.db import models
# from django.contrib.contenttypes import GenericForeignkey
from django.contrib.contenttypes.models import ContentType
from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser,Group,Permission
# Create your models here.
from gestion.models import Organisation,Tutelle,Statut

class Service(models.Model):
    code = models.CharField(primary_key=True,max_length=10)
    libelle = models.CharField(max_length=255)
    class Meta:
            db_table = 'service'
            verbose_name= 'Service'
    def __str__(self):
            return "{} {}".format(self.code,self.libelle)

class Titre(models.Model):
    code = models.CharField(primary_key=True,max_length=10)
    libelle = models.CharField(max_length=255)
    class Meta:
            db_table = 'titre'
            verbose_name= 'Titre'
    def __str__(self):
            return "{}".format(self.libelle)

class Users(AbstractUser):
   
    id = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
    is_reseted = models.BooleanField(default=True)
    telephone = models.CharField(max_length=255,null=True)
    groupe = models.ForeignKey(Group,on_delete=models.CASCADE,null=True)
    service = models.ForeignKey(Tutelle,on_delete=models.CASCADE,null=True)
    titre = models.ForeignKey(Titre,on_delete=models.CASCADE,null=True)  
    class Meta:
        db_table = 'users'
        verbose_name= 'utilisateur'

    def __str__(self):
        return "{}".format(self.username)

    def full_name(self):
        return "{} {}".format(self.first_name,self.last_name)


class Mouchard(models.Model):
    operation = models.CharField(max_length=255)
    nom_table = models.CharField(max_length=255)
    nom_colonne = models.CharField(max_length=255)
    cle_avant = models.CharField(max_length=255)
    cle_apres = models.CharField(max_length=255)
    user = models.CharField(max_length=255)
    valeur_avant = models.CharField(max_length=255,null=True)
    valeur_apres = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'mouchard'
        verbose_name= 'Mouchard'
    def __str__(self):
        return "{} {}".format(self.nom_table,self.valeur_apres)


class Notification(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4)
    type = models.CharField(max_length=255)
    flag_envoye = models.BooleanField(default=False)
    date_envoi = models.DateTimeField(null=True)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    destinateur = models.CharField(max_length=255)
    class Meta:
        db_table = 'notification'
        verbose_name= 'notification'


class Commentaire_tutelle(models.Model):
    organisation = models.ForeignKey(Organisation,on_delete=models.CASCADE,null=False)
    auteur = models.ForeignKey(Users,on_delete=models.CASCADE,null=False)
    objet = models.CharField(max_length=1000)
    commentaire = models.CharField(max_length=1000)
    date_analyse=models.DateTimeField(auto_now_add=True)
    statut = models.ForeignKey(Statut,on_delete=models.CASCADE,null=False)
    date_val=models.DateTimeField(null=True)
    validateur = models.CharField(max_length=1000)
    class Meta:
            db_table = 'commentaire_tutelle'
            verbose_name= 'commentaire_tutelle'
    def __str__(self):
            return "{} {}".format(self.organisation,self.auteur)
