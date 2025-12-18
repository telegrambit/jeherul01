
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Download, Upload, Save, X, 
  Image as ImageIcon, Layers, Search, Zap, ListFilter, Mail, Clock, Trash, Settings, Lock, CheckCircle, Fingerprint, ShieldAlert,
  Activity, TrendingUp, Users, Eye, MoreHorizontal, PenTool, LayoutTemplate, Database, UploadCloud, Globe, Check, Link as LinkIcon, AlertCircle, RefreshCw, Palette, Hash, Command, Workflow, GripVertical, Sparkles, ChevronRight, BarChart3, LogOut, KeyRound, User, Shield, Monitor, Square, Share2
} from 'lucide-react';
import { AppState, Prompt, Category, RecipeStep, SocialLink } from '../types';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { hashValue } from '../services/security';

const motion = framerMotion as any;

// ==========================================
// 🔴 CLOUDINARY CONFIGURATION 🔴
// ==========================================

const CLOUDINARY_CLOUD_NAME: string = "jeherul01"; 

// ==========================================

interface AdminPanelProps {
  state: AppState;
  onAddPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (id: string) => void;
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onAddSocialLink: (link: SocialLink) => void;
  onDeleteSocialLink: (id: string) => void;
  onImport: (data: AppState) => void;
  onExport: () => void;
  onClearMessages: () => void;
  onDeleteMessage: (id: string) => void;
  onUpdatePin: (newPin: string) => void;
  onLogout: () => void;
}

// --- PREMIUM UI COMPONENTS ---

const DashboardCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    onClick, 
    colorClass
}: { 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    icon: any; 
    onClick?: () => void; 
    colorClass: string;
}) => {
    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative overflow-hidden p-6 rounded-[2rem] border border-white/50 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-xl shadow-xl
                ${onClick ? 'cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10' : ''} transition-all duration-300 group
            `}
        >
            {/* Background Gradient Blob */}
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 blur-3xl ${colorClass}`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} className={colorClass.replace('bg-', 'text-').replace('/20', '')} />
                </div>
                {onClick && <div className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={16} /></div>}
            </div>
            
            <div className="relative z-10">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">{value}</h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
                {subtitle && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorClass.replace('bg-', 'bg-').replace('500', '500/10').replace('text-', 'text-') + ' text-' + colorClass.split('-')[1] + '-500'}`}>
                            {subtitle}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const Modal = ({ isOpen, onClose, title, children, icon: Icon, maxWidth = "max-w-xl" }: any) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    onClick={onClose} 
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className={`relative w-full ${maxWidth} bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]`}
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-[#0B0F19]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                                <Icon size={20} className="text-indigo-500" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white">{title}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {children}
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- HELPER FOR URL RESOLUTION ---
const resolveImageUrl = (input: string) => {
    if (!input) return '';
    if (input.startsWith('http://') || input.startsWith('https://')) return input;
    const cleanId = input.startsWith('/') ? input.substring(1) : input;
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${cleanId}`;
};

// --- MAIN ADMIN PANEL ---

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  state, onAddPrompt, onDeletePrompt, onAddCategory, onDeleteCategory, onAddSocialLink, onDeleteSocialLink, onImport, onExport, onClearMessages, onDeleteMessage, onUpdatePin, onLogout
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  // Single Input for Main Image
  const [imageInput, setImageInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [inputType, setInputType] = useState<'empty' | 'url' | 'cloud_id'>('empty');

  const [catId, setCatId] = useState(state.categories[0]?.id || 'all');
  const [tags, setTags] = useState('');
  
  // Recipe State (Unique Feature)
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([]);
  
  // Format State (Square vs Thumbnail)
  const [format, setFormat] = useState<'square' | 'thumbnail'>('square');

  const [newCatName, setNewCatName] = useState('');
  const [manageSearch, setManageSearch] = useState('');

  // Social Media State
  const [socialPlatform, setSocialPlatform] = useState<SocialLink['platform']>('instagram');
  const [socialUrl, setSocialUrl] = useState('');

  // Modals & Delete Confirmation State
  const [showInbox, setShowInbox] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'prompt' | 'category' | 'social', id: string, name?: string } | null>(null);

  // Settings State
  const [newPin, setNewPin] = useState('');
  const [settingTab, setSettingTab] = useState<'pin'>('pin');

  const generateSafeId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  // --- SMART URL DETECTION LOGIC (Main Image) ---
  useEffect(() => {
    const val = imageInput.trim();
    if (!val) { setImageUrl(''); setInputType('empty'); return; }
    if (val.startsWith('http://') || val.startsWith('https://')) { setImageUrl(val); setInputType('url'); } 
    else {
        setImageUrl(resolveImageUrl(val));
        setInputType('cloud_id');
    }
  }, [imageInput]);

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || title.trim() === "") { alert("Please enter a Title."); return; }
    if (!desc || desc.trim() === "") { alert("Please enter a Description."); return; }
    if (!imageInput || imageInput.trim() === "") { alert("Please enter an Image Source."); return; }

    try {
        onAddPrompt({
          id: generateSafeId(),
          title,
          description: desc,
          imageUrl, 
          categoryId: catId,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          createdAt: Date.now(),
          recipe: recipeSteps,
          format: format // Save selected format
        });
        
        // Reset Form
        setTitle(''); setDesc(''); setImageInput(''); setTags(''); setRecipeSteps([]); setFormat('square');
    } catch (err) {
        console.error("Error adding prompt:", err);
        alert("An unexpected error occurred.");
    }
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    onAddCategory({ id: newCatName.toLowerCase().replace(/\s+/g, '-'), name: newCatName, icon: 'Tag' });
    setNewCatName('');
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if(!socialUrl) return;
    onAddSocialLink({ id: '', platform: socialPlatform, url: socialUrl });
    setSocialUrl('');
  };

  const initiateDelete = (type: 'prompt' | 'category' | 'social', id: string, name?: string) => {
    setDeleteTarget({ type, id, name });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'prompt') onDeletePrompt(deleteTarget.id);
    else if (deleteTarget.type === 'category') onDeleteCategory(deleteTarget.id);
    else if (deleteTarget.type === 'social') onDeleteSocialLink(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
        const pinHash = await hashValue(newPin);
        onUpdatePin(pinHash);
        setNewPin('');
        alert("PIN updated!");
        setShowSettings(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const parsed = JSON.parse(evt.target?.result as string);
            if (parsed.prompts) onImport(parsed);
        } catch (err) { alert('Invalid File'); }
    };
    reader.readAsText(file);
  };

  const managedPrompts = useMemo(() => state.prompts
    .filter(p => {
        const term = manageSearch.toLowerCase().trim();
        return !term || p.title.toLowerCase().includes(term) || p.tags.some(t => t.toLowerCase().includes(term));
    })
    .slice().reverse(), [state.prompts, manageSearch]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="w-full min-h-screen pb-20 px-4 md:px-8 pt-6 max-w-[1600px] mx-auto font-sans text-slate-900 dark:text-white">
        
        {/* --- Header Section --- */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center gap-3">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Hub</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Manage your entire ecosystem from one place.</p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <button onClick={onExport} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-indigo-500 transition-all" title="Backup"><Download size={20} /></button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                    <label className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-all cursor-pointer" title="Import">
                        <Upload size={20} />
                        <input type="file" className="hidden" accept=".json" onChange={handleFileImport} />
                    </label>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                    <button onClick={() => { setNewPin(''); setShowSettings(true); }} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all" title="Settings"><Settings size={20} /></button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                    {/* LOGOUT BUTTON IN HEADER */}
                    <button onClick={onLogout} className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-500 hover:text-red-500 transition-all" title="Logout"><LogOut size={20} /></button>
                </div>
            </motion.div>

            {/* --- Stats Grid (Premium Widgets) --- */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Analytics" value="Traffic" subtitle="View Trends" icon={Activity} onClick={() => setShowAnalytics(true)} colorClass="bg-indigo-500" />
                <DashboardCard title="Total Prompts" value={state.prompts.length} subtitle="+ Added Today" icon={Layers} colorClass="bg-blue-500" />
                <DashboardCard title="Categories" value={state.categories.length - 1} subtitle="Active Tags" icon={LayoutTemplate} colorClass="bg-emerald-500" />
                <DashboardCard title="Inbox" value={state.messages.length} subtitle={state.messages.length > 0 ? "New Messages" : "All Caught Up"} icon={Mail} onClick={() => setShowInbox(true)} colorClass={state.messages.length > 0 ? "bg-amber-500" : "bg-slate-500"} />
            </motion.div>

            {/* --- Main Content Split --- */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* --- Left: Creator Studio (8 Cols) --- */}
                <motion.div variants={item} className="xl:col-span-8 space-y-6">
                    <div className="relative bg-white dark:bg-[#0B0F19] rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                        
                        {/* High-Tech Header */}
                        <div className="relative p-8 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-[#0B0F19] dark:to-[#111422]">
                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <Palette size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Creator Studio</h3>
                                        <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">New Entry Mode</p>
                                    </div>
                                </div>
                                <button onClick={() => { setTitle(''); setDesc(''); setImageInput(''); setTags(''); setRecipeSteps([]); setFormat('square'); }} className="group/reset flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
                                    <RefreshCw size={14} className="group-hover/reset:rotate-180 transition-transform duration-500" /> Reset
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-8 relative z-10 space-y-8 bg-white dark:bg-[#0B0F19]">
                            
                            {/* 1. Title Input */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 pl-1">
                                    <PenTool size={14} /> Project Title
                                </label>
                                <div className="relative group focus-within:scale-[1.01] transition-transform duration-300">
                                    <input 
                                        value={title} 
                                        onChange={e => setTitle(e.target.value)} 
                                        className="w-full bg-slate-50 dark:bg-[#131620] border-0 rounded-2xl px-6 py-5 text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-[#1A1D2B] transition-all outline-none" 
                                        placeholder="Name your masterpiece..." 
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none opacity-50">
                                        <Command size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* 2. Category Select */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 pl-1">
                                        <Layers size={14} /> Category
                                    </label>
                                    <div className="relative">
                                        <select 
                                            value={catId} 
                                            onChange={e => setCatId(e.target.value)} 
                                            className="w-full appearance-none bg-slate-50 dark:bg-[#131620] border-0 rounded-2xl px-6 py-5 font-bold text-slate-700 dark:text-slate-300 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1A1D2B] transition-colors"
                                        >
                                            {state.categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={20} />
                                    </div>
                                </div>

                                {/* 3. Image Input */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 pl-1">
                                        <ImageIcon size={14} /> Visual Source
                                    </label>
                                    <div className="relative group focus-within:ring-2 focus-within:ring-blue-500 rounded-2xl transition-all">
                                        <input 
                                            value={imageInput} 
                                            onChange={e => setImageInput(e.target.value)} 
                                            className="w-full bg-slate-50 dark:bg-[#131620] border-0 rounded-2xl px-6 py-5 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner outline-none"
                                            placeholder="Paste URL or Cloudinary ID" 
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {inputType === 'url' && <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><LinkIcon size={16} /></div>}
                                            {inputType === 'cloud_id' && <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><UploadCloud size={16} /></div>}
                                            {inputType === 'empty' && <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400"><ImageIcon size={16} /></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Format Selection */}
                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131620] border border-slate-100 dark:border-slate-800">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                                    <Monitor size={14} /> Display Format
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setFormat('square')}
                                        className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${format === 'square' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-transparent bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    >
                                        <Square size={24} />
                                        <span className="font-bold text-sm">Square (1:1)</span>
                                        {format === 'square' && <div className="absolute top-2 right-2 text-indigo-500"><CheckCircle size={16} /></div>}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormat('thumbnail')}
                                        className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${format === 'thumbnail' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-transparent bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    >
                                        <Monitor size={24} />
                                        <span className="font-bold text-sm">Thumbnail (16:9)</span>
                                        {format === 'thumbnail' && <div className="absolute top-2 right-2 text-indigo-500"><CheckCircle size={16} /></div>}
                                    </button>
                                </div>
                            </div>

                            {/* 5. Tags */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-purple-500 uppercase tracking-widest mb-3 pl-1">
                                    <Hash size={14} /> Keywords
                                </label>
                                <div className="relative">
                                    <input 
                                        value={tags} 
                                        onChange={e => setTags(e.target.value)} 
                                        className="w-full bg-slate-50 dark:bg-[#131620] border-0 rounded-2xl px-6 py-5 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="Comma separated tags (e.g. cyberpunk, neon, 8k)" 
                                    />
                                </div>
                            </div>

                            {/* 6. Description */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">
                                    <ListFilter size={14} /> Prompt Details
                                </label>
                                <textarea 
                                    value={desc} 
                                    onChange={e => setDesc(e.target.value)} 
                                    rows={5} 
                                    className="w-full bg-slate-50 dark:bg-[#131620] border-0 rounded-2xl px-6 py-5 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 shadow-inner focus:ring-2 focus:ring-slate-500 outline-none resize-none leading-relaxed" 
                                    placeholder="Enter the detailed prompt description here..." 
                                />
                            </div>

                            <button 
                                onClick={handleSubmitPrompt} 
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <Sparkles size={20} className="fill-white/20" />
                                Publish to Gallery
                            </button>

                        </div>
                    </div>
                </motion.div>

                {/* --- Right: Management & List (4 Cols) --- */}
                <motion.div variants={item} className="xl:col-span-4 space-y-6">
                    
                    {/* Categories Manager */}
                    <div className="bg-white dark:bg-[#0B0F19] rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Layers size={18} className="text-emerald-500" /> Categories
                        </h3>
                        <div className="flex gap-2 mb-4">
                            <input 
                                value={newCatName} 
                                onChange={e => setNewCatName(e.target.value)} 
                                placeholder="New Category" 
                                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" 
                            />
                            <button onClick={handleSubmitCategory} className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl transition-colors"><Plus size={20} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {state.categories.filter(c => c.id !== 'all').map(cat => (
                                <div key={cat.id} className="group flex items-center gap-2 pl-3 pr-1 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{cat.name}</span>
                                    <button onClick={() => initiateDelete('category', cat.id, cat.name)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-500"><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Media Manager */}
                    <div className="bg-white dark:bg-[#0B0F19] rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Share2 size={18} className="text-blue-500" /> Social Links
                        </h3>
                        <form onSubmit={handleAddSocial} className="flex flex-col gap-3 mb-4">
                            <select 
                                value={socialPlatform} 
                                onChange={(e) => setSocialPlatform(e.target.value as any)}
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
                            >
                                <option value="instagram">Instagram</option>
                                <option value="telegram">Telegram</option>
                                <option value="youtube">YouTube</option>
                                <option value="twitter">Twitter (X)</option>
                                <option value="facebook">Facebook</option>
                                <option value="discord">Discord</option>
                                <option value="website">Website</option>
                            </select>
                            <div className="flex gap-2">
                                <input 
                                    value={socialUrl} 
                                    onChange={e => setSocialUrl(e.target.value)} 
                                    placeholder="URL..." 
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm outline-none" 
                                />
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-colors"><Plus size={20} /></button>
                            </div>
                        </form>
                        <div className="space-y-2">
                            {(state.socialLinks || []).map(link => (
                                <div key={link.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-xs font-bold uppercase">{link.platform.substring(0,2)}</div>
                                        <span className="text-xs text-slate-500 truncate">{link.url}</span>
                                    </div>
                                    <button onClick={() => initiateDelete('social', link.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            {(!state.socialLinks || state.socialLinks.length === 0) && (
                                <p className="text-xs text-center text-slate-400 italic py-2">No links added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Manage Prompts List */}
                    <div className="bg-white dark:bg-[#0B0F19] rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col h-[500px]">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Database size={18} className="text-purple-500" /> Recent Prompts
                        </h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                value={manageSearch}
                                onChange={e => setManageSearch(e.target.value)}
                                placeholder="Search to edit..." 
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none" 
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                            {managedPrompts.map(prompt => (
                                <div key={prompt.id} className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all flex items-center gap-3">
                                    <img src={prompt.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-200" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{prompt.title}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{state.categories.find(c => c.id === prompt.categoryId)?.name || 'Unknown'}</p>
                                    </div>
                                    <button onClick={() => initiateDelete('prompt', prompt.id, prompt.title)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {managedPrompts.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No prompts found.</div>}
                        </div>
                    </div>

                </motion.div>
            </div>
        </motion.div>

        {/* --- MODALS --- */}

        {/* Delete Confirmation */}
        <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Deletion" icon={ShieldAlert}>
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} />
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-2">Are you sure you want to delete <br/> <span className="font-bold text-slate-900 dark:text-white">"{deleteTarget?.name || 'this item'}"</span>?</p>
                <p className="text-sm text-slate-500 mb-8">This action cannot be undone.</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => setDeleteTarget(null)} className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                    <button onClick={confirmDelete} className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/20">Delete Forever</button>
                </div>
            </div>
        </Modal>

        {/* Inbox Modal */}
        <Modal isOpen={showInbox} onClose={() => setShowInbox(false)} title="Messages" icon={Mail} maxWidth="max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">{state.messages.length} Messages</span>
                {state.messages.length > 0 && (
                    <button onClick={onClearMessages} className="text-xs font-bold text-red-500 hover:underline">Clear All</button>
                )}
            </div>
            <div className="space-y-4">
                {state.messages.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Mail size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No messages yet.</p>
                    </div>
                ) : (
                    state.messages.map(msg => (
                        <div key={msg.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">{msg.name.charAt(0)}</div>
                                    <span className="font-bold text-slate-900 dark:text-white">{msg.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-mono">{new Date(msg.timestamp).toLocaleDateString()}</span>
                                    <button onClick={() => onDeleteMessage(msg.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pl-10">{msg.message}</p>
                        </div>
                    ))
                )}
            </div>
        </Modal>

        {/* Analytics Placeholder */}
        <Modal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} title="Analytics" icon={Activity}>
             <div className="text-center py-12">
                <BarChart3 size={64} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Detailed Stats Coming Soon</h3>
                <p className="text-slate-500 max-w-xs mx-auto">We are building a comprehensive analytics dashboard to track views and engagement.</p>
             </div>
        </Modal>

        {/* Settings Modal */}
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Security Settings" icon={Shield}>
             <div className="space-y-6">
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30">
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">Admin Access PIN</h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-400">Update the 4-digit PIN required to access this dashboard.</p>
                </div>
                
                <form onSubmit={handleSecurityUpdate}>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New 4-Digit PIN</label>
                    <div className="flex gap-3">
                        <input 
                            type="password" 
                            maxLength={4}
                            value={newPin}
                            onChange={e => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="0000"
                            className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-center tracking-[1em] font-bold text-xl outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl transition-colors">Update</button>
                    </div>
                </form>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                    <p className="text-xs text-slate-400 text-center">
                        Authorized Personnel Only • Secure Connection
                    </p>
                </div>
             </div>
        </Modal>

    </div>
  );
};

export default AdminPanel;
