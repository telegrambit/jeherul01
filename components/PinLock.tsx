
import React, { useState, useEffect } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { Delete, Lock, ShieldCheck, ShieldAlert, Timer } from 'lucide-react';
import { hashValue } from '../services/security';

const motion = framerMotion as any;

interface PinLockProps {
  onSuccess: () => void;
  expectedPin?: string; // This is now a HASH
}

const PinLock: React.FC<PinLockProps> = ({ onSuccess, expectedPin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Default Pin Hash (0000)
  const fallbackPinHash = '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0';
  const targetPinHash = expectedPin || fallbackPinHash;

  // --- Lockout Timer Logic ---
  useEffect(() => {
    const checkLockStatus = () => {
        const lockedUntil = localStorage.getItem('promptverse_lock_until');
        if (lockedUntil) {
            const remaining = Math.ceil((parseInt(lockedUntil) - Date.now()) / 1000);
            if (remaining > 0) {
                setIsLocked(true);
                setTimeLeft(remaining);
            } else {
                if (isLocked) {
                    setIsLocked(false);
                    setPin('');
                    localStorage.removeItem('promptverse_lock_until');
                }
            }
        } else {
             if (isLocked) setIsLocked(false);
        }
    };

    checkLockStatus();
    const interval = setInterval(checkLockStatus, 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  const handlePress = (num: string) => {
    if (isLocked || success) return;
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    if (isLocked || success) return;
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  // --- Validation Logic ---
  useEffect(() => {
    const validatePin = async () => {
        if (pin.length === 4) {
          const inputHash = await hashValue(pin);
          
          if (inputHash === targetPinHash) {
            setSuccess(true);
            localStorage.removeItem('promptverse_failed_attempts');
            localStorage.removeItem('promptverse_lock_until');
            setTimeout(() => onSuccess(), 800);
          } else {
            // Handle Failure
            setError(true);
            const attempts = parseInt(localStorage.getItem('promptverse_failed_attempts') || '0') + 1;
            localStorage.setItem('promptverse_failed_attempts', attempts.toString());
            
            let lockDuration = 0;
            if (attempts === 1) lockDuration = 5;
            else if (attempts === 2) lockDuration = 10;
            else if (attempts >= 3) lockDuration = 3600; // 1 Hour

            if (lockDuration > 0) {
                const lockUntil = Date.now() + (lockDuration * 1000);
                localStorage.setItem('promptverse_lock_until', lockUntil.toString());
                setPin(''); 
                setIsLocked(true);
                setTimeLeft(lockDuration);
            } else {
                setTimeout(() => setPin(''), 500);
            }
          }
        }
    };
    validatePin();
  }, [pin, targetPinHash, onSuccess]);

  const formatTime = (s: number) => {
    if (s >= 3600) return `${Math.floor(s/3600)}h ${Math.ceil((s%3600)/60)}m`;
    if (s >= 60) return `${Math.floor(s/60)}m ${s%60}s`;
    return `${s}s`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#09090b] font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-200/50 dark:from-indigo-900/10 to-transparent" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center p-6"
      >
        
        {/* --- Header Icon & Text --- */}
        <div className="mb-10 flex flex-col items-center text-center">
            <AnimatePresence mode="wait">
                {isLocked ? (
                     <motion.div 
                        key="locked"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="mb-6 p-5 rounded-3xl bg-red-50 dark:bg-red-900/20 shadow-lg border border-red-100 dark:border-red-900/30 text-red-500"
                     >
                        <Timer size={36} className="animate-pulse" />
                     </motion.div>
                ) : success ? (
                    <motion.div 
                        key="success"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="mb-6 p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 shadow-lg border border-emerald-100 dark:border-emerald-900/30 text-emerald-500"
                    >
                        <ShieldCheck size={36} />
                    </motion.div>
                ) : (
                    <motion.div 
                        key="normal"
                        animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                        className={`mb-6 p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-300 ${error ? 'text-red-500 border-red-500/20' : 'text-slate-900 dark:text-white'}`}
                    >
                        {error ? <ShieldAlert size={36} /> : <Lock size={36} />}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <h2 className={`text-2xl font-bold tracking-tight mb-2 transition-colors ${isLocked ? 'text-red-500' : error ? 'text-red-500' : success ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                {isLocked ? 'System Locked' : success ? 'Access Granted' : error ? 'Incorrect PIN' : 'Security Check'}
            </h2>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium h-5">
                {isLocked 
                  ? <span>Try again in <span className="font-bold text-slate-900 dark:text-white font-mono">{formatTime(timeLeft)}</span></span> 
                  : success ? 'Verifying credentials...' 
                  : 'Enter your 4-digit passcode'}
            </p>
        </div>

        {/* --- Dots --- */}
        <motion.div 
            animate={error && !isLocked ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex gap-6 mb-12 h-4"
        >
            {!isLocked && [0, 1, 2, 3].map((i) => (
                <div key={i} className="relative w-4 h-4 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-300 ${error ? 'border-red-200 dark:border-red-900/50' : 'border-slate-300 dark:border-slate-700'}`} />
                    <motion.div 
                        initial={false}
                        animate={{ scale: i < pin.length ? 1 : 0 }}
                        className={`w-full h-full rounded-full ${error ? 'bg-red-500' : success ? 'bg-emerald-500' : 'bg-slate-900 dark:bg-white'}`}
                    />
                </div>
            ))}
        </motion.div>

        {/* --- Keypad --- */}
        <motion.div 
            animate={{ opacity: isLocked ? 0.5 : 1, filter: isLocked ? 'grayscale(1)' : 'grayscale(0)' }}
            className="w-full max-w-[320px] grid grid-cols-3 gap-x-6 gap-y-5"
        >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <KeypadButton 
                    key={num} 
                    num={num} 
                    onClick={() => handlePress(num.toString())} 
                    disabled={isLocked || success} 
                />
            ))}
            
            <div />
            <KeypadButton num={0} onClick={() => handlePress('0')} disabled={isLocked || success} />
            
            <div className="flex items-center justify-center">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    disabled={isLocked || success}
                    className="w-20 h-20 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Delete size={26} strokeWidth={1.5} />
                </motion.button>
            </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

const KeypadButton: React.FC<{ num: number; onClick: () => void; disabled: boolean }> = ({ num, onClick, disabled }) => (
    <div className="flex items-center justify-center">
        <motion.button
            whileTap={{ scale: disabled ? 1 : 0.85, backgroundColor: disabled ? "transparent" : "rgba(255,255,255,0.1)" }}
            onClick={onClick}
            disabled={disabled}
            className="w-20 h-20 rounded-full text-3xl font-light text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 focus:outline-none flex items-center justify-center select-none disabled:opacity-20 disabled:cursor-not-allowed"
        >
            {num}
        </motion.button>
    </div>
);

export default PinLock;
