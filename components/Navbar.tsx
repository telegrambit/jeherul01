import React from 'react';
import { Tab } from '../types';
import { Home, Search, Layers, User } from 'lucide-react';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'categories', icon: Layers, label: 'Apps' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#0f172a]/95 backdrop-blur">
      <div className="max-w-md mx-auto flex items-center justify-around p-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-slate-500'}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};