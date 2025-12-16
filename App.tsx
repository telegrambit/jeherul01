import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import PinLock from './components/PinLock';
import SecurityGuard from './components/SecurityGuard';
import { AppState, Prompt, Category, ContactMessage } from './types';
import { loadState, saveState, exportData } from './services/storage';
import { hashValue } from './services/security';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, LogOut, ShieldCheck } from 'lucide-react';

const motion = framerMotion as any;

// --- GLOBAL ALERT POPUP COMPONENT (PREMIUM & CLEAN) ---
interface AlertPopupProps {
  isOpen: boolean;
  message: string;
  type: 'success' | 'info' | 'error';
  onClose: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ isOpen, message, type, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Disappears after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const config = {
    success: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    error: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" }
  };

  const Style = config[type];
  const Icon = Style.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-6 left-0 right-0 z-[200] flex justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto flex items-center gap-4 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-full shadow-2xl pl-2 pr-6 py-2"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${Style.bg} ${Style.color}`}>
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {message}
                </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


const App: React.FC = () => {
  // State initialization
  const [state, setState] = useState<AppState>(loadState());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // New Global Alert State
  const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; type: 'success' | 'info' | 'error' }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const [wishlist, setWishlist] = useState<string[]>(state.wishlist || []);
  
  // --- AUTH STATE (LOCAL ONLY) ---
  // Using sessionStorage so login persists on refresh but clears on tab close
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
      return sessionStorage.getItem('promptverse_auth') === 'true';
  });
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);

  // Sync wishlist state
  useEffect(() => {
    setState(prev => ({ ...prev, wishlist }));
  }, [wishlist]);

  // Persist state
  useEffect(() => {
    saveState(state);
  }, [state]);

  // --- Auto-Delete Messages older than 24 Hours ---
  useEffect(() => {
    const cleanOldMessages = () => {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      
      const recentMessages = state.messages.filter(msg => {
        return (now - msg.timestamp) < oneDay;
      });

      if (recentMessages.length !== state.messages.length) {
        setState(prev => ({ ...prev, messages: recentMessages }));
      }
    };
    cleanOldMessages();
    const interval = setInterval(cleanOldMessages, 3600000); 
    return () => clearInterval(interval);
  }, [state.messages]);

  // --- Helpers ---
  const triggerAlert = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setAlertState({ isOpen: true, message, type });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleTrackVisit = () => {
    setState(prev => ({
      ...prev,
      analytics: [...(prev.analytics || []), Date.now()]
    }));
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
        if (prev.includes(id)) {
            return prev.filter(pId => pId !== id);
        } else {
            triggerAlert("Added to Collection", 'success');
            return [...prev, id];
        }
    });
  };

  // Actions
  const addPrompt = (prompt: Prompt) => {
    const newPrompt = { ...prompt, id: prompt.id || generateId() };
    setState(prev => ({ ...prev, prompts: [...prev.prompts, newPrompt] }));
    triggerAlert("Prompt saved to Library!", 'success');
  };

  const deletePrompt = (id: string) => {
    setState(prev => ({ 
      ...prev, 
      prompts: prev.prompts.filter(p => p.id !== id) 
    }));
    triggerAlert("Prompt deleted successfully", 'info');
  };

  const addCategory = (category: Category) => {
    if (state.categories.some(c => c.id === category.id)) {
      triggerAlert('Category already exists!', 'error');
      return;
    }
    setState(prev => ({ ...prev, categories: [...prev.categories, category] }));
    triggerAlert("New Category added!", 'success');
  };

  const deleteCategory = (id: string) => {
    if (id === 'all') {
      triggerAlert("Cannot delete the 'All' category.", 'error');
      return;
    }
    setState(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
    if (activeCategory === id) {
        setActiveCategory('all');
    }
    triggerAlert("Category removed.", 'info');
  };

  const addMessage = (msg: Omit<ContactMessage, 'id' | 'timestamp'>) => {
    const newMessage: ContactMessage = {
      id: generateId(),
      timestamp: Date.now(),
      ...msg
    };
    setState(prev => ({ ...prev, messages: [newMessage, ...prev.messages] }));
  };

  const clearMessages = () => {
    setState(prev => ({ ...prev, messages: [] }));
    triggerAlert("Inbox cleared.", 'success');
  };

  const deleteMessage = (id: string) => {
    setState(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) }));
  };

  const handleImport = (importedState: AppState) => {
    setState(importedState);
    triggerAlert("Data imported successfully!", 'success');
  };

  const handleExport = () => {
    exportData(state);
    triggerAlert("Backup file downloaded!", 'success');
  };

  // --- Auth Handlers ---
  
  const handleLogin = async (username: string, pass: string) => {
      const userHash = await hashValue(username);
      const passHash = await hashValue(pass);

      // Verify against stored state or default values
      if (userHash === state.adminUsername && passHash === state.adminPassword) {
          setIsAuthenticated(true);
          sessionStorage.setItem('promptverse_auth', 'true');
          triggerAlert(`Welcome back, ${username}`, 'success');
      } else {
          throw new Error("Invalid Credentials");
      }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setIsPinVerified(false);
      sessionStorage.removeItem('promptverse_auth');
      triggerAlert("Logged out successfully", 'info');
  };

  const updateCredentials = (usernameHash: string, passwordHash: string) => {
      setState(prev => ({
          ...prev,
          adminUsername: usernameHash,
          adminPassword: passwordHash
      }));
      // Force logout to test new credentials
      handleLogout();
  };

  const updatePin = (newPinHash: string) => {
    setState(prev => ({ ...prev, adminPin: newPinHash }));
    triggerAlert("Security PIN updated!", 'success');
  };

  // --- Admin Route Logic ---
  const renderAdminRoute = () => {
    
    // 1. Not Logged In -> Show Local Login Form
    if (!isAuthenticated) {
      return (
        <Login 
          onLoginSuccess={handleLogin} 
        />
      );
    }

    // 2. Logged In -> Optional PIN Lock Layer
    if (!isPinVerified) {
      return (
        <PinLock 
          onSuccess={() => setIsPinVerified(true)}
          expectedPin={state.adminPin}
        />
      );
    }

    // 3. Fully Authorized -> Show Admin Panel
    return (
      <div className="relative">
          <AdminPanel 
            state={state}
            onAddPrompt={addPrompt}
            onDeletePrompt={deletePrompt}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
            onImport={handleImport}
            onExport={handleExport}
            onClearMessages={clearMessages}
            onDeleteMessage={deleteMessage}
            onUpdateCredentials={updateCredentials}
            onUpdatePin={updatePin}
            onLogout={handleLogout}
          />
      </div>
    );
  };

  return (
    <SecurityGuard>
      <HashRouter>
        {/* Render Global Alert */}
        <AlertPopup 
            isOpen={alertState.isOpen} 
            message={alertState.message} 
            type={alertState.type} 
            onClose={closeAlert} 
        />

        <Layout
          categories={state.categories}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        >
          <Routes>
            <Route path="/" element={<Hero onSendMessage={addMessage} onTrackVisit={handleTrackVisit} />} />
            <Route 
              path="/gallery" 
              element={
                <Gallery 
                  prompts={state.prompts} 
                  activeCategory={activeCategory} 
                  searchQuery={searchQuery}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                />
              } 
            />
            <Route 
              path="/admin" 
              element={renderAdminRoute()} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </SecurityGuard>
  );
};

export default App;