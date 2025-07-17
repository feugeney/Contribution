
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { menuItems } from './sidebar/menuItems';
import { MenuItem } from './sidebar/MenuItem';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarFooter } from './sidebar/SidebarFooter';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedMenus([]);
    }
  };

  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        onToggleCollapse={handleToggleCollapse} 
      />

      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            isCollapsed={isCollapsed}
            expandedMenus={expandedMenus}
            onToggleMenu={toggleMenu}
          />
        ))}
      </nav>

      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
};
