
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Home, Grid, Settings, PlusCircle, Search, Sparkles, CheckCircle, Sun, Moon, LogIn, X, Heart, MessageSquare, Star } from 'lucide-react';
import { Category } from '../types';
import { AnimatePresence, motion as framerMotion } from 'framer-motion';

const motion = framerMotion as any;

interface LayoutProps {
  children: React.ReactNode;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPath: string; // Passed from App for routing state
}

// --- Professional Logo Component ---
const BrandLogo = () => (
  <div className="flex items-center gap-2.5">
    {/* Icon Container */}
    <div className="relative w-9 h-9 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-xl rotate-6 opacity-40 blur-[2px]"></div>
      <div className="relative w-full h-full bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-white/10">
        <Sparkles size={18} className="text-white fill-white/20" />
      </div>
    </div>
    {/* Text */}
    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
      Prompt<span className="text-primary">Verse</span>
    </span>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  categories, 
  activeCategory, 
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currentPath,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false); // Specific state for Home Menu
  
  // Custom Navigation Helper
  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const isHomePage = currentPath === '/';
  const isAdminPage = currentPath === '/admin';
  const isGalleryPage = currentPath === '/gallery';
  const homeMenuRef = useRef<HTMLDivElement>(null);

  // --- Theme State ---
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  // Apply theme to HTML tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Close menus on route change or outside click
  useEffect(() => {
    setIsHomeMenuOpen(false);
    setSidebarOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (homeMenuRef.current && !homeMenuRef.current.contains(event.target as Node)) {
        setIsHomeMenuOpen(false);
      }
    };
    if (isHomeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHomeMenuOpen]);

  // Reset category logic
  useEffect(() => {
    if (isHomePage) {
      onSelectCategory('all');
    }
  }, [isHomePage, onSelectCategory]);

  return (
    <div className="min-h-screen flex bg-background text-slate-900 dark:text-slate-100 overflow-hidden relative transition-colors duration-300 font-sans">
      
      {/* Mobile Sidebar Overlay (Only for non-home pages) */}
      <AnimatePresence>
        {isSidebarOpen && !isHomePage && (
            <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            />
        )}
      </AnimatePresence>

      {/* Global Sidebar (Hidden on Mobile Home, Visible on Mobile Other Pages, Always Visible Desktop) */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-surface/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700/50 transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col shadow-2xl lg:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div 
          className="p-8 cursor-pointer group shrink-0"
          onClick={() => {
            navigate('/');
            onSelectCategory('all');
            setSidebarOpen(false);
          }}
        >
          <BrandLogo />
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-6 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
          
          <a 
            href="#/" 
            onClick={() => {
              onSelectCategory('all');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all mb-2 font-bold text-sm ${isHomePage ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Home size={20} strokeWidth={2} />
            Home
          </a>

          {/* --- SAVED COLLECTION BUTTON --- */}
          <button
            onClick={() => {
              onSelectCategory('favorites');
              setSidebarOpen(false);
              if (currentPath !== '/gallery') navigate('/gallery');
            }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-left mb-8 font-bold text-sm ${activeCategory === 'favorites' && currentPath === '/gallery' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-red-500'}`}
          >
            <Heart size={20} strokeWidth={2} className={activeCategory === 'favorites' ? "fill-current" : ""} />
            Saved Collection
          </button>

          {/* Categories Divider */}
          <div className="px-4 mb-4 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Discover</span>
          </div>

          <a
            href="#/gallery"
            onClick={() => {
              onSelectCategory('all');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${currentPath === '/gallery' && activeCategory === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Grid size={18} />
            All Prompts
          </a>

          {categories.filter(c => c.id !== 'all').map(category => (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.id);
                setSidebarOpen(false);
                if (currentPath !== '/gallery') {
                  navigate('/gallery');
                }
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm transition-all text-left font-medium ${activeCategory === category.id && currentPath === '/gallery' ? 'bg-slate-100 dark:bg-slate-800 text-accent' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span className="opacity-50 font-mono">#</span>
              {category.name}
            </button>
          ))}

        </nav>

        {/* Login Link */}
        {!isGalleryPage && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-700/50">
            <a 
              href="#/admin"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${isAdminPage ? 'bg-secondary/10 text-secondary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <LogIn size={20} />
              Admin Login
            </a>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar (Sticky & Glassmorphic) */}
        <header className="absolute top-0 left-0 right-0 h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-30 sticky-header bg-background/70 backdrop-blur-xl border-b border-white/5 transition-all">
          
          {/* Mobile Logo Section */}
          <div 
             className="lg:hidden flex items-center mr-2 cursor-pointer shrink-0 active:scale-95 transition-transform"
             onClick={() => navigate('/')}
          >
             <BrandLogo />
          </div>

          {!isHomePage && (
             <div className="flex-1 max-w-md mx-2 sm:mx-8 relative group hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search creative prompts..."
                className="block w-full pl-11 pr-4 py-3 rounded-full leading-5 bg-slate-100/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm border-transparent focus:border-primary/50"
                />
             </div>
          )}
          
          {/* Mobile Search Icon (Only visible on mobile non-home) */}
          {!isHomePage && (
              <button className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full ml-auto mr-2">
                  <Search size={22} />
              </button>
          )}
         
          <div className="flex items-center gap-2 sm:gap-4 ml-auto shrink-0 relative">
            {/* Theme Toggle */}
            <button
               onClick={toggleTheme}
               className="flex items-center justify-center w-10 h-10 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
               title="Toggle Theme"
            >
               {theme === 'dark' ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>

             {/* Mobile Menu Button - Logic Split */}
             {/* IF HOME: Toggle the small dropdown */}
             {/* IF OTHER: Toggle the main sidebar */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (isHomePage) {
                  setIsHomeMenuOpen(!isHomeMenuOpen);
                } else {
                  setSidebarOpen(true);
                }
              }}
              className={`lg:hidden flex items-center justify-center transition-all ${
                isHomePage 
                  ? 'w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200' 
                  : 'w-10 h-10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full'
              }`}
            >
              {isHomePage && isHomeMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Submit Button - Hidden on Gallery Page */}
            {!isGalleryPage && (
              <a href="#/admin" className="hidden sm:flex items-center gap-2 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-primary/10">
                <PlusCircle size={16} />
                Submit
              </a>
            )}

            {/* --- HOME PAGE EXCLUSIVE MENU DROPDOWN --- */}
            <AnimatePresence>
              {isHomePage && isHomeMenuOpen && (
                <motion.div
                  ref={homeMenuRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-16 right-2 w-52 bg-white dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 origin-top-right flex flex-col gap-1"
                >
                  <a 
                    href="#/"
                    onClick={() => setIsHomeMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors"
                  >
                    <Home size={18} className="text-primary" />
                    Home
                  </a>

                  {/* Contact Button (Scrolls) */}
                  <button 
                    onClick={() => {
                        setIsHomeMenuOpen(false);
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors text-left"
                  >
                    <MessageSquare size={18} className="text-indigo-500" />
                    Contact
                  </button>

                  {/* Feedback Button (Scrolls) */}
                  <button 
                    onClick={() => {
                        setIsHomeMenuOpen(false);
                        document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors text-left"
                  >
                    <Star size={18} className="text-amber-500" />
                    Feedback
                  </button>
                  
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                  
                  <a 
                    href="#/admin"
                    onClick={() => setIsHomeMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-colors"
                  >
                    <LogIn size={18} className="text-secondary" />
                    Login
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 pt-24 relative scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
