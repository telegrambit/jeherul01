import React, { useState } from 'react';
import { Copy, Check, Search, Heart, X, ZoomIn, Plus, PenTool, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Prompt } from '../types';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';

const motion = framerMotion as any;

interface PromptCardProps {
  prompt: Prompt;
  isLiked: boolean;
  onToggleLike: () => void;
  index?: number;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, isLiked, onToggleLike, index = 0 }) => {
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine Aspect Ratio based on format
  const aspectRatioClass = prompt.format === 'thumbnail' ? 'aspect-video' : 'aspect-square';

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-surface rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20 transition-all duration-300 flex flex-col h-full transform-gpu"
      >
        <div 
          className={`relative ${aspectRatioClass} overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-zoom-in`}
          onClick={() => setIsFullScreen(true)}
        >
          {/* --- SKELETON LOADER --- */}
          <div className={`absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse transition-opacity duration-500 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`} />
          
          <img 
            src={prompt.imageUrl} 
            alt={prompt.title} 
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${imgLoaded ? 'opacity-100 scale-100 group-hover:scale-105' : 'opacity-0 scale-110'}`}
          />
          
          {/* Gradient Overlay for better visibility of tags/buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Zoom Indicator (Visible on Hover) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white ring-1 ring-white/20 shadow-xl">
                <ZoomIn size={24} strokeWidth={2} />
             </div>
          </div>
          
          {/* --- WISHLIST BUTTON (Love Icon) --- */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg backdrop-blur-xl transition-all duration-200 transform active:scale-75 z-20 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-red-500/30' 
                : 'bg-white/10 dark:bg-black/20 text-white hover:bg-black/50 border border-white/10'
            }`}
            title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
             <Heart size={18} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
          </button>

          {/* --- TAGS OVERLAY (Bottom Left) --- */}
          <div 
            className="absolute bottom-3 left-3 right-14 flex flex-nowrap items-center gap-1.5 z-10 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ 
                maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
            }}
          >
             {prompt.tags.map((tag, idx) => (
              <span key={idx} className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-sm whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>

          {/* Floating Copy Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className={`absolute bottom-3 right-3 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 transform active:scale-90 z-20 ${copied ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/30' : 'bg-white/20 text-white hover:bg-white/30 border border-white/10'}`}
          >
            {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col bg-white dark:bg-slate-900/50">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-tight line-clamp-1 group-hover:text-indigo-500 transition-colors">
            {prompt.title}
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">
            {prompt.description}
          </p>
        </div>
      </motion.div>

      {/* --- Full Screen Image Modal --- */}
      <AnimatePresence>
        {isFullScreen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-white/90 dark:bg-[#0B0F19]/95 backdrop-blur-xl flex flex-col"
                onClick={() => setIsFullScreen(false)}
            >
                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-start z-[110] pointer-events-none">
                    <div className="text-slate-900 dark:text-white hidden sm:block pointer-events-auto mt-2 ml-2">
                        <h3 className="text-xl font-bold">{prompt.title}</h3>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFullScreen(false);
                        }}
                        className="pointer-events-auto ml-auto p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full transition-colors shadow-lg"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main Image Container */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-12 overflow-hidden relative">
                    <motion.img 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        src={prompt.imageUrl}
                        alt={prompt.title}
                        className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl cursor-default ring-1 ring-slate-900/5 dark:ring-white/10"
                        onClick={(e: any) => e.stopPropagation()}
                    />
                </div>

                {/* --- BOTTOM ACTION BAR --- */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ delay: 0.1, type: "spring", damping: 20 }}
                    className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-[110] bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800"
                    onClick={(e: any) => e.stopPropagation()}
                >
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                        
                        <div className="flex-1 min-w-0">
                             <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1">Copy Prompt</h4>
                             <p className="text-xs text-slate-500 truncate">Tap the button to copy to clipboard</p>
                        </div>

                        <button 
                            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all shadow-xl active:scale-95 ${copied ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-900 dark:bg-indigo-600 shadow-indigo-500/20'}`}
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PromptCard;