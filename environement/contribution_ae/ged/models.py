from django.db import models

# Create your models here.
class Dossier(models.Model):
    parent_dossier=models.ForeignKey("self", on_delete=models.CASCADE, null=True, related_name="id_parent")
    nom_dossier = models.CharField(max_length=50,null=True)
    class Meta:
        db_table = 'dossier'
        verbose_name= ' Dossier'
    def full_name(self):
        return "{}".format(self.nom_dossier)

class Fichier(models.Model):
    dossier=models.ForeignKey(Dossier,on_delete=models.CASCADE,null=True)
    lien= models.CharField(max_length=355,null=True)
    nom_fichier=models.CharField(max_length=200,null=True)
    class Meta:
        db_table = 'fichier'
        verbose_name= ' Fichier'
    def full_name(self):
        return "{}".format(self.nom_fichier)