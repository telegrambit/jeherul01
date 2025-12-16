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
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        className="group relative bg-surface rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 dark:hover:border-slate-600 hover:shadow-2xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-shadow duration-300 flex flex-col h-full"
      >
        <div 
          className={`relative ${aspectRatioClass} overflow-hidden bg-slate-900 cursor-zoom-in`}
          onClick={() => setIsFullScreen(true)}
        >
          {/* --- SKELETON LOADER --- */}
          <div className={`absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse transition-opacity duration-500 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`} />
          
          <img 
            src={prompt.imageUrl} 
            alt={prompt.title} 
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          />
          
          {/* Gradient Overlay for better visibility of tags/buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 pointer-events-none" />

          {/* Zoom Indicator (Visible on Hover) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
             <div className="bg-black/30 backdrop-blur-md p-3 rounded-full text-white/90">
                <ZoomIn size={24} />
             </div>
          </div>
          
          {/* --- WISHLIST BUTTON (Love Icon) --- */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 transform active:scale-90 z-10 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-black/30 text-white hover:bg-black/60'
            }`}
            title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
             <Heart size={16} fill={isLiked ? "currentColor" : "none"} className="sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* --- TAGS OVERLAY (Bottom Left - Scrollable) --- */}
          <div 
            className="absolute bottom-2 left-2 right-12 flex flex-nowrap items-center gap-1.5 z-10 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onClick={(e) => e.stopPropagation()}
            style={{ 
                maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
            }}
          >
             {prompt.tags.map((tag, idx) => (
              <span key={idx} className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-white/95 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm whitespace-nowrap">
                <Search size={12} className="text-white/80" />
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
            className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 transform z-10 ${copied ? 'bg-green-500 text-white scale-110' : 'bg-white/20 text-white hover:bg-primary hover:scale-105'}`}
          >
            {copied ? <Check size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />}
          </button>
        </div>

        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {prompt.title}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
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
                className="fixed inset-0 z-[100] bg-white/30 dark:bg-slate-900/60 backdrop-blur-3xl flex flex-col"
                onClick={() => setIsFullScreen(false)}
            >
                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-[110] pointer-events-none">
                    <div className="text-white/90 hidden sm:block pointer-events-auto drop-shadow-md mt-2 ml-2">
                        <h3 className="text-lg font-bold">{prompt.title}</h3>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFullScreen(false);
                        }}
                        className="pointer-events-auto ml-auto p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md border border-white/10 group"
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Main Image Container */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
                    <motion.img 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        src={prompt.imageUrl}
                        alt={prompt.title}
                        className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl cursor-default ring-1 ring-white/10"
                        onClick={(e: any) => e.stopPropagation()}
                    />
                </div>

                {/* --- TRANSPARENT FORMULA OVERLAY (BOTTOM) --- */}
                {prompt.recipe && prompt.recipe.length > 0 && (
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ delay: 0.1, type: "spring", damping: 20 }}
                        // Changed to absolute positioning + transparent background
                        className="absolute bottom-0 left-0 right-0 w-full p-6 pb-8 z-[110] bg-transparent"
                        onClick={(e: any) => e.stopPropagation()}
                    >
                        {/* Subtle gradient behind text only for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent -z-10 pointer-events-none rounded-b-none" />

                        <div className="max-w-3xl mx-auto">
                            <div className="flex flex-col items-center">
                                {/* Separator Line */}
                                <div className="w-12 h-1 bg-white/20 rounded-full mb-4"></div>
                                
                                <div className="flex items-center gap-2 sm:gap-6 flex-wrap justify-center">
                                    {/* Input Steps */}
                                    {prompt.recipe.map((step, idx) => (
                                        <div key={step.id} className="flex items-center gap-2 sm:gap-4">
                                            <div className="flex flex-col items-center gap-2 group cursor-default">
                                                {/* Glassy Circle Container */}
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                                                    {/* Colored Icon */}
                                                    <ImageIcon size={20} className="text-indigo-400" />
                                                </div>
                                                <span className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-wide shadow-black drop-shadow-md">
                                                    {step.label}
                                                </span>
                                            </div>

                                            {/* Connector */}
                                            <div className="text-white/50 mb-6">
                                                <Plus size={16} />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Final Prompt Element */}
                                    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-600/90 backdrop-blur-md border border-indigo-400/30 flex items-center justify-center text-white shadow-lg shadow-indigo-900/50 group-hover:scale-110 transition-transform duration-300">
                                            {copied ? <Check size={20} /> : <PenTool size={20} />}
                                        </div>
                                        {/* Reverted 'Result' to 'Prompt' as requested */}
                                        <span className="text-[10px] sm:text-xs font-bold text-indigo-300 uppercase tracking-wide drop-shadow-md">
                                            {copied ? 'Copied!' : 'Prompt'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PromptCard;