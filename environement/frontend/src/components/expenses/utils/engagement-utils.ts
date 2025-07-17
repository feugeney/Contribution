
import { FormSection } from '../types/engagement';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-GN', {
    style: 'currency',
    currency: 'GNF',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getHeaderClasses = (activeSection: string, sections: FormSection[]): string => {
  const section = sections.find(s => s.id === activeSection);
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    indigo: 'bg-indigo-500 text-white',
  };
  
  return colorMap[section?.color || 'blue'] || 'bg-blue-500 text-white';
};

export const getActiveSectionClasses = (section: FormSection, isActive: boolean): string => {
  const colorMap: Record<string, string> = {
    blue: isActive ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'text-gray-600 hover:bg-gray-100',
    green: isActive ? 'bg-green-100 text-green-700 border border-green-300' : 'text-gray-600 hover:bg-gray-100',
    purple: isActive ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'text-gray-600 hover:bg-gray-100',
    orange: isActive ? 'bg-orange-100 text-orange-700 border border-orange-300' : 'text-gray-600 hover:bg-gray-100',
    indigo: isActive ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'text-gray-600 hover:bg-gray-100',
  };
  
  return colorMap[section.color] || (isActive ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'text-gray-600 hover:bg-gray-100');
};
