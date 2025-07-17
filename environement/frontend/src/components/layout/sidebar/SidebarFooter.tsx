
interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  if (isCollapsed) return null;
  
  return (
    <div className="p-4 border-t border-slate-700">
      <div className="text-xs text-slate-400">
        EPAC-001 • Version 1.0
      </div>
    </div>
  );
};
