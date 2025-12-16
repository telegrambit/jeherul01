import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Download, Upload, Save, X, 
  Image as ImageIcon, Layers, Search, Zap, ListFilter, Mail, Clock, Trash, Settings, Lock, CheckCircle, Fingerprint, ShieldAlert,
  Activity, TrendingUp, Users, Eye, MoreHorizontal, PenTool, LayoutTemplate, Database, UploadCloud, Globe, Check, Link as LinkIcon, AlertCircle, RefreshCw, Palette, Hash, Command, Workflow, GripVertical, Sparkles, ChevronRight, BarChart3, LogOut, KeyRound, User, Shield, Monitor, Square
} from 'lucide-react';
import { AppState, Prompt, Category, RecipeStep } from '../types';
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
  onImport: (data: AppState) => void;
  onExport: () => void;
  onClearMessages: () => void;
  onDeleteMessage: (id: string) => void;
  onUpdateCredentials: (username: string, password: string) => void;
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
  state, onAddPrompt, onDeletePrompt, onAddCategory, onDeleteCategory, onImport, onExport, onClearMessages, onDeleteMessage, onUpdateCredentials, onUpdatePin, onLogout
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

  // Modals & Delete Confirmation State
  const [showInbox, setShowInbox] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'prompt' | 'category', id: string, name?: string } | null>(null);

  // Settings State
  const [newUsername, setNewUsername] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [settingTab, setSettingTab] = useState<'account' | 'pin'>('account');

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

  // --- RECIPE LOGIC ---
  const addRecipeStep = () => {
    setRecipeSteps([...recipeSteps, { 
        id: generateSafeId(), 
        type: 'image', 
        label: '', 
        imageUrl: '' // Not used in UI but kept for structure
    }]);
  };

  const removeRecipeStep = (id: string) => {
    setRecipeSteps(recipeSteps.filter(step => step.id !== id));
  };

  const updateRecipeStep = (id: string, field: 'label' | 'imageUrl', value: string) => {
    setRecipeSteps(recipeSteps.map(step => {
        if (step.id === id) {
            return { ...step, [field]: value };
        }
        return step;
    }));
  };

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

  const initiateDelete = (type: 'prompt' | 'category', id: string, name?: string) => {
    setDeleteTarget({ type, id, name });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'prompt') onDeletePrompt(deleteTarget.id);
    else onDeleteCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleCredentialsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword && newUsername.trim()) {
      const userHash = await hashValue(newUsername);
      const passHash = await hashValue(newPassword);
      onUpdateCredentials(userHash, passHash);
      setNewPassword(''); setConfirmPassword(''); setNewUsername('');
      alert("Credentials updated!");
    }
    if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
        const pinHash = await hashValue(newPin);
        onUpdatePin(pinHash);
        setNewPin('');
        alert("PIN updated!");
    }
    if((!newPassword || (newPassword===confirmPassword)) && (!newPin || newPin.length===4)) setShowSettings(false);
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
                    <button onClick={() => { setNewUsername(''); setShowSettings(true); }} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all" title="Settings"><Settings size={20} /></button>
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
                                    <div className="relative group">
                                        <select value={catId} onChange={e => setCatId(e.target.value)} className="w-full appearance-none bg-slate-50 dark:bg-[#131620] border-0 rounded-2xl px-6 py-4 font-medium text-slate-900 dark:text-white shadow-sm hover:bg-slate-100 dark:hover:bg-[#1A1D2B] focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-all">
                                            {state.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center pointer-events-none shadow-sm text-emerald-500">
                                            <Layers size={14} />
                                        </div>
                                    </div>
                                </div>

                                {/* 2.5 Format Toggle */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-violet-500 uppercase tracking-widest mb-3 pl-1">
                                        <Monitor size={14} /> Format
                                    </label>
                                    <div className="flex bg-slate-50 dark:bg-[#131620] p-1.5 rounded-2xl border-0 shadow-inner">
                                        <button 
                                            type="button"
                                            onClick={() => setFormat('square')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${format === 'square' ? 'bg-white dark:bg-slate-700 text-violet-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                        >
                                            <Square size={16} /> Square
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setFormat('thumbnail')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${format === 'thumbnail' ? 'bg-white dark:bg-slate-700 text-violet-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                        >
                                            <Monitor size={16} /> Thumbnail
                                        </button>
                                    </div>
                                </div>
                            </div>
                                
                            {/* 3. Smart Image Input */}
                            <div>
                                <label className="flex items-center justify-between text-xs font-bold text-pink-500 uppercase tracking-widest mb-3 pl-1">
                                    <span className="flex items-center gap-2"><ImageIcon size={14} /> Result Image</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 ${inputType === 'empty' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : inputType === 'url' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                                        {inputType === 'empty' ? 'Paste ID or URL' : inputType === 'url' ? <><Globe size={10}/> Direct Link</> : <><UploadCloud size={10}/> Cloudinary</>}
                                    </span>
                                </label>
                                <div className="relative group">
                                    <input 
                                        value={imageInput} 
                                        onChange={e => setImageInput(e.target.value)} 
                                        className={`w-full bg-slate-50 dark:bg-[#131620] border-0 rounded-2xl px-6 py-4 pl-14 font-medium text-slate-900 dark:text-white shadow-inner focus:ring-2 outline-none transition-all placeholder:text-slate-400 ${inputType === 'url' ? 'focus:ring-blue-500' : inputType === 'cloud_id' ? 'focus:ring-orange-500' : 'focus:ring-pink-500'}`} 
                                        placeholder="e.g. 'folder/image1' or 'https://...'" 
                                    />
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${inputType === 'empty' ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : inputType === 'url' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'}`}>
                                        {inputType === 'empty' ? <LinkIcon size={14} /> : inputType === 'url' ? <Globe size={14} /> : <UploadCloud size={14} />}
                                    </div>
                                </div>
                            </div>

                            {/* 4. Preview Panel */}
                            <AnimatePresence>
                                {imageUrl && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, height: 0 }} 
                                        animate={{ opacity: 1, scale: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                        className="rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-800 group/preview"
                                    >
                                        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                                            <CheckCircle size={12} className="text-emerald-400" /> Verified Source
                                        </div>
                                        {/* Aspect Ratio Controlled by format */}
                                        <div className={`w-full bg-slate-900 relative ${format === 'thumbnail' ? 'aspect-video' : 'aspect-[21/9]'}`}>
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover/preview:opacity-100 transition-opacity duration-500" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Invalid+Source')} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 5. Formula Builder */}
                            <div className="bg-slate-50 dark:bg-[#131620] rounded-3xl p-6 border border-slate-200 dark:border-slate-800/50">
                                <div className="flex justify-between items-center mb-6">
                                    <label className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest">
                                        <Workflow size={14} /> "How to Use" Formula
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={addRecipeStep}
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
                                    >
                                        <Plus size={14} /> Add Input Image
                                    </button>
                                </div>

                                {/* Flow Visualizer */}
                                <div className="flex flex-col gap-4">
                                    {recipeSteps.length === 0 ? (
                                        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                                            Click "Add Input Image" to create a formula (e.g., You + Style = Result)
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {recipeSteps.map((step, index) => (
                                                <div key={step.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 font-bold text-xs shrink-0 border border-amber-200 dark:border-amber-900/50">
                                                        {index + 1}
                                                    </div>
                                                    
                                                    {/* Input Group - Only Label Now */}
                                                    <div className="flex-1">
                                                        <div className="relative">
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/70"><Fingerprint size={14} /></div>
                                                            <input 
                                                                value={step.label}
                                                                onChange={(e) => updateRecipeStep(step.id, 'label', e.target.value)}
                                                                placeholder="Label (e.g. 'You', 'Style Reference')"
                                                                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-xs font-medium border-0 focus:ring-1 focus:ring-amber-500 transition-all"
                                                            />
                                                        </div>
                                                    </div>

                                                    <button onClick={() => removeRecipeStep(step.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Preview of the Flow */}
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-3">Live Result Preview</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {recipeSteps.map((step) => (
                                                <div key={step.id} className="flex items-center gap-2">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{step.label || '...'}</span>
                                                    </div>
                                                    <Plus size={12} className="text-slate-400" />
                                                </div>
                                            ))}
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-500">
                                                    <PenTool size={18} />
                                                </div>
                                                <span className="text-[10px] font-bold text-indigo-500 uppercase">Prompt</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 6. Description Editor */}
                            <div className="relative group">
                                <div className="flex justify-between items-center mb-3 pl-1">
                                    <label className="flex items-center gap-2 text-xs font-bold text-violet-500 uppercase tracking-widest">
                                        <MoreHorizontal size={14} /> Prompt Text
                                    </label>
                                    <div className="text-[10px] font-bold text-violet-500 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-md">
                                        {desc.length} chars
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea 
                                        rows={6} 
                                        value={desc} 
                                        onChange={e => setDesc(e.target.value)} 
                                        className="w-full bg-slate-50 dark:bg-[#131620] border-0 rounded-3xl p-6 text-slate-900 dark:text-white leading-relaxed shadow-inner focus:ring-2 focus:ring-violet-500 outline-none resize-none placeholder:text-slate-400 font-medium pr-6" 
                                        placeholder="Describe your visual concept in detail..." 
                                    />
                                </div>
                            </div>

                            {/* 7. Tags & Submit */}
                            <div className="flex flex-col md:flex-row gap-6 items-end">
                                <div className="flex-1 w-full">
                                    <label className="flex items-center gap-2 text-xs font-bold text-cyan-500 uppercase tracking-widest mb-3 pl-1">
                                        <Hash size={14} /> Tags
                                    </label>
                                    <div className="relative">
                                        <input 
                                            value={tags} 
                                            onChange={e => setTags(e.target.value)} 
                                            className="w-full bg-slate-50 dark:bg-[#131620] border-0 rounded-2xl px-6 py-4 font-medium text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-400" 
                                            placeholder="cinematic, 8k, octane..." 
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    type="button" 
                                    onClick={handleSubmitPrompt}
                                    className="w-full md:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-slate-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group/save"
                                >
                                    <Save size={20} className="group-hover/save:scale-110 transition-transform" />
                                    <span>Publish</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </motion.div>

                {/* --- Right: Library Manager (4 Cols) --- */}
                <motion.div variants={item} className="xl:col-span-4 space-y-6">
                    
                    {/* Category Manager */}
                    <div className="bg-white dark:bg-[#0B0F19] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <Layers size={16} className="text-emerald-500" /> Categories
                        </h3>
                        <form onSubmit={handleSubmitCategory} className="flex gap-2 mb-4 relative z-10">
                            <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="New Category..." className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                            <button type="submit" className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 shadow-lg"><Plus size={18} /></button>
                        </form>
                        <div className="flex flex-wrap gap-2 relative z-10 max-h-[150px] overflow-y-auto custom-scrollbar">
                            {state.categories.filter(c => c.id !== 'all').map(cat => (
                                <div key={cat.id} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:border-emerald-500/50 transition-colors">
                                    {cat.name}
                                    <button type="button" onClick={() => initiateDelete('category', cat.id, cat.name)} className="p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors"><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Library Playlist */}
                    <div className="bg-white dark:bg-[#0B0F19] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-[600px] overflow-hidden relative">
                         <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-[#0B0F19] to-transparent z-10 pointer-events-none" />
                        
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-20">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                <ListFilter size={16} className="text-indigo-500" /> Recent Prompts
                            </h3>
                            <div className="relative group">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input value={manageSearch} onChange={e => setManageSearch(e.target.value)} placeholder="Filter library..." className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-10 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar pb-24">
                            <AnimatePresence>
                                {managedPrompts.map((p, i) => (
                                    <motion.div 
                                        layout 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: -10 }} 
                                        transition={{ delay: i * 0.03 }} 
                                        key={p.id} 
                                        className="group flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50 cursor-default"
                                    >
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 relative shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                            <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">{p.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">{p.categoryId}</span>
                                                {p.format === 'thumbnail' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/20 text-violet-500 uppercase">Thumb</span>}
                                            </div>
                                        </div>
                                        <button onClick={() => initiateDelete('prompt', p.id, p.title)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"><Trash2 size={16} /></button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {managedPrompts.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                                    <Search size={32} className="text-slate-300 mb-2" />
                                    <p className="text-sm font-medium">No prompts found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </motion.div>
            </div>
        </motion.div>

        {/* --- MODALS (Inbox, Settings, Analytics, Delete) --- */}
        
        {/* Inbox Modal */}
        <Modal isOpen={showInbox} onClose={() => setShowInbox(false)} title="Inbox" icon={Mail}>
             <div className="space-y-4">
                {state.messages.map(msg => (
                    <div key={msg.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl relative group">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{msg.name}</h4>
                                <p className="text-xs text-slate-400">{new Date(msg.timestamp).toLocaleString()}</p>
                            </div>
                            <button onClick={() => onDeleteMessage(msg.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">{msg.message}</p>
                    </div>
                ))}
                {state.messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><Mail size={24} /></div>
                        <p className="text-slate-500">Your inbox is empty.</p>
                    </div>
                )}
            </div>
        </Modal>

        {/* --- PREMIUM SETTINGS MODAL --- */}
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="System Settings" icon={Lock} maxWidth="max-w-md">
            <div className="flex flex-col h-full">
                
                {/* Custom Tabs */}
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-6">
                    <button 
                        onClick={() => setSettingTab('account')} 
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${settingTab === 'account' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Credentials
                    </button>
                    <button 
                        onClick={() => setSettingTab('pin')} 
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${settingTab === 'pin' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Security PIN
                    </button>
                </div>

                <form onSubmit={handleCredentialsUpdate} className="flex-1 space-y-6">
                    
                    {settingTab === 'account' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div className="relative group">
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block pl-2">Username</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        value={newUsername} 
                                        onChange={e => setNewUsername(e.target.value)} 
                                        placeholder="Enter new username" 
                                        className="w-full pl-10 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium" 
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-4 pt-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block pl-2">Password Update</label>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        type="password"
                                        value={newPassword} 
                                        onChange={e => setNewPassword(e.target.value)} 
                                        placeholder="New Password" 
                                        className="w-full pl-10 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium" 
                                    />
                                </div>
                                <div className="relative group">
                                    <CheckCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        type="password"
                                        value={confirmPassword} 
                                        onChange={e => setConfirmPassword(e.target.value)} 
                                        placeholder="Confirm Password" 
                                        className="w-full pl-10 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium" 
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {settingTab === 'pin' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center py-4">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto text-indigo-500 border border-indigo-100 dark:border-indigo-900/30">
                                <KeyRound size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Pin Protection</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This 4-digit PIN is required every time you access the Admin Dashboard.</p>
                            </div>
                             <div className="relative group max-w-[200px] mx-auto">
                                <input 
                                    value={newPin} 
                                    onChange={e => setNewPin(e.target.value)} 
                                    placeholder="0000" 
                                    maxLength={4} 
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-500 transition-all tracking-[0.5em] text-center font-bold text-2xl" 
                                />
                            </div>
                        </motion.div>
                    )}

                    <div className="pt-4">
                        <button type="submit" className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg shadow-slate-900/10 dark:shadow-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
        
        {/* Analytics Modal */}
        <Modal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} title="Analytics Overview" icon={BarChart3}>
            <div className="text-center py-8">
                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{state.analytics.length}</h2>
                <p className="text-slate-500 uppercase tracking-widest text-sm font-bold mb-8">Total "Try Now" Clicks</p>
                <div className="h-40 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 text-sm">
                    Chart visualization coming soon...
                </div>
            </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
            {deleteTarget && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="relative bg-white dark:bg-[#0B0F19] p-8 rounded-[2.5rem] max-w-sm w-full text-center border border-slate-200 dark:border-slate-800 shadow-2xl"
                    >
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-100 dark:border-red-900/30">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="font-bold text-2xl dark:text-white mb-2">Delete Item?</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">"{deleteTarget.name}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-colors">Delete</button>
                        </div>
                     </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminPanel;