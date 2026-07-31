import React from 'react';
import { LayoutGrid, Zap, Tv, Sparkles, MessageSquare, SplitSquareVertical } from 'lucide-react';
import { ColumnId } from '../types';
import { COLUMNS } from '../data/mockData';

interface BottomNavProps {
  activeColumn: ColumnId | 'all';
  onSelectColumn: (id: ColumnId | 'all') => void;
  unreadChats: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeColumn,
  onSelectColumn,
  unreadChats,
}) => {
  const getIcon = (iconName: string, isActive: boolean) => {
    const iconClass = `w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`;
    switch (iconName) {
      case 'LayoutGrid':
        return <LayoutGrid className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Tv':
        return <Tv className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'MessageSquare':
        return <MessageSquare className={iconClass} />;
      default:
        return <LayoutGrid className={iconClass} />;
    }
  };

  return (
    <nav className="sticky bottom-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-white/10 px-1 py-1.5 flex items-center justify-around select-none shrink-0">
      {/* 5-Column Split View Toggle */}
      <button
        onClick={() => onSelectColumn('all')}
        className={`flex flex-col items-center py-1 px-1.5 rounded-lg transition-all ${
          activeColumn === 'all'
            ? 'text-cyan-400 bg-cyan-500/10 font-bold border border-cyan-500/30'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="View All 5 Columns Side-by-Side"
      >
        <SplitSquareVertical className="w-4 h-4" />
        <span className="text-[10px] mt-0.5 font-medium tracking-tight">5-Columns</span>
      </button>

      {/* Individual 5 Column Buttons */}
      {COLUMNS.map((col) => {
        const isActive = activeColumn === col.id;
        return (
          <button
            key={col.id}
            onClick={() => onSelectColumn(col.id)}
            className={`relative flex flex-col items-center py-1 px-2 rounded-lg transition-all ${
              isActive
                ? 'text-white font-bold bg-white/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Column Icon with color glow if active */}
            <div
              style={{ color: isActive ? col.color : undefined }}
              className="relative flex items-center justify-center"
            >
              {getIcon(col.iconName, isActive)}
              {col.id === 'chat' && unreadChats > 0 && (
                <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-[#FF007A] text-white rounded-full min-w-[14px] text-center">
                  {unreadChats}
                </span>
              )}
            </div>

            <span
              className="text-[10px] mt-0.5 tracking-tight"
              style={{ color: isActive ? col.color : undefined }}
            >
              {col.name}
            </span>

            {/* Glowing Active Indicator bar */}
            {isActive && (
              <span
                className="absolute bottom-0 w-3 h-0.5 rounded-full"
                style={{ backgroundColor: col.color, boxShadow: `0 0 8px ${col.color}` }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
