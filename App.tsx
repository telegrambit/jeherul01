import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { AppCard } from './components/AppCard';
import { AppDetails } from './components/AppDetails';
import { MOCK_APPS, CATEGORIES } from './constants';
import { AppData, Tab } from './types';
import { Search, Flame, Gamepad2, X, UserCircle, Hexagon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter Logic
  const filteredApps = useMemo(() => {
    return MOCK_APPS.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#0f172a]">
      
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-4 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl w-full">
        
        {isSearchVisible ? (
          /* Search Mode: Title hides, Input appears inside header */
          <div className="flex items-center w-full gap-2 animate-[slideUp_0.2s_ease-out]">
            <Search className="text-primary shrink-0" size={20} />
            <input 
              type="text" 
              placeholder="Search games & apps..." 
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-lg h-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button 
              onClick={() => {
                setIsSearchVisible(false);
                setSearchQuery('');
              }}
              className="p-2 text-slate-400 active:text-white"
            >
              <X size={24} />
            </button>
          </div>
        ) : (
          /* Normal Mode: Logo + Title + Icons */
          <>
            <div className="flex items-center gap-3">
              {/* Custom 'M' Logo / Icon */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Hexagon className="text-primary fill-primary/20" size={32} strokeWidth={1.5} />
                <span className="absolute text-white font-bold text-lg -mt-0.5">M</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                ModVerse
              </h1>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Search Icon Removed */}

              {/* Signup / Profile Icon */}
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-300 active:scale-95 transition-transform"
                onClick={() => alert("Signup Page Coming Soon!")}
              >
                <UserCircle size={24} />
              </button>
            </div>
          </>
        )}
      </header>

      {/* Main Content Container */}
      <div className="max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl px-4 pt-20">
        
        {/* Dynamic Content Based on Tab */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Featured Section - Hide when searching */}
            {!searchQuery && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="text-orange-500" size={20} /> Trending
                  </h2>
                </div>
                {/* Horizontal Scroll for Trending */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                  {MOCK_APPS.slice(0, 3).map((app) => (
                    <div 
                      key={app.id} 
                      onClick={() => setSelectedApp(app)}
                      className="shrink-0 w-64 h-36 relative rounded-xl overflow-hidden cursor-pointer shadow-lg border border-white/5"
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
            )}

            {/* Categories - Hide when searching to keep it clean */}
            {!searchQuery && (
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
            )}

            {/* Main List */}
            <section className="space-y-4 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Gamepad2 className="text-secondary" size={20} /> 
                {searchQuery ? 'Search Results' : 'Recommended'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} onClick={setSelectedApp} />
                ))}
                {filteredApps.length === 0 && (
                  <div className="col-span-full py-10 text-center text-slate-500">
                    No apps found for "{searchQuery}"
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'home' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <Gamepad2 size={48} className="mb-4 text-slate-700" />
            <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
            <p>We are still building the {activeTab} section.</p>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <AppDetails app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;