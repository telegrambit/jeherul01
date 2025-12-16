import React, { useState, useEffect, useRef } from 'react';
import { Menu, Home, Grid, Settings, PlusCircle, Search, Sparkles, CheckCircle, Sun, Moon, LogIn, X, Heart } from 'lucide-react';
import { Category } from '../types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as framerMotion } from 'framer-motion';

const motion = framerMotion as any;

interface LayoutProps {
  children: React.ReactNode;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Notification prop removed as handled globally in App.tsx
}

// --- Professional Logo Component ---
const BrandLogo = () => (
  <div className="flex items-center gap-2.5">
    {/* Icon Container */}
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-xl rotate-6 opacity-40 blur-[1px]"></div>
      <div className="relative w-full h-full bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 border border-white/10">
        <Sparkles size={16} className="text-white fill-white/20" />
      </div>
    </div>
    {/* Text */}
    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
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
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false); // Specific state for Home Menu
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname === '/admin';
  const isGalleryPage = location.pathname === '/gallery';
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
  }, [location]);

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
    <div className="min-h-screen flex bg-background text-slate-900 dark:text-slate-100 overflow-hidden relative transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay (Only for non-home pages) */}
      {isSidebarOpen && !isHomePage && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Global Sidebar (Hidden on Mobile Home, Visible on Mobile Other Pages, Always Visible Desktop) */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-slate-200 dark:border-slate-700/50 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div 
          className="p-6 cursor-pointer group shrink-0"
          onClick={() => {
            navigate('/');
            onSelectCategory('all');
            setSidebarOpen(false);
          }}
        >
          <BrandLogo />
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          
          <Link 
            to="/" 
            onClick={() => {
              onSelectCategory('all');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${isHomePage ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Home size={20} />
            Home
          </Link>

          {/* --- SAVED COLLECTION BUTTON (Moved here) --- */}
          <button
            onClick={() => {
              onSelectCategory('favorites');
              setSidebarOpen(false);
              if (location.pathname !== '/gallery') navigate('/gallery');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left mb-6 ${activeCategory === 'favorites' && location.pathname === '/gallery' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-red-500'}`}
          >
            <Heart size={20} className={activeCategory === 'favorites' ? "fill-current" : ""} />
            Saved Collection
          </button>

          {/* Categories Divider */}
          <div className="px-4 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Explore</span>
          </div>

          <Link
            to="/gallery"
            onClick={() => {
              onSelectCategory('all');
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/gallery' && activeCategory === 'all' ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Grid size={20} />
            All Prompts
          </Link>

          {categories.filter(c => c.id !== 'all').map(category => (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.id);
                setSidebarOpen(false);
                if (location.pathname !== '/gallery') {
                  navigate('/gallery');
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left ${activeCategory === category.id && location.pathname === '/gallery' ? 'bg-slate-200 dark:bg-slate-700/50 text-accent font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <span className="opacity-70">#</span>
              {category.name}
            </button>
          ))}

        </nav>

        {/* Login Link - Hidden on Gallery Page */}
        {!isGalleryPage && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 space-y-2">
            <Link 
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isAdminPage ? 'bg-secondary/10 text-secondary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <LogIn size={20} />
              Login
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between px-3 sm:px-4 lg:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
          
          {/* Mobile Logo Section */}
          <div 
             className="lg:hidden flex items-center mr-2 cursor-pointer shrink-0"
             onClick={() => navigate('/')}
          >
             <BrandLogo />
          </div>

          {!isHomePage && (
             <div className="flex-1 max-w-xl mx-2 relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search size={16} className="text-slate-400 group-focus-within:text-primary transition-colors" />
             </div>
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => onSearchChange(e.target.value)}
               placeholder="Search..."
               className="block w-full pl-9 pr-3 py-1.5 sm:py-2 border border-slate-200 dark:border-slate-700 rounded-full leading-5 bg-slate-100 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all shadow-sm dark:shadow-none"
             />
           </div>
          )}
         
          <div className="flex items-center gap-3 ml-auto shrink-0 relative">
            {/* Theme Toggle */}
            <button
               onClick={toggleTheme}
               className="flex items-center justify-center p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
               title="Toggle Theme"
            >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
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
                  ? 'w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-md' 
                  : 'p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isHomePage && isHomeMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Submit Button - Hidden on Gallery Page */}
            {!isGalleryPage && (
              <Link to="/admin" className="hidden sm:flex items-center gap-2 text-xs font-medium bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
                <PlusCircle size={16} />
                Submit
              </Link>
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
                  className="absolute top-14 right-0 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 origin-top-right flex flex-col gap-1"
                >
                  <Link 
                    to="/"
                    onClick={() => setIsHomeMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors"
                  >
                    <Home size={18} className="text-primary" />
                    Home
                  </Link>
                  <Link 
                    to="/admin"
                    onClick={() => setIsHomeMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors"
                  >
                    <LogIn size={18} className="text-secondary" />
                    Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;