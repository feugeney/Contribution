import os
from django.conf import settings
from fpdf import FPDF
from datetime import datetime
from django.conf import settings
from gestion.sql import exportation
from collections import namedtuple
import unidecode

class PDF_Organisation(FPDF):
    def __init__(self, orientation='L', unit='mm', format='A4'):
        super().__init__(orientation=orientation, unit=unit, format=format)

    def header(self):
    
        self.set_font('Helvetica','B',10)
        self.set_y(10)
        self.set_x(5)
        self.cell(w=75, h=0,txt="REPUBLIQUE DE GUINEE",border=0, ln=0, align='C',fill=False)
        self.set_font('Helvetica','',8)
        self.set_text_color(255,0,0)
        self.set_y(14)
        self.set_x(5)
        self.cell(w=50, h=0,txt="Travail - ", border=0, ln=0, align='C',fill=False)
        self.set_text_color(242,214,13)
        self.set_y(14)
        self.set_x(15)
        self.cell(w=50, h=0,txt="Justice -", border=0, ln=0, align='C',fill=False)
        self.set_text_color(34,177,76)
        self.set_y(14)
        self.set_x(27)
        self.cell(w=50, h=0,txt="Solidarité", border=0, ln=0, align='C',fill=False)
        self.set_draw_color(0,0,0)
        self.set_line_width(0.3)
        self.line(37,12,50,12)
        self.set_text_color(0,0,0)
        self.set_font('Helvetica','B',9)
        self.set_y(17)
        self.set_x(15)
        self.multi_cell(w=55, h=4,txt="MINISTERE DES AFFAIRES ETRANGERES", border=0, align='C',fill=False)
        self.set_y(19)
        self.set_x(220)
        self.multi_cell(w=60, h=0,txt=f"CONAKRY, le {datetime.now().strftime('%d/%m/%Y').upper()}",border=0, align='C',fill=False)

       
    def fill(self):
        self.set_fill_color(114, 114, 116)
        self.set_text_color(255, 255, 255)
    def un_fill(self):
        self.set_fill_color(255, 255, 255)
        self.set_text_color(0,0,0)
    def body(self):
        self.add_page()
        
        self.set_font('Helvetica','', 12)
        self.set_y(30)
        self.set_x(10)
        self.set_fill_color(25, 25, 112)
        self.set_text_color(255, 255, 255)
        self.cell(w=276, h=10,txt=f"LISTE DES ORGANISATIONS",border=0, ln=0, align='C',fill=True)
        self.ln(40)
        self.set_xy(10,45)
        self.fill()
        self.set_font('Helvetica', 'B', 9)
        self.cell(10, 5,'N°', 1, 0, 'C', True)
        self.cell(107, 5,'LIBELLE', 1, 0, 'C', True)
        self.cell(20, 5,'SIGLE', 1, 0, 'C', True)
        self.cell(107, 5,'TUTELLE', 1, 0, 'C', True)
        self.cell(32, 5,'DATE D''ADHESION', 1, 0, 'C', True)
        self.un_fill()

        conn = exportation.connect()
        cur = conn.cursor()
        cur.execute('''
            select t1.cd_organisation, t1.nom, t1.sigle, t1.date_adhesion, t2.libelle
            from organisation t1, tutelle t2 
            where t1.tutelle_id like t2.cd_tutelle ''')
        # Récupération de tous les noms de colonnes
        column_names = [i[0] for i in cur.description]
        # Création d'une classe de tuple nommée avec les noms de colonne
        Row = namedtuple('Row', column_names)
        # Récupération tous les résultats
        datas = cur.fetchall()
        self.set_y(50)
        self.set_font('Helvetica', '', 9)
        for data in datas:
            row=Row(*data)            
            self.set_x(10)
            y = self.get_y()
            self.multi_cell(w=10, h=5,txt=f'{unidecode.unidecode(row.cd_organisation)}'.replace(',',' '),border=1, align='L',fill=True)
            ecart =  self.get_y()-y
            if ecart<0:
                ecart = 5
            self.set_y(self.get_y()-ecart)
            self.set_x(20)           
            self.cell(w=107, h=ecart,txt=f'{unidecode.unidecode(row.nom)}'.replace(',',' '),border=1, align='L',fill=True)
            self.set_x(127)           
            self.cell(w=20, h=ecart,txt=f'{unidecode.unidecode(row.sigle)}'.replace(',',' '),border=1, align='C',fill=True)
            self.set_x(147)           
            self.cell(w=107, h=ecart,txt=f'{unidecode.unidecode(row.libelle)}'.replace(',',' '),border=1, align='L',fill=True)
            self.set_x(254)           
            self.cell(w=32, h=ecart,txt=f'{row.date_adhesion.date()}'.replace(',',' '),border=1, align='R',fill=True)
            self.ln(ecart)
        cur.close()
        conn.close()
    # footer
    def footer(self):
        # Position cursor at 1.5 cm from bottom:
        self.set_y(-13)
        # Setting font: helvetica italic 8
        self.set_draw_color(0,0,0)
        self.set_line_width(0.7)
        self.line(12,285,202,285)
        self.set_line_width(0.2)
        self.line(12,286,202,286)
        self.set_font("helvetica", "I", 9)
        # Printing page number:
        self.cell(0, 10, f"© {datetime.now().strftime('%Y')} Direction", align="C")