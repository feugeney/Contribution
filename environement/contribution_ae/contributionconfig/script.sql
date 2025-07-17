-- Groupe Utilisateur
insert into auth_group(name) values('adm');
insert into auth_group(name) values('agent');
insert into auth_group(name) values('chefequipe');
insert into auth_group(name) values('daf');
insert into auth_group(name) values('dgrm');
insert into auth_group(name) values('tutelle');



-- Titre
Insert into Titre(CODE, LIBELLE)
 Values
    ('MLLE', 'Mademoiselle'),
    ('M.', 'Monsieur'),
    ('M.', 'Madame');
COMMIT;

-- Periode
insert into Periode values (('02', '1er Trimestre'),('03', '2e Trimestre'),('04', '3e Trimestre'),('05', '4e Trimestre'));
COMMIT;


-- Statut
Insert into Statut(CODE, LIBELLE)
 Values
    ('ENC', 'Encours'),
    ('Fer', 'Ferme');
COMMIT;

-- Type Tutelle
Insert into type_tutelle(CODE, LIBELLE)
 Values
    ('1', 'Département'),
    ('2', 'Ambassade'),
    ('3', 'Autres');
COMMIT;



