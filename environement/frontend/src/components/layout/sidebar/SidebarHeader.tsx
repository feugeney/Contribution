
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarHeader = ({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) => {
  return (
    <div className="p-4 flex justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="text-white hover:bg-slate-700"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};
