import React, { useState, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { AppCard } from './components/AppCard';
import { AppDetails } from './components/AppDetails';
import { MOCK_APPS, CATEGORIES } from './constants';
import { AppData, Tab } from './types';
import { Search, Flame, Gamepad2, UserCircle, Hexagon, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter Logic
  const filteredApps = useMemo(() => {
    return MOCK_APPS.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // FIX: In Search Tab, ignore category selection (show from ALL apps). 
      // Only apply category filter in Home Tab.
      const matchesCategory = activeTab === 'search' 
        ? true 
        : (selectedCategory === 'All' || app.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, activeTab]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab !== 'search') {
      setSearchQuery(''); // Clear search when leaving tab
    }
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#0f172a]">
      
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-4 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl w-full transition-all duration-300">
        
        {/* Left Side: Logo + Name (Always Visible) */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Hexagon className="text-primary fill-primary/20" size={32} strokeWidth={1.5} />
            <span className="absolute text-white font-bold text-lg -mt-0.5">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ModVerse
          </h1>
        </div>
        
        {/* Right Side Icons - Always Profile Icon now (No redundant search button) */}
        <div className="flex items-center gap-3">
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-300 active:scale-95 transition-transform"
            onClick={() => alert("Signup Page Coming Soon!")}
          >
            <UserCircle size={26} />
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl px-4 pt-20">
        
        {/* HOME TAB CONTENT */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-[slideUp_0.3s_ease-out]">
            
            {/* Featured Section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="text-orange-500" size={20} /> Trending
                </h2>
              </div>
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

            {/* Categories */}
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

            {/* Main List */}
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
            
            {/* Search Input Box - FIXED POSITION */}
            {/* Changed from sticky to fixed to guarantee it stays top during scroll. */}
            <div className="fixed top-16 left-0 right-0 z-30 bg-[#0f172a]/95 backdrop-blur-xl border-b border-transparent pt-2 pb-4">
              <div className="max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl px-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg group-focus-within:opacity-100 opacity-50 transition-opacity"></div>
                  <div className="relative flex items-center bg-surface border border-white/10 rounded-2xl p-4 shadow-xl">
                    <Search className="text-slate-400 mr-3" size={24} />
                    <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Type app name here..." 
                      className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-lg font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      // autoFocus removed as per request
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white p-1">
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Results */}
            {/* Added mt-24 to push content below the fixed search bar */}
            <section className="space-y-4 mt-24 px-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                 Results ({filteredApps.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <AppCard key={app.id} app={app} onClick={setSelectedApp} />
                  ))
                ) : (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 opacity-60">
                    <Search size={48} className="mb-4 text-slate-700" />
                    <p>No apps found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {(activeTab !== 'home' && activeTab !== 'search') && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-[slideUp_0.3s_ease-out]">
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

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;