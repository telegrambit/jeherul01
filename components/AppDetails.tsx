import React, { useState } from 'react';
import { AppData } from '../types';
import { X, Download, ShieldCheck, Cpu, Info, Heart, ArrowLeft, AlertCircle, FileDown, Rocket, Camera, Send } from 'lucide-react';
import { Button } from './Button';

interface AppDetailsProps {
  app: AppData;
  onClose: () => void;
}

export const AppDetails: React.FC<AppDetailsProps> = ({ app, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDownloadPage, setShowDownloadPage] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFinalDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
        alert(`Download started for ${app.name} v${app.version}`);
        setIsDownloading(false);
    }, 2000);
  };

  const handleTelegramJoin = () => {
    window.open('https://telegram.org', '_blank');
  };

  // --- VIEW 2: THE DOWNLOAD PAGE (With Ads & Summary) ---
  if (showDownloadPage) {
    return (
      <div className="fixed inset-0 z-[60] bg-[#0f172a] flex flex-col animate-[slideUp_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-10">
          <button 
            onClick={() => setShowDownloadPage(false)}
            className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">Download Center</h2>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            
            {/* 1. APP SUMMARY CARD (Moved Above Ads as requested) */}
            <div className="w-full max-w-md bg-surface/50 border border-white/5 rounded-2xl p-5 mb-8 flex items-center gap-4 shadow-lg backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl border border-white/10 overflow-hidden shadow-lg shrink-0">
                    <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{app.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">v{app.version}</span>
                        <span>{app.size}</span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-green-500" />
                </div>
            </div>

            {/* 2. ADVERTISEMENT CARD */}
            <div className="w-full max-w-md aspect-video bg-surface rounded-2xl border border-white/5 relative overflow-hidden group mb-8 shadow-2xl">
                {/* Placeholder for Ad Image */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
                   <span className="bg-black/40 text-white/50 text-[10px] px-2 py-1 rounded absolute top-2 right-2">Ad</span>
                   <Rocket size={48} className="text-white/20 mb-2" />
                   <p className="text-white/40 text-sm font-medium">Sponsor Ad Placeholder</p>
                </div>
                {/* Border Glow Effect */}
                <div className="absolute inset-0 border-2 border-white/5 rounded-2xl group-hover:border-primary/30 transition-colors"></div>
            </div>

            {/* Safety Notice */}
            <div className="w-full max-w-md bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 mb-8 flex gap-3">
                <AlertCircle className="text-blue-400 shrink-0" size={20} />
                <p className="text-xs text-blue-200/80 leading-relaxed">
                    This file has been scanned and is safe to install. Ensure 'Unknown Sources' is enabled in your settings.
                </p>
            </div>

            {/* Telegram Join Button - Moved up relative to download button by removing mt-auto and adding fixed margin */}
            <div className="w-full max-w-md mb-8">
                <button
                    onClick={handleTelegramJoin}
                    className="w-full py-3.5 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-[#229ED9]/20 shadow-lg shadow-[#229ED9]/5"
                >
                    <Send size={20} className="-rotate-45 translate-x-0.5 translate-y-0.5" /> Join Telegram Channel
                </button>
            </div>

            {/* 3. FINAL DOWNLOAD BUTTON */}
            <div className="w-full max-w-md mb-6">
                <Button 
                    onClick={handleFinalDownload}
                    variant="primary" 
                    fullWidth 
                    className="h-14 text-lg shadow-xl shadow-primary/20 relative overflow-hidden"
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <div className="flex items-center gap-2 animate-pulse">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Downloading...
                        </div>
                    ) : (
                        <>
                            <FileDown size={24} /> Start Download
                        </>
                    )}
                </Button>
            </div>

        </div>
      </div>
    );
  }

  // --- VIEW 1: FULL PAGE DETAILS ---
  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] animate-[slideUp_0.3s_ease-out] flex flex-col">
      
      {/* Full Page Header with Image - Height Reduced to h-48 */}
      <div className="h-48 w-full relative shrink-0">
        <img src={app.images[0]} alt="Banner" className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0f172a]"></div>
        
        {/* Navigation Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <button 
                onClick={onClose}
                className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
                <ArrowLeft size={22} />
            </button>
            
            <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
                <Heart 
                size={20} 
                className={isFavorite ? "fill-pink-500 text-pink-500" : "text-white"} 
                />
            </button>
        </div>
      </div>

      {/* Scrollable Content - Negative margin increased to -mt-12 */}
      <div className="flex-1 overflow-y-auto no-scrollbar -mt-12 relative z-10 px-4 sm:px-6 pb-24">
        
        {/* Title Section - Adjusted spacing and icon size */}
        <div className="flex items-end gap-4 mb-6">
            <div className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-[#0f172a] bg-surface relative z-10">
                <img 
                    src={app.icon} 
                    alt={app.name} 
                    className="w-full h-full rounded-[20px] object-cover" 
                />
            </div>
            <div className="mb-2 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-1">{app.name}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">v{app.version}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>{app.size}</span>
                </div>
            </div>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Description Box */}
            <div className="bg-surface/50 border border-white/5 rounded-2xl p-4 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2 text-primary text-xs font-bold uppercase tracking-wider">
                <Info size={14} /> 
                Description
              </div>
              <p className="text-slate-200 text-sm leading-6 whitespace-pre-line font-light">
                {app.description}
              </p>
            </div>

            {/* Mod Features List */}
            <div>
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <Cpu size={20} className="text-primary" /> Mod Features
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {app.modFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-surface/50 p-3.5 rounded-xl border border-white/5 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-sm font-medium text-slate-200">{feat.name}</span>
                    {feat.isPro && <span className="ml-auto text-[10px] bg-secondary/10 text-secondary px-2.5 py-1 rounded-lg uppercase font-bold tracking-wider">Pro</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Check */}
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm bg-emerald-950/30 py-3.5 rounded-xl border border-emerald-900/50 mb-8">
              <ShieldCheck size={18} />
              <span>Virus Free & Safe to Install</span>
            </div>
        </div>
      </div>

      {/* Floating Action Bar (Sticky Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent z-40">
        <div className="max-w-md mx-auto">
            <Button 
                variant="primary" 
                fullWidth 
                className="h-14 shadow-xl shadow-primary/20 text-lg group"
                onClick={() => setShowDownloadPage(true)}
            >
                Go to Download Page <Download size={24} className="group-active:translate-y-1 transition-transform" />
            </Button>
            <p className="text-center text-[10px] text-slate-500 mt-3 font-medium opacity-60">
                Secure 256-bit encrypted connection
            </p>
        </div>
      </div>

    </div>
  );
};