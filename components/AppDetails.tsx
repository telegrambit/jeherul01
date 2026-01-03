import React from 'react';
import { AppData } from '../types';
import { X, Download, ShieldCheck, Cpu, Info } from 'lucide-react';
import { Button } from './Button';

interface AppDetailsProps {
  app: AppData;
  onClose: () => void;
}

export const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full sm:max-w-md bg-[#0f172a] sm:rounded-3xl rounded-t-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-[slideUp_0.3s_ease-out]">
        
        {/* Header Image Background */}
        <div className="h-40 w-full relative">
          <img src={app.images[0]} alt="Banner" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-12 relative flex-1 overflow-y-auto no-scrollbar">
          <div className="flex gap-4 items-end mb-6">
            <img 
              src={app.icon} 
              alt={app.name} 
              className="w-24 h-24 rounded-2xl shadow-2xl border-2 border-surface bg-surface"
            />
            <div className="mb-1">
              <h2 className="text-2xl font-bold text-white leading-none mb-2">{app.name}</h2>
              <div className="text-sm text-primary font-medium">v{app.version} • {app.size}</div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Description Box */}
            <div className="bg-surface/50 border border-white/5 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2 text-primary text-xs font-bold uppercase tracking-wider">
                <Info size={14} /> 
                Description
              </div>
              
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {app.description}
              </p>
            </div>

            {/* Mod Features List */}
            <div>
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Cpu size={18} className="text-primary" /> Mod Features
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {app.modFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-surface/50 p-3 rounded-lg border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                    <span className="text-sm text-slate-200">{feat.name}</span>
                    {feat.isPro && <span className="ml-auto text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded uppercase font-bold">Pro</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Check */}
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs bg-emerald-950/30 py-2 rounded-lg border border-emerald-900/50">
              <ShieldCheck size={14} />
              <span>Virus Free & Safe to Install</span>
            </div>

            {/* Download Action */}
            <div className="sticky bottom-0 pt-4 bg-gradient-to-t from-[#0f172a] to-transparent">
              <Button 
                variant="primary" 
                fullWidth 
                className="shadow-xl shadow-primary/20 text-lg"
                onClick={() => alert(`Starting download for ${app.name} Mod...`)}
              >
                <Download size={24} /> Download Mod
              </Button>
              <p className="text-center text-[10px] text-slate-500 mt-2">
                By downloading, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};