
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateExpenseForm } from './CreateExpenseForm';
import { LiquidationForm } from './LiquidationForm';
import { OrdonnancementForm } from './OrdonnancementForm';
import { mockExpenses } from '@/data/mockData';
import { Expense } from '@/types/budget';

type WorkflowStep = 'list' | 'create' | 'liquidation' | 'ordonnancement';

export const ExpenseWorkflow = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('list');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenses] = useState(mockExpenses);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'engagement': 'Engagement',
      'liquidation': 'Liquidation',
      'ordonnancement': 'Ordonnancement',
      'paiement': 'Paiement'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      'engagement': 'bg-yellow-100 text-yellow-800',
      'liquidation': 'bg-blue-100 text-blue-800',
      'ordonnancement': 'bg-purple-100 text-purple-800',
      'paiement': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const canLiquidate = (expense: Expense) => expense.status === 'engagement';
  const canOrdonnancer = (expense: Expense) => expense.status === 'liquidation';

  const handleCreateExpense = (data: any) => {
    console.log('Nouvel engagement:', data);
    setCurrentStep('list');
  };

  const handleLiquidation = (data: any) => {
    console.log('Liquidation:', data);
    setCurrentStep('list');
    setSelectedExpense(null);
  };

  const handleOrdonnancement = (data: any) => {
    console.log('Ordonnancement:', data);
    setCurrentStep('list');
    setSelectedExpense(null);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'create':
        return (
          <CreateExpenseForm
            onSubmit={handleCreateExpense}
            onCancel={() => setCurrentStep('list')}
          />
        );
      case 'liquidation':
        return selectedExpense ? (
          <LiquidationForm
            expense={selectedExpense}
            onSubmit={handleLiquidation}
            onCancel={() => {
              setCurrentStep('list');
              setSelectedExpense(null);
            }}
          />
        ) : null;
      case 'ordonnancement':
        return selectedExpense ? (
          <OrdonnancementForm
            expense={selectedExpense}
            onSubmit={handleOrdonnancement}
            onCancel={() => {
              setCurrentStep('list');
              setSelectedExpense(null);
            }}
          />
        ) : null;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Workflow des Dépenses</span>
                <Button onClick={() => setCurrentStep('create')}>
                  Nouveau engagement
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{expense.libelle}</h3>
                        <p className="text-sm text-muted-foreground">
                          Montant: {formatCurrency(expense.montant)}
                        </p>
                      </div>
                      <Badge className={getStatusBadgeColor(expense.status)}>
                        {getStatusLabel(expense.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      {canLiquidate(expense) && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setCurrentStep('liquidation');
                          }}
                        >
                          Liquider
                        </Button>
                      )}
                      {canOrdonnancer(expense) && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setCurrentStep('ordonnancement');
                          }}
                        >
                          Ordonnancer
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Workflow des Dépenses</h1>
        <p className="text-muted-foreground">
          Gestion de la chaîne administrative des dépenses - EPAC-001
        </p>
      </div>
      {renderContent()}
    </div>
  );
};
