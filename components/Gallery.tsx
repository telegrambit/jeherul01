import React from 'react';
import { AppState } from '../types';
import PromptCard from './PromptCard';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { SearchX, Heart } from 'lucide-react';

const motion = framerMotion as any;

interface GalleryProps {
  prompts: AppState['prompts'];
  activeCategory: string;
  searchQuery: string;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ prompts, activeCategory, searchQuery, wishlist, onToggleWishlist }) => {
  
  const filteredPrompts = prompts.filter(prompt => {
    
    // --- THUMBNAIL LOGIC (Strict Separation) ---
    // If viewing "thumbnail" category: Show ONLY thumbnails
    if (activeCategory === 'thumbnail') {
      if (prompt.format !== 'thumbnail') return false;
    } 
    // If viewing ANY OTHER category (including 'all' or 'favorites'): HIDE thumbnails
    else {
      if (prompt.format === 'thumbnail') return false;
    }

    // 1. Category Filter (Standard)
    if (activeCategory === 'favorites') {
        if (!wishlist.includes(prompt.id)) return false;
    } else if (activeCategory !== 'all' && activeCategory !== 'thumbnail' && prompt.categoryId !== activeCategory) {
      return false;
    }
    
    // 2. Search Filter (Improved: Space Separated & Multi-Keyword)
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      // Split by space to allow searching "city rain" as "city" AND "rain"
      const searchTerms = lowerQuery.split(' ').map(s => s.trim()).filter(Boolean);

      if (searchTerms.length === 0) return true;

      // "every" means ALL typed words must be found in the prompt (AND logic)
      // This is better for specific searches like "cyberpunk city rain"
      return searchTerms.every(term => {
        const titleMatch = prompt.title?.toLowerCase().includes(term);
        const descMatch = prompt.description?.toLowerCase().includes(term);
        const categoryMatch = prompt.categoryId?.toLowerCase().includes(term);
        
        // Check if any tag contains this specific search term
        const tagMatch = prompt.tags && Array.isArray(prompt.tags) && prompt.tags.some(tag => 
          tag.toLowerCase().includes(term)
        );

        return titleMatch || descMatch || categoryMatch || tagMatch;
      });
    }

    return true;
  });

  if (filteredPrompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="p-6 rounded-full bg-slate-200 dark:bg-slate-800/50 mb-6">
            {activeCategory === 'favorites' ? (
                 <Heart size={48} className="text-slate-500 dark:text-slate-400" />
            ) : (
                <SearchX size={48} className="text-slate-500 dark:text-slate-400" />
            )}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-300 mb-2">
            {activeCategory === 'favorites' ? 'No saved prompts' : 'No prompts found'}
        </h3>
        <p className="text-slate-600 dark:text-slate-500 max-w-md mx-auto">
            {activeCategory === 'favorites' 
             ? 'Browse the gallery and click the heart icon to save prompts here.' 
             : 'Try adjusting your search terms or selecting a different category.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
            {activeCategory === 'favorites' ? 'Saved Collection' : 
             activeCategory === 'all' ? 'All Prompts' : 
             activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace('-', ' ')}
            <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">
                {filteredPrompts.length}
            </span>
        </h2>
      </div>

      <motion.div 
        layout
        // Maintaining 2 columns on mobile, 3 on tablet, 4 on desktop for ALL types including thumbnails as requested
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPrompts.map((prompt, index) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              index={index}
              isLiked={wishlist.includes(prompt.id)}
              onToggleLike={() => onToggleWishlist(prompt.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Gallery;