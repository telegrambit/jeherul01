import React from 'react';
import { AppData } from '../types';
import { Star } from 'lucide-react';

interface AppCardProps {
  app: AppData;
  onClick: (app: AppData) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  return (
    <div 
      onClick={() => onClick(app)}
      className="group w-full flex items-center gap-4 p-2 rounded-2xl active:bg-primary/10 active:scale-[0.98] transition-all duration-200 cursor-pointer mb-1 border border-transparent active:border-primary/20"
    >
      {/* Icon Section - Floating with shadow */}
      <div className="w-16 h-16 shrink-0 relative">
        <img 
          src={app.icon} 
          alt={app.name} 
          className="w-full h-full rounded-2xl object-cover shadow-lg shadow-black/50"
        />
      </div>

      {/* Info Section - Blended with background */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-bold text-lg text-white truncate mb-1 group-active:text-primary transition-colors">
          {app.name}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="flex items-center text-yellow-500">
            <Star size={10} className="fill-yellow-500 mr-1" /> {app.rating}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>{app.version}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span>{app.size}</span>
        </div>

        {/* Minimal Feature Text */}
        <div className="mt-1 text-[11px] text-primary truncate opacity-80 font-medium">
          {app.modFeatures[0].name}
          {app.modFeatures.length > 1 && <span className="text-slate-500 ml-1">+{app.modFeatures.length - 1} more</span>}
        </div>
      </div>
    </div>
  );
};