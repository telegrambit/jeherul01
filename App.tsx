import React, { useState, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { AppCard } from './components/AppCard';
import { AppDetails } from './components/AppDetails';
import { MOCK_APPS, CATEGORIES } from './constants';
import { AppData, Tab } from './types';
import { Search, Flame, Gamepad2, UserCircle, Hexagon, X, ChevronRight, ArrowLeft, Music, Film, Camera, Hammer, Sparkles, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // New State for viewing a specific category in full mode
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter Logic
  const filteredApps = useMemo(() => {
    return MOCK_APPS.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeTab === 'search' 
        ? true 
        : (selectedCategory === 'All' || app.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, activeTab]);

  // Helper to get apps for a specific category
  const getCategoryApps = (category: string) => {
    let apps = category === 'All' 
      ? MOCK_APPS 
      : MOCK_APPS.filter(app => app.category === category);
    return apps;
  };

  // Helper to chunk apps into groups of 3 for the "3-row" swipe layout
  const getChunkedApps = (apps: AppData[]) => {
    // Duplicate apps to simulate enough data for "6 bars/swipes" (approx 18 apps)
    const filledApps = [...apps, ...apps, ...apps, ...apps, ...apps, ...apps].slice(0, 18);
    const chunks = [];
    for (let i = 0; i < filledApps.length; i += 3) {
      chunks.push(filledApps.slice(i, i + 3));
    }
    return chunks;
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setViewingCategory(null); // Reset category view on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab !== 'search') {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchInputRef.current?.blur();
  };

  // Icon helper for search categories
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Games': return <Gamepad2 className="text-purple-400" size={24} />;
      case 'Music': return <Music className="text-pink-400" size={24} />;
      case 'Entertainment': return <Film className="text-orange-400" size={24} />;
      case 'Photography': return <Camera className="text-blue-400" size={24} />;
      case 'Tools': return <Hammer className="text-gray-400" size={24} />;
      default: return <Sparkles className="text-yellow-400" size={24} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#0f172a]">
      
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-4 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl w-full transition-all duration-300">
        
        {activeTab === 'search' ? (
          /* SEARCH HEADER MODE */
          <div className="w-full flex items-center animate-[slideUp_0.2s_ease-out]">
             <form onSubmit={handleSearchSubmit} className="relative w-full group">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-md opacity-40 group-focus-within:opacity-80 transition-opacity"></div>
               <div className="relative flex items-center bg-surface/80 border border-white/10 rounded-xl px-3 py-3 shadow-sm transition-all focus-within:border-primary/50 focus-within:bg-surface">
                 <Search className="text-slate-400 mr-3 shrink-0" size={20} />
                 <input 
                    ref={searchInputRef}
                    type="text"
                    className="bg-transparent border-none outline-none text-white w-full text-base font-medium placeholder:text-slate-500"
                    placeholder="Search mods, games, tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    enterKeyHint="search"
                    /* autoFocus removed */
                 />
                 {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} 
                      className="p-1 text-slate-500 hover:text-white shrink-0"
                    >
                        <X size={18} />
                    </button>
                 )}
               </div>
             </form>
          </div>
        ) : (
          /* STANDARD HEADER MODE */
          <>
            {viewingCategory && activeTab === 'categories' ? (
              <div className="flex items-center gap-3 animate-[slideUp_0.2s_ease-out]">
                <button 
                  onClick={() => setViewingCategory(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-white active:scale-95"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-white tracking-tight">{viewingCategory}</h1>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <Hexagon className="text-primary fill-primary/20" size={32} strokeWidth={1.5} />
                  <span className="absolute text-white font-bold text-lg -mt-0.5">M</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  ModVerse
                </h1>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-300 active:scale-95 transition-transform"
                onClick={() => alert("Signup Page Coming Soon!")}
              >
                <UserCircle size={26} />
              </button>
            </div>
          </>
        )}
      </header>

      {/* Main Content Container */}
      <div className="max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl px-4 pt-20">
        
        {/* HOME TAB CONTENT */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-[slideUp_0.3s_ease-out]">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="text-orange-500" size={20} /> Trending
                </h2>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory">
                {MOCK_APPS.slice(0, 3).map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className="shrink-0 w-64 h-36 relative rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/5 snap-center"
                  >
                    <img src={app.images[0]} alt={app.name} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                      <h3 className="font-bold text-white">{app.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">v{app.version}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pt-1 px-1">
                  {CATEGORIES.map(cat => (
                    <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${
                      selectedCategory === cat 
                        ? 'bg-primary border-transparent text-white' 
                        : 'bg-surface border-white/5 text-slate-400 hover:bg-surface/80 hover:text-white hover:border-white/20'
                    }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
            </section>

            <section className="space-y-4 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Gamepad2 className="text-secondary" size={20} /> Recommended
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} onClick={setSelectedApp} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* SEARCH TAB CONTENT */}
        {activeTab === 'search' && (
          <div className="animate-[slideUp_0.3s_ease-out]">
            {!searchQuery ? (
              /* EMPTY STATE - DASHBOARD STYLE */
              <div className="space-y-8 pt-2 pb-20">
                {/* Popular Searches Tags */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-400 px-1">
                    <TrendingUp size={16} />
                    <h2 className="text-sm font-bold uppercase tracking-wider">Trending Searches</h2>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {['Minecraft', 'Spotify Premium', 'Free Fire Max', 'GTA V', 'Netflix Mod', 'Roblox', 'Lightroom'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-4 py-2.5 bg-surface rounded-xl text-sm text-slate-300 font-medium border border-white/5 active:scale-95 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Browse Categories Grid */}
                <section>
                   <div className="flex items-center gap-2 mb-4 text-slate-400 px-1">
                    <Sparkles size={16} />
                    <h2 className="text-sm font-bold uppercase tracking-wider">Browse Categories</h2>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     {CATEGORIES.filter(c => c !== 'All').map(cat => (
                       <div 
                         key={cat}
                         onClick={() => setSearchQuery(cat)}
                         className="h-20 rounded-2xl bg-surface border border-white/5 flex items-center px-5 gap-4 cursor-pointer active:scale-95 transition-all hover:bg-white/5 group relative overflow-hidden shadow-sm"
                       >
                         <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
                         
                         <div className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                            {getCategoryIcon(cat)}
                         </div>
                         <span className="font-bold text-white text-base tracking-tight">{cat}</span>
                       </div>
                     ))}
                   </div>
                </section>
              </div>
            ) : (
              /* RESULTS STATE */
              <section className="space-y-4 mt-2 px-1">
                <div className="flex items-center justify-between">
                   <h2 className="text-lg font-bold text-white">Results <span className="text-slate-500 text-sm font-medium">({filteredApps.length})</span></h2>
                   {filteredApps.length > 0 && <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-lg">Best Match</span>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                       <AppCard key={app.id} app={app} onClick={setSelectedApp} />
                    ))
                  ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 opacity-60">
                      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-4 border border-white/5">
                         <Search size={32} className="text-slate-600" />
                      </div>
                      <p className="text-lg font-bold text-slate-400">No apps found</p>
                      <p className="text-sm">Try searching for "{CATEGORIES[1]}"</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* APPS (CATEGORIES) TAB CONTENT */}
        {activeTab === 'categories' && (
          <div className="animate-[slideUp_0.3s_ease-out] pb-6">
            
            {/* Conditional Rendering: Main List vs Specific Category View */}
            {!viewingCategory ? (
              <>
                {/* 1. Suggested For You (ICONS ONLY) */}
                <section className="mb-6">
                  <h2 className="text-lg font-bold text-white mb-3 px-1">Suggested For You</h2>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar px-1 pb-2">
                    {/* Repeat MOCK_APPS multiple times to simulate 20 apps */}
                    {[...MOCK_APPS, ...MOCK_APPS, ...MOCK_APPS, ...MOCK_APPS].slice(0, 20).map((app, index) => (
                      <div 
                        key={`${app.id}-suggest-${index}`} 
                        onClick={() => setSelectedApp(app)}
                        className="flex flex-col items-center shrink-0 cursor-pointer group"
                      >
                        <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden border border-white/10 group-active:scale-95 transition-transform shadow-lg bg-surface">
                          <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2. Popular Apps (ICONS ONLY) */}
                <section className="mb-6">
                  <h2 className="text-lg font-bold text-white mb-3 px-1">Popular Apps</h2>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar px-1 pb-4">
                    {/* Reverse MOCK_APPS to make it look different from Suggested */}
                    {[...MOCK_APPS].reverse().concat([...MOCK_APPS].reverse()).slice(0, 20).map((app, index) => (
                      <div 
                        key={`${app.id}-popular-${index}`} 
                        onClick={() => setSelectedApp(app)}
                        className="flex flex-col items-center shrink-0 cursor-pointer group"
                      >
                        <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden border border-white/10 group-active:scale-95 transition-transform shadow-lg bg-surface">
                          <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Category Rows - Horizontal Swipe of 3 Vertical Apps */}
                <div className="space-y-8">
                  {CATEGORIES.filter(c => c !== 'All').map((category) => {
                    const categoryApps = getCategoryApps(category);
                    if (categoryApps.length === 0) return null;
                    
                    const chunks = getChunkedApps(categoryApps);

                    return (
                      <section key={category}>
                        {/* Header with Arrow */}
                        <div 
                          className="flex items-center justify-between mb-2 px-1 cursor-pointer active:opacity-70"
                          onClick={() => setViewingCategory(category)}
                        >
                          <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            {category}
                          </h2>
                          <ChevronRight className="text-slate-500" size={20} />
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-4 -mx-4 no-scrollbar">
                           {chunks.map((chunk, chunkIndex) => (
                             /* Column of 3 Apps */
                             <div 
                               key={`${category}-chunk-${chunkIndex}`}
                               className="min-w-[88vw] sm:min-w-[360px] flex flex-col gap-2 snap-center"
                             >
                               {chunk.map((app, appIndex) => (
                                 <AppCard 
                                    key={`${app.id}-${chunkIndex}-${appIndex}`} 
                                    app={app} 
                                    onClick={setSelectedApp} 
                                 />
                               ))}
                             </div>
                           ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </>
            ) : (
              /* 4. Full Category View (Sirf Icon Grid) */
              <div className="animate-[slideUp_0.2s_ease-out]">
                 {/* Apps Grid - Icon Style */}
                 <div className="grid grid-cols-4 gap-4 px-1">
                    {getCategoryApps(viewingCategory).concat(getCategoryApps(viewingCategory)).map((app, index) => (
                      <div 
                        key={`${app.id}-fullview-${index}`}
                        onClick={() => setSelectedApp(app)}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                      >
                         <div className="w-full aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg group-active:scale-95 transition-transform bg-surface">
                           <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                         </div>
                         <span className="text-[10px] text-center font-medium text-slate-300 leading-tight line-clamp-2 w-full">
                           {app.name}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB PLACEHOLDER */}
        {activeTab === 'profile' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-[slideUp_0.3s_ease-out]">
            <UserCircle size={64} className="mb-4 text-slate-700" />
            <h2 className="text-xl font-bold text-white mb-2">My Profile</h2>
            <p>Login to save your favorite mods.</p>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;