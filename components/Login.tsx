import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, ArrowRight, Lock, User, KeyRound } from 'lucide-react';
import { motion as framerMotion } from 'framer-motion';

const motion = framerMotion as any;

interface LoginProps {
  onLoginSuccess: (username: string, pass: string) => Promise<void>;
  errorMsg?: string;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, errorMsg }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    if (!username || !password) {
        setLocalError("Please enter both username and password.");
        setLoading(false);
        return;
    }

    try {
        await onLoginSuccess(username, password);
        // If success, parent handles routing
    } catch (err: any) {
        setLocalError("Invalid Credentials");
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 relative overflow-hidden">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "out" }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-center">
            
            {/* Header Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-2xl blur-lg opacity-40"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center shadow-lg border border-white/50 dark:border-white/5">
                        <Shield size={32} className="text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                        <div className="absolute -top-1 -right-1">
                             <Sparkles size={16} className="text-amber-400 fill-amber-400 animate-bounce" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Admin Portal
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                    Secure local access only.
                </p>
            </div>

            {/* Error Display */}
            {(errorMsg || localError) && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl p-3 flex items-center gap-3 text-left"
                >
                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                        {errorMsg || localError}
                    </p>
                </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                    />
                </div>
                
                <div className="relative group">
                    <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 relative overflow-hidden rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 py-3.5 flex items-center justify-center gap-2 font-bold transition-all duration-300 active:scale-95"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Login <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>
            
            <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Default: admin / admin123
            </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;