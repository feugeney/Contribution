# gpac

PLATEFORME DE SUIVI DU PAIEMENT DES CONTRIBUTIONS 

# *PLATEFORME DE SUIVI DU PAIEMENT DES CONTRIBUTIONS (****)
## Prerequis
- [python](https://www.python.org/) 
- [django](https://www.djangoproject.com/) 
- [postgresql](https://www.postgresql.org/) 

### 1 - creation de la BD
#### -  Depuis la console 
```
psql -U postgres
create user user_contribution WITH ENCRYPTED PASSWORD '12345678';
create database contributiondb owner user_contribution;
ALTER ROLE user_contribution SET client_encoding TO 'utf8';
ALTER ROLE user_contribution SET timezone TO 'UTC';
```
#### -  Se connecter depuis la console 
```
psql -U user_contribution -d contributiondb -h localhost
```

### Configuration Environnement developpement
```
py -m venv contrib_env
cd contrib_env
git clone https://fyomalo@bitbucket.org/eugeneyom/contribution_ae.git 
py -m pip install -r requirements.txt
py manage.py migrate
```

psql -U postgres -d contributiondb -f "C:\Users\feuge\OneDrive\Bureau\[Contribution]\environement\contribution_ae\backup_04042024.sql"                                                                                       
