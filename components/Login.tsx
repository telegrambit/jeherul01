
import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion as framerMotion } from 'framer-motion';
import { loginWithGoogle, isAdmin, logoutUser } from '../services/firebase';

const motion = framerMotion as any;

interface LoginProps {
  onLoginSuccess: () => void;
  errorMsg?: string;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, errorMsg }) => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLocalError(null);

    try {
      const user = await loginWithGoogle();
      
      if (user && isAdmin(user)) {
        onLoginSuccess();
      } else {
        // Logged in but not an admin
        await logoutUser();
        setLocalError("Access Denied: You are not authorized.");
      }
    } catch (error: any) {
      console.error(error);
      setLocalError("Login failed. Please try again.");
    } finally {
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
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-2xl blur-lg opacity-40"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center shadow-lg border border-white/50 dark:border-white/5">
                        <Shield size={36} className="text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                        <div className="absolute -top-1 -right-1">
                             <Sparkles size={20} className="text-amber-400 fill-amber-400 animate-bounce" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Admin Portal
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                    Restricted access. Please sign in.
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

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl py-3.5 flex items-center justify-center gap-3 font-bold transition-all duration-300 active:scale-95 group"
            >
                {loading ? (
                    <Loader2 className="animate-spin text-indigo-500" size={20} />
                ) : (
                    <>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        <span>Sign in with Google</span>
                        <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </>
                )}
            </button>
            
            <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-widest font-bold opacity-60">
                Protected by Firebase Auth
            </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
