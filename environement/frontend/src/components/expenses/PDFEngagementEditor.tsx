import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Edit, Save, Printer, Eye } from 'lucide-react';

interface EngagementPDF {
  id: string;
  numero: string;
  objet: string;
  montant: number;
  beneficiaire: string;
  statut: string;
  date_creation: string;
  template_data: {
    exercice: string;
    section: string;
    titre: string;
    chapitre: string;
    article: string;
    paragraphe: string;
    credit_disponible: number;
    objet_detaille: string;
    type_beneficiaire: string;
    raison_sociale: string;
    adresse: string;
    banque: string;
    agence: string;
    numero_compte: string;
    pieces_jointes: string[];
    precomptes: string;
    signature_ordonnateur: string;
    cachet_service: string;
  };
}

const mockEngagement: EngagementPDF = {
  id: '1',
  numero: 'ENG-2024-001',
  objet: 'Fournitures de bureau pour le trimestre',
  montant: 500000,
  beneficiaire: 'Société ABC',
  statut: 'brouillon',
  date_creation: '2024-01-15',
  template_data: {
    exercice: '2024',
    section: '18',
    titre: 'Titre 2 - Charges de fonctionnement',
    chapitre: 'Chapitre 1 - Biens et services',
    article: 'Article 10 - Fournitures',
    paragraphe: 'Paragraphe 01 - Fournitures de bureau',
    credit_disponible: 2000000,
    objet_detaille: 'Acquisition de fournitures de bureau pour les besoins du service administratif au titre du premier trimestre 2024',
    type_beneficiaire: 'Personne morale',
    raison_sociale: 'Société ABC SARL',
    adresse: 'Kaloum, Conakry - République de Guinée',
    banque: 'Banque Centrale de la République de Guinée',
    agence: 'Agence Centrale Kaloum',
    numero_compte: 'GN058 0001 0000 0000 0123 4567',
    pieces_jointes: [
      'Facture proforma',
      'Devis détaillé',
      'Attestation de régularité fiscale',
      'Registre de commerce'
    ],
    precomptes: 'TVA: 18% - Précompte IRPP: 10%',
    signature_ordonnateur: '',
    cachet_service: ''
  }
};

export const PDFEngagementEditor = () => {
  const { toast } = useToast();
  const [engagement, setEngagement] = useState<EngagementPDF>(mockEngagement);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(engagement.template_data);

  const handleSave = () => {
    setEngagement(prev => ({
      ...prev,
      template_data: editableData
    }));
    setIsEditing(false);
    toast({
      title: "Modifications sauvegardées",
      description: "Les modifications ont été appliquées au document PDF.",
    });
  };

  const handleGeneratePDF = () => {
    toast({
      title: "PDF généré",
      description: "Le document PDF a été généré et est prêt pour téléchargement.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Éditeur PDF d'Engagement</h1>
        <p className="text-purple-100">
          Modification et génération de documents PDF officiels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aperçu du document */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Aperçu du document
              </CardTitle>
              <Badge variant="secondary">{engagement.numero}</Badge>
            </div>
          </CardHeader>
          <CardContent className="max-h-[700px] overflow-y-auto">
            <div className="bg-white border p-6 text-sm font-mono">
              {/* En-tête officiel */}
              <div className="text-center mb-6 border-b pb-4">
                <h2 className="font-bold text-lg">RÉPUBLIQUE DE GUINÉE</h2>
                <p className="text-sm">Ministère de l'Économie et des Finances</p>
                <p className="text-sm">Direction Nationale du Budget</p>
                <div className="mt-4">
                  <h3 className="font-bold text-base underline">FICHE D'ENGAGEMENT</h3>
                </div>
              </div>

              {/* Numéro et date */}
              <div className="flex justify-between mb-4">
                <div>
                  <strong>N° Engagement:</strong> {engagement.numero}
                </div>
                <div>
                  <strong>Date:</strong> {new Date().toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Exercice et imputation */}
              <div className="mb-4">
                <h4 className="font-bold mb-2">IMPUTATION BUDGÉTAIRE</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Exercice:</strong> {editableData.exercice}</div>
                  <div><strong>Section:</strong> {editableData.section}</div>
                  <div className="col-span-2"><strong>Titre:</strong> {editableData.titre}</div>
                  <div className="col-span-2"><strong>Chapitre:</strong> {editableData.chapitre}</div>
                  <div className="col-span-2"><strong>Article:</strong> {editableData.article}</div>
                  <div className="col-span-2"><strong>Paragraphe:</strong> {editableData.paragraphe}</div>
                </div>
              </div>

              {/* Crédit disponible */}
              <div className="mb-4">
                <strong>Crédit disponible:</strong> {formatCurrency(editableData.credit_disponible)}
              </div>

              {/* Objet */}
              <div className="mb-4">
                <h4 className="font-bold mb-2">OBJET</h4>
                <p className="text-justify">{editableData.objet_detaille}</p>
              </div>

              {/* Bénéficiaire */}
              <div className="mb-4">
                <h4 className="font-bold mb-2">BÉNÉFICIAIRE</h4>
                <div className="text-xs">
                  <div><strong>Type:</strong> {editableData.type_beneficiaire}</div>
                  <div><strong>Raison sociale:</strong> {editableData.raison_sociale}</div>
                  <div><strong>Adresse:</strong> {editableData.adresse}</div>
                </div>
              </div>

              {/* Coordonnées bancaires */}
              <div className="mb-4">
                <h4 className="font-bold mb-2">COORDONNÉES BANCAIRES</h4>
                <div className="text-xs">
                  <div><strong>Banque:</strong> {editableData.banque}</div>
                  <div><strong>Agence:</strong> {editableData.agence}</div>
                  <div><strong>N° Compte:</strong> {editableData.numero_compte}</div>
                </div>
              </div>

              {/* Montant */}
              <div className="mb-4 text-center border p-2">
                <strong>MONTANT: {formatCurrency(engagement.montant)}</strong>
              </div>

              {/* Pièces jointes */}
              <div className="mb-4">
                <h4 className="font-bold mb-2">PIÈCES JOINTES</h4>
                <ul className="text-xs list-disc ml-4">
                  {editableData.pieces_jointes.map((piece, index) => (
                    <li key={index}>{piece}</li>
                  ))}
                </ul>
              </div>

              {/* Précomptes */}
              <div className="mb-4">
                <h4 className="font-bold mb-2">PRÉCOMPTES</h4>
                <p className="text-xs">{editableData.precomptes}</p>
              </div>

              {/* Signatures */}
              <div className="mt-8 flex justify-between">
                <div className="text-center">
                  <p className="mb-8 text-xs">L'Ordonnateur</p>
                  <div className="border-t w-32 mx-auto pt-1 text-xs">
                    Signature et cachet
                  </div>
                </div>
                <div className="text-center">
                  <p className="mb-8 text-xs">Le Contrôleur Financier</p>
                  <div className="border-t w-32 mx-auto pt-1 text-xs">
                    Signature et cachet
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panneau d'édition */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Édition des données
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Aperçu' : 'Modifier'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGeneratePDF}
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="max-h-[700px] overflow-y-auto">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercice">Exercice</Label>
                    <Input
                      id="exercice"
                      value={editableData.exercice}
                      onChange={(e) => setEditableData(prev => ({...prev, exercice: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      value={editableData.section}
                      onChange={(e) => setEditableData(prev => ({...prev, section: e.target.value}))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="titre">Titre</Label>
                  <Input
                    id="titre"
                    value={editableData.titre}
                    onChange={(e) => setEditableData(prev => ({...prev, titre: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="objet_detaille">Objet détaillé</Label>
                  <Textarea
                    id="objet_detaille"
                    rows={3}
                    value={editableData.objet_detaille}
                    onChange={(e) => setEditableData(prev => ({...prev, objet_detaille: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="raison_sociale">Raison sociale</Label>
                  <Input
                    id="raison_sociale"
                    value={editableData.raison_sociale}
                    onChange={(e) => setEditableData(prev => ({...prev, raison_sociale: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    value={editableData.adresse}
                    onChange={(e) => setEditableData(prev => ({...prev, adresse: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="banque">Banque</Label>
                  <Input
                    id="banque"
                    value={editableData.banque}
                    onChange={(e) => setEditableData(prev => ({...prev, banque: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="numero_compte">Numéro de compte</Label>
                  <Input
                    id="numero_compte"
                    value={editableData.numero_compte}
                    onChange={(e) => setEditableData(prev => ({...prev, numero_compte: e.target.value}))}
                  />
                </div>

                <div>
                  <Label htmlFor="precomptes">Précomptes</Label>
                  <Textarea
                    id="precomptes"
                    rows={2}
                    value={editableData.precomptes}
                    onChange={(e) => setEditableData(prev => ({...prev, precomptes: e.target.value}))}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Mode aperçu activé</p>
                    <p className="text-sm text-gray-500">Cliquez sur "Modifier" pour éditer le document</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={handleGeneratePDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
