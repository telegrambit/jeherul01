import React, { useState, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { AppCard } from './components/AppCard';
import { AppDetails } from './components/AppDetails';
import { MOCK_APPS, CATEGORIES } from './constants';
import { AppData, Tab } from './types';
import { Search, Flame, Gamepad2, UserCircle, Hexagon, X, ChevronRight, ArrowLeft, Music, Film, Camera, Hammer, Sparkles, TrendingUp, Star, Send, MessageSquare, Check, Edit3, Save, CheckCircle, Heart, Plane, User, Mail, ShieldCheck, Quote } from 'lucide-react';

// 9 High-Quality Modern Avatars (Micah Style)
const AVATARS = [
  'https://api.dicebear.com/9.x/micah/svg?seed=Felix',
  'https://api.dicebear.com/9.x/micah/svg?seed=Aneka',
  'https://api.dicebear.com/9.x/micah/svg?seed=Christopher',
  'https://api.dicebear.com/9.x/micah/svg?seed=Jeane',
  'https://api.dicebear.com/9.x/micah/svg?seed=Sasha',
  'https://api.dicebear.com/9.x/micah/svg?seed=Funny',
  'https://api.dicebear.com/9.x/micah/svg?seed=Midnight',
  'https://api.dicebear.com/9.x/micah/svg?seed=Cuddles',
  'https://api.dicebear.com/9.x/micah/svg?seed=Willow'
];

// Initial Mock Public Feedbacks
const INITIAL_FEEDBACKS = [
  { id: 1, name: "Rahul Gaming", avatar: AVATARS[1], rating: 5, time: "2h ago", text: "Best mod store ever! The Minecraft mod works perfectly. 100% Trusted." },
  { id: 2, name: "Sarah K.", avatar: AVATARS[4], rating: 5, time: "5h ago", text: "Super fast downloads and no viruses. Design is also very OP! ❤️" },
  { id: 3, name: "Mike Tech", avatar: AVATARS[6], rating: 4, time: "1d ago", text: "Can you add more simulation games? Otherwise 10/10 app." }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Profile States
  const [userName, setUserName] = useState("Mod Master");
  const [tempName, setTempName] = useState("");
  
  const [currentAvatar, setCurrentAvatar] = useState(AVATARS[0]);
  const [tempAvatar, setTempAvatar] = useState(AVATARS[0]);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  // Rating & Review System States
  const [userRating, setUserRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [publicFeedbacks, setPublicFeedbacks] = useState(INITIAL_FEEDBACKS);
  
  // Request / Contact Form States
  const [isContactMode, setIsContactMode] = useState(false); // Toggle state: false = Request Mod, true = Contact Owner
  const [requestName, setRequestName] = useState('');
  const [requestAppName, setRequestAppName] = useState(''); // Only for Request Mode
  const [contactEmail, setContactEmail] = useState('');     // Only for Contact Mode
  const [requestText, setRequestText] = useState('');
  
  const [isRequestSuccess, setIsRequestSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
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

  // Profile Handlers
  const openEditProfile = () => {
    setTempName(userName);
    setTempAvatar(currentAvatar);
    setShowEditProfileModal(true);
  };

  const saveProfileChanges = () => {
    if (tempName.trim()) {
      setUserName(tempName);
    }
    setCurrentAvatar(tempAvatar);
    setShowEditProfileModal(false);
  };

  const handleSendRequest = () => {
    // Validation based on mode
    if (!requestText.trim() || !requestName.trim()) return;
    if (isContactMode && !contactEmail.trim()) return;
    if (!isContactMode && !requestAppName.trim()) return;
    
    // Start Sending Animation
    setIsSending(true);
    
    // Simulate API delay / Animation duration
    setTimeout(() => {
        setIsSending(false);
        setIsRequestSuccess(true);
        
        // Reset after showing success message for 3 seconds
        setTimeout(() => {
            setIsRequestSuccess(false);
            setRequestText('');
            setRequestName('');
            setRequestAppName('');
            setContactEmail('');
        }, 3000);
    }, 1500); // 1.5s for the flying animation
  };

  const handleSubmitFeedback = () => {
    // Create new review object
    const newReview = {
      id: Date.now(),
      name: userName, // Use current profile name
      avatar: currentAvatar, // Use current profile avatar
      rating: userRating,
      time: "Just now",
      text: feedbackText || "Rated with " + userRating + " stars! ⭐"
    };

    // Add to top of list
    setPublicFeedbacks([newReview, ...publicFeedbacks]);
    setFeedbackSubmitted(true);

    setTimeout(() => {
      // Reset after 3 seconds so they can rate again if they want
      setFeedbackSubmitted(false);
      setUserRating(0);
      setFeedbackText("");
    }, 3000);
  };

  const handleTelegramJoin = () => {
    // Logic to open telegram
    window.open('https://telegram.org', '_blank');
  };

  const handleFavoritesClick = () => {
    // Visual feedback only since we don't have a favorites page yet
    alert("Favorites feature coming soon!");
  };

  // Icon helper for search categories
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Games': return <Gamepad2 className="text-purple-400" size={20} />;
      case 'Music': return <Music className="text-pink-400" size={20} />;
      case 'Entertainment': return <Film className="text-orange-400" size={20} />;
      case 'Photography': return <Camera className="text-blue-400" size={20} />;
      case 'Tools': return <Hammer className="text-gray-400" size={20} />;
      default: return <Sparkles className="text-yellow-400" size={20} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-[#0f172a]">
      
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-4 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl w-full transition-all duration-300">
        
        {activeTab === 'search' ? (
          /* SEARCH HEADER MODE - COMPACT */
          <div className="w-full flex items-center animate-[slideUp_0.2s_ease-out]">
             <form onSubmit={handleSearchSubmit} className="relative w-full group">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-md opacity-40 group-focus-within:opacity-80 transition-opacity"></div>
               <div className="relative flex items-center bg-surface/80 border border-white/10 rounded-xl px-3 py-2 shadow-sm transition-all focus-within:border-primary/50 focus-within:bg-surface">
                 <Search className="text-slate-400 mr-2 shrink-0" size={18} />
                 <input 
                    ref={searchInputRef}
                    type="text"
                    className="bg-transparent border-none outline-none text-white w-full text-sm font-medium placeholder:text-slate-500"
                    placeholder="Search mods, games..."
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
                        <X size={16} />
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
            
            <div className="flex items-center gap-1">
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-300 active:scale-95 transition-transform"
                onClick={() => setActiveTab('profile')}
              >
                <UserCircle size={26} className={activeTab === 'profile' ? 'text-primary' : ''} />
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
              /* EMPTY STATE - DASHBOARD STYLE (COMPACTED) */
              <div className="space-y-6 pt-2 pb-20">
                {/* Popular Searches Tags */}
                <section>
                  <div className="flex items-center gap-2 mb-3 text-slate-400 px-1">
                    <TrendingUp size={14} />
                    <h2 className="text-xs font-bold uppercase tracking-wider">Trending Searches</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Minecraft', 'Spotify Premium', 'Free Fire Max', 'GTA V', 'Netflix Mod', 'Roblox', 'Lightroom'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-2 bg-surface rounded-lg text-xs text-slate-300 font-medium border border-white/5 active:scale-95 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Browse Categories Grid */}
                <section>
                   <div className="flex items-center gap-2 mb-3 text-slate-400 px-1">
                    <Sparkles size={14} />
                    <h2 className="text-xs font-bold uppercase tracking-wider">Browse Categories</h2>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     {CATEGORIES.filter(c => c !== 'All').map(cat => (
                       <div 
                         key={cat}
                         onClick={() => setSearchQuery(cat)}
                         className="h-16 rounded-xl bg-surface border border-white/5 flex items-center px-4 gap-3 cursor-pointer active:scale-95 transition-all hover:bg-white/5 group relative overflow-hidden shadow-sm"
                       >
                         <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
                         
                         <div className="w-9 h-9 rounded-full bg-[#0f172a] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                            {getCategoryIcon(cat)}
                         </div>
                         <span className="font-bold text-white text-sm tracking-tight">{cat}</span>
                       </div>
                     ))}
                   </div>
                </section>
              </div>
            ) : (
              /* RESULTS STATE */
              <section className="space-y-4 mt-2 px-1">
                <div className="flex items-center justify-between">
                   <h2 className="text-base font-bold text-white">Results <span className="text-slate-500 text-xs font-medium">({filteredApps.length})</span></h2>
                   {filteredApps.length > 0 && <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-lg">Best Match</span>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-20">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                       <AppCard key={app.id} app={app} onClick={setSelectedApp} />
                    ))
                  ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 opacity-60">
                      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-white/5">
                         <Search size={24} className="text-slate-600" />
                      </div>
                      <p className="text-base font-bold text-slate-400">No apps found</p>
                      <p className="text-xs">Try searching for "{CATEGORIES[1]}"</p>
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

        {/* PROFILE TAB CONTENT */}
        {activeTab === 'profile' && (
          <div className="animate-[slideUp_0.3s_ease-out] pb-6">
            
            {/* 1. Profile Info Card with Avatar Edit */}
            <div className="bg-surface rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden mb-6 flex flex-col items-center">
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"></div>
               
               <div className="relative mb-6 group">
                 <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-primary to-secondary shadow-2xl">
                    <img 
                      src={currentAvatar} 
                      alt="User Avatar" 
                      className="w-full h-full rounded-full bg-[#0f172a] object-cover border-4 border-[#0f172a]"
                    />
                 </div>
                 {/* Pencil Icon for Avatar Edit */}
                 <button 
                   onClick={openEditProfile}
                   className="absolute bottom-1 right-1 bg-white text-black p-2 rounded-full shadow-lg active:scale-90 transition-transform hover:bg-primary hover:text-white"
                 >
                    <Edit3 size={16} />
                 </button>
               </div>

               {/* Name Display */}
               <div className="flex items-center gap-2 relative z-10">
                   <h2 className="text-2xl font-bold text-white">{userName}</h2>
               </div>
            </div>

            {/* Edit Profile Modal (Name & Avatar) */}
            {showEditProfileModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[slideUp_0.2s_ease-out]">
                <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative flex flex-col max-h-[90vh]">
                  
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                    <button onClick={() => setShowEditProfileModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                  </div>

                  <div className="overflow-y-auto no-scrollbar flex-1">
                      {/* Name Input Section */}
                      <div className="mb-6">
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Display Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                            <input 
                              type="text" 
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white font-medium focus:outline-none focus:border-primary focus:bg-surface/80 transition-all placeholder:text-slate-600"
                              placeholder="Enter your name"
                            />
                        </div>
                      </div>

                      {/* Avatar Grid Section */}
                      <div className="mb-2">
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Choose Avatar</label>
                        <div className="grid grid-cols-3 gap-4 place-items-center">
                          {AVATARS.map((avi, idx) => (
                            <button 
                              key={idx}
                              onClick={() => setTempAvatar(avi)}
                              className={`w-20 h-20 rounded-full border-2 transition-all overflow-hidden active:scale-90 relative ${tempAvatar === avi ? 'border-primary shadow-[0_0_20px_rgba(139,92,246,0.5)] ring-2 ring-primary/50' : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'}`}
                            >
                              <img src={avi} alt={`Avatar ${idx}`} className="w-full h-full object-cover bg-surface" />
                              {tempAvatar === avi && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <Check className="text-white drop-shadow-md" size={24} strokeWidth={3} />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                  </div>
                  
                  {/* Save Button */}
                  <div className="pt-6 mt-2 border-t border-white/5">
                    <button 
                        onClick={saveProfileChanges}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Favorites and Telegram Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <button 
                  onClick={handleFavoritesClick}
                  className="bg-surface p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-all group relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Heart className="text-pink-500 fill-pink-500/20" size={24} />
                  </div>
                  <span className="text-white font-bold text-sm">My Favorites</span>
               </button>

               <button 
                  onClick={handleTelegramJoin}
                  className="bg-surface p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-all group relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Plane className="text-blue-500 fill-blue-500/20 -rotate-45 translate-x-1" size={24} />
                  </div>
                  <span className="text-white font-bold text-sm">Join Telegram</span>
               </button>
            </div>

            {/* 3. Feedback System (Rate Us with Review Input) */}
            <div className="bg-surface rounded-3xl p-6 border border-white/5 shadow-lg mb-6 text-center transition-all duration-300">
              {feedbackSubmitted ? (
                 <div className="py-4 flex flex-col items-center animate-[slideUp_0.3s_ease-out]">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                       <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Thank You!</h3>
                    <p className="text-slate-400 text-sm">Your feedback helps us improve.</p>
                 </div>
              ) : (
                <>
                  <h3 className="text-white font-bold text-lg mb-1">Rate ModVerse</h3>
                  <p className="text-slate-400 text-sm mb-4">How is your experience so far?</p>
                  
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="transition-transform active:scale-90 hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          size={32} 
                          fill={star <= userRating ? "#fbbf24" : "none"} 
                          className={star <= userRating ? "text-amber-400 drop-shadow-md" : "text-slate-600"}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                  
                  {/* Dynamic Review Input */}
                  {userRating > 0 && (
                    <div className="animate-[slideUp_0.2s_ease-out]">
                      <textarea 
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Tell us what you think... (Optional)"
                        className="w-full bg-[#0f172a] rounded-xl border border-white/10 p-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none h-20 mb-3"
                      />
                      <button 
                        onClick={handleSubmitFeedback}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                         Submit Feedback <Send size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 4. Request Mod / Contact Owner (SWITCH TOGGLE IMPLEMENTED) */}
            <div className="bg-surface rounded-3xl p-6 border border-white/5 shadow-lg relative overflow-hidden min-h-[360px] flex flex-col justify-center transition-all mb-6">
               
               {/* Header & Toggle Switch */}
               {!isSending && !isRequestSuccess && (
                 <div className="flex flex-col gap-4 mb-5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isContactMode ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'}`}>
                            {isContactMode ? <Mail size={20} /> : <MessageSquare size={20} />}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{isContactMode ? 'Contact Owner' : 'Request a Mod'}</h3>
                            <p className="text-slate-400 text-xs">{isContactMode ? 'Send a direct message to admin' : 'Tell us what app you need next'}</p>
                          </div>
                       </div>
                    </div>

                    {/* Premium Segmented Switch */}
                    <div className="flex bg-[#0f172a] rounded-xl p-1 border border-white/10 relative">
                       <button 
                         onClick={() => setIsContactMode(false)}
                         className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all z-10 ${!isContactMode ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                       >
                         Request Mod
                       </button>
                       <button 
                         onClick={() => setIsContactMode(true)}
                         className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all z-10 ${isContactMode ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                       >
                         Contact Owner
                       </button>
                       {/* Sliding Background */}
                       <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface rounded-lg transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isContactMode ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}></div>
                    </div>
                 </div>
               )}

               {isSending ? (
                 <div className="flex flex-col items-center justify-center h-full animate-[slideUp_0.3s_ease-out]">
                    <div className="relative">
                      {/* Pulse Ring Effect */}
                      <div className={`absolute inset-0 rounded-full animate-pulse scale-150 ${isContactMode ? 'bg-blue-500/20' : 'bg-primary/20'}`}></div>
                      
                      {/* Flying Paper Plane Container */}
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center z-10 animate-flyAway ${isContactMode ? 'bg-blue-500/10' : 'bg-primary/10'}`}>
                         <Send size={32} className={`${isContactMode ? 'text-blue-500' : 'text-primary'} -rotate-45 translate-x-1 translate-y-1`} strokeWidth={2.5} />
                      </div>
                    </div>
                    <p className={`${isContactMode ? 'text-blue-500' : 'text-primary'} font-bold mt-8 animate-pulse`}>Sending {isContactMode ? 'Message' : 'Request'}...</p>
                 </div>
               ) : isRequestSuccess ? (
                 <div className="flex flex-col items-center justify-center animate-[slideUp_0.3s_ease-out] h-full">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                       <CheckCircle size={48} className="text-green-500" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{isContactMode ? 'Message Sent!' : 'Request Sent!'}</h3>
                    <p className="text-slate-400 text-center text-sm px-4">
                      {isContactMode 
                        ? 'We will get back to your email shortly.' 
                        : <>We've notified the team about <strong>{requestAppName}</strong>.</>}
                    </p>
                 </div>
               ) : (
                 <div className="animate-[slideUp_0.3s_ease-out] flex flex-col gap-3">
                   {/* Name Input */}
                   <div>
                     <input 
                       type="text"
                       value={requestName}
                       onChange={(e) => setRequestName(e.target.value)}
                       placeholder="Your Name"
                       className="w-full bg-[#0f172a] rounded-xl border border-white/10 p-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors text-sm"
                     />
                   </div>
                   
                   {/* DYNAMIC FIELD: App Name vs Gmail */}
                   <div>
                     {isContactMode ? (
                        <input 
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Your Gmail / Email"
                          className="w-full bg-[#0f172a] rounded-xl border border-white/10 p-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                        />
                     ) : (
                        <input 
                          type="text"
                          value={requestAppName}
                          onChange={(e) => setRequestAppName(e.target.value)}
                          placeholder="App Name (e.g. Minecraft)"
                          className="w-full bg-[#0f172a] rounded-xl border border-white/10 p-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                        />
                     )}
                   </div>

                   {/* Message Input */}
                   <div className="relative">
                     <textarea 
                       value={requestText}
                       onChange={(e) => setRequestText(e.target.value)}
                       placeholder={isContactMode ? "Type your message to admin..." : "Additional details (version, features...)"}
                       className={`w-full h-24 bg-[#0f172a] rounded-xl border border-white/10 p-4 text-white placeholder:text-slate-600 focus:outline-none transition-colors resize-none text-sm ${isContactMode ? 'focus:border-blue-500/50' : 'focus:border-primary/50'}`}
                     />
                   </div>
                   
                   <button 
                     onClick={handleSendRequest}
                     disabled={!requestText.trim() || !requestName.trim() || (isContactMode ? !contactEmail.trim() : !requestAppName.trim())}
                     className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                        isContactMode 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/20 hover:shadow-blue-500/30' 
                        : 'bg-gradient-to-r from-primary to-secondary shadow-primary/20 hover:shadow-primary/30'
                     }`}
                   >
                     {isContactMode ? 'Send Message' : 'Send Request'} <Send size={18} />
                   </button>
                 </div>
               )}
            </div>

            {/* 5. VERIFIED REVIEWS (Moved to bottom as requested) */}
            <section className="mb-6 animate-[slideUp_0.3s_ease-out]">
              <div className="flex items-center gap-2 mb-3 px-1">
                 <ShieldCheck size={18} className="text-green-400" />
                 <h2 className="text-lg font-bold text-white">Verified Reviews <span className="text-slate-500 text-xs ml-1">({publicFeedbacks.length})</span></h2>
              </div>
              
              <div className="space-y-3">
                 {publicFeedbacks.map((fb) => (
                   <div key={fb.id} className="bg-surface/50 p-4 rounded-2xl border border-white/5 relative animate-[slideUp_0.2s_ease-out]">
                      <div className="flex items-center gap-3 mb-2">
                         <img src={fb.avatar} alt={fb.name} className="w-9 h-9 rounded-full bg-surface border border-white/10 object-cover" />
                         <div className="flex-1">
                            <h4 className="text-sm font-bold text-white leading-none mb-1">{fb.name}</h4>
                            <div className="flex text-amber-400">
                               {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={10} fill={i < fb.rating ? "currentColor" : "none"} className={i < fb.rating ? "" : "text-slate-600"} />
                               ))}
                            </div>
                         </div>
                         <span className="text-[10px] text-slate-500">{fb.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed pl-1">{fb.text}</p>
                      <Quote size={16} className="absolute top-4 right-4 text-white/5" fill="currentColor" />
                   </div>
                 ))}
              </div>
            </section>

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