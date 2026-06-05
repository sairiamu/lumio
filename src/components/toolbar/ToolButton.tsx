import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  shortcut?: string;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  shortcut
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 group relative
        ${isActive
          ? 'bg-iris text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
          : 'text-fog hover:bg-white/10 hover:text-cloud'}
      `}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />

      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-graphite border border-white/10 rounded-md text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100]">
        {label} {shortcut && <span className="text-iris ml-1">({shortcut})</span>}
      </div>
    </button>
  );
};
