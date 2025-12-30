import React from 'react';
import { TabConfig } from '../types';

interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="flex overflow-x-auto border-b border-slate-700 bg-slate-800/50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap
              hover:bg-slate-700/50 focus:outline-none
              ${isActive 
                ? 'text-neon-green border-b-2 border-neon-green bg-slate-800 shadow-[0_4px_12px_-4px_rgba(0,255,157,0.3)]' 
                : 'text-slate-400 border-b-2 border-transparent'}
            `}
          >
            <Icon size={18} className={isActive ? 'text-neon-green animate-pulse' : 'text-slate-500'} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};