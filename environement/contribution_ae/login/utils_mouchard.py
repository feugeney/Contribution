
import random
import string
from datetime import datetime
from login.models import (Mouchard)
                        

def create_mouchard(nom_table,nom_colonne,cle_avant,cle_apres,user,valeur_avant,valeur_apres,operation='MODIFICATION'):
    mouchard = Mouchard()
    mouchard.operation = operation
    mouchard.nom_table=nom_table
    mouchard.nom_colonne=nom_colonne
    mouchard.cle_apres=cle_apres
    mouchard.cle_avant=cle_avant
    mouchard.user=user
    mouchard.valeur_avant=valeur_avant
    mouchard.valeur_apres = valeur_apres
    mouchard.save()
