
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuItem as MenuItemType } from './menuItems';

interface MenuItemProps {
  item: MenuItemType;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  level?: number;
  expandedMenus: string[];
  onToggleMenu: (menuId: string) => void;
}

export const MenuItem = ({ 
  item, 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  level = 0,
  expandedMenus,
  onToggleMenu
}: MenuItemProps) => {
  const Icon = item.icon;
  const hasSubMenus = item.subMenus && item.subMenus.length > 0;
  const isExpanded = expandedMenus.includes(item.id);
  const paddingLeft = level * 4;
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left hover:bg-slate-700 transition-colors",
          activeSection === item.id && "bg-slate-700 text-white",
          isCollapsed && level === 0 && "px-2",
          level > 0 && "text-sm ml-4"
        )}
        style={{ paddingLeft: isCollapsed && level === 0 ? undefined : `${8 + paddingLeft}px` }}
        onClick={() => {
          if (hasSubMenus && !isCollapsed) {
            onToggleMenu(item.id);
          } else {
            onSectionChange(item.id);
          }
        }}
      >
        <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {hasSubMenus && (
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            )}
          </>
        )}
      </Button>

      {hasSubMenus && isExpanded && !isCollapsed && (
        <div className="space-y-1">
          {item.subMenus!.map((subItem) => (
            <MenuItem
              key={subItem.id}
              item={subItem}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              isCollapsed={isCollapsed}
              level={level + 1}
              expandedMenus={expandedMenus}
              onToggleMenu={onToggleMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};
