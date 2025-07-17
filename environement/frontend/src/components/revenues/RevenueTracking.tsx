
import { useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockRevenues } from '@/data/mockData';
import { CreateRevenueForm } from './CreateRevenueForm';

export const RevenueTracking = () => {
  const [revenues] = useState(mockRevenues);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'subvention': 'Subvention',
      'taxes': 'Taxes et redevances',
      'financement_externe': 'Financement externe'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = {
      'subvention': 'bg-blue-100 text-blue-800',
      'taxes': 'bg-green-100 text-green-800',
      'financement_externe': 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredRevenues = revenues.filter(revenue => {
    const matchesSearch = revenue.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || revenue.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalRevenues = revenues.reduce((sum, revenue) => sum + revenue.montant, 0);

  const handleCreateRevenue = (data: any) => {
    console.log('Nouvelle recette:', data);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <CreateRevenueForm 
          onSubmit={handleCreateRevenue}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suivi des Recettes</h1>
          <p className="text-muted-foreground">
            Gestion des recettes - EPAC-001
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="space-x-2">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
          <Button onClick={() => setShowCreateForm(true)} className="space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nouvelle recette</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Résumé des Recettes</span>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenues)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['subvention', 'taxes', 'financement_externe'].map((type) => {
              const typeRevenues = revenues.filter(r => r.type === type);
              const typeTotal = typeRevenues.reduce((sum, r) => sum + r.montant, 0);
              return (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    {getTypeLabel(type)}
                  </div>
                  <div className="text-xl font-semibold">
                    {formatCurrency(typeTotal)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {typeRevenues.length} recette(s)
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher une recette..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de recette" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="subvention">Subvention</SelectItem>
                <SelectItem value="taxes">Taxes et redevances</SelectItem>
                <SelectItem value="financement_externe">Financement externe</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Recettes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRevenues.map((revenue) => (
                <TableRow key={revenue.id}>
                  <TableCell>
                    <Badge className={getTypeBadgeColor(revenue.type)}>
                      {getTypeLabel(revenue.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{revenue.source}</TableCell>
                  <TableCell>{formatCurrency(revenue.montant)}</TableCell>
                  <TableCell>
                    {new Date(revenue.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
