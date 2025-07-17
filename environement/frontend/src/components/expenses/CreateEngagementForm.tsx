
import { NewEngagementForm } from './NewEngagementForm';
import { NewEngagementFormData } from './types/engagement';

interface CreateEngagementFormProps {
  onSubmit: (data: NewEngagementFormData) => void;
  onCancel: () => void;
}

export const CreateEngagementForm = ({ onSubmit, onCancel }: CreateEngagementFormProps) => {
  const handleSubmit = (data: NewEngagementFormData) => {
    console.log('Engagement créé:', data);
    onSubmit(data);
  };

  return (
    <NewEngagementForm 
      onSubmit={handleSubmit} 
      onCancel={onCancel} 
    />
  );
};
