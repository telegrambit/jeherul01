import React from 'react';
import { AppData } from '../types';
import { Download, Star, CheckCircle2 } from 'lucide-react';

interface AppCardProps {
  app: AppData;
  onClick: (app: AppData) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  return (
    <div 
      onClick={() => onClick(app)}
      className="bg-surface rounded-xl p-3 flex items-center gap-3 border border-white/5 active:scale-95 transition-transform cursor-pointer"
    >
      {/* Icon Section */}
      <div className="w-16 h-16 shrink-0">
        <img 
          src={app.icon} 
          alt={app.name} 
          className="w-full h-full rounded-lg object-cover bg-black/20"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base text-white truncate mb-1">
          {app.name}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
          <span className="flex items-center text-yellow-400">
            <Star size={10} className="fill-yellow-400 mr-1" /> {app.rating}
          </span>
          <span>{app.size}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {app.modFeatures.slice(0, 1).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              <CheckCircle2 size={8} />
              {feature.name}
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <div>
        <button className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};