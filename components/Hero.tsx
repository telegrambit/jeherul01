import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Check, Send, MessageSquare, Loader2, Sparkles, Zap, ChevronDown, Mail } from 'lucide-react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { SocialLink } from '../types';

const motion = framerMotion as any;

// --- Types for Props ---
interface HeroProps {
  onSendMessage: (msg: { name: string; message: string }) => void;
  onTrackVisit?: () => void;
  socialLinks: SocialLink[];
}

// --- Success Popup Component ---
const SuccessPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center text-center"
        >
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-900/10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Check size={40} strokeWidth={3} />
                </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Message Sent!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                We've received your message and will respond shortly. Thank you for reaching out.
            </p>
            <button 
                onClick={onClose}
                className="w-full py-4 rounded-2xl font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-xl hover:shadow-2xl hover:shadow-slate-500/20 dark:hover:shadow-none hover:-translate-y-0.5 transition-all active:scale-95"
            >
                Done
            </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- New "Card Style" Contact Form (Matched to Feedback Widget) ---
const ContactForm: React.FC<{ onSend: (data: { name: string; message: string }) => void }> = ({ onSend }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.message.trim()) return;
    
    setStatus('sending');
    setTimeout(() => {
      onSend(formState);
      setStatus('sent');
      setTimeout(() => {
        setStatus('idle');
        setFormState({ name: '', message: '' });
        setFocusedField(null);
        setShowPopup(true);
      }, 500);
    }, 1500);
  };

  return (
    <>
      <SuccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg mx-auto relative"
      >
        {/* Abstract Glow Background (Subtle) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 text-center mb-10">
             <span className="inline-block p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-indigo-500 mb-4 shadow-sm">
                <Mail size={24} />
             </span>
             <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                Let's start a <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">conversation.</span>
             </h3>
             <p className="text-slate-500 dark:text-slate-400 font-medium">
                Have an idea? We'd love to hear about it.
             </p>
        </div>

        {/* RESTORED CARD WRAPPER - Exactly matches FeedbackWidget styling */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input: Name */}
                <div className={`
                    group relative transition-all duration-300 rounded-[20px] p-1
                    ${focusedField === 'name' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-transparent'}
                `}>
                    <div className="relative bg-slate-50 dark:bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all group-hover:border-indigo-200 dark:group-hover:border-indigo-900">
                        <label 
                            htmlFor="name"
                            className={`absolute left-6 transition-all duration-200 pointer-events-none font-bold tracking-wide ${
                                focusedField === 'name' || formState.name 
                                ? 'top-3 text-[10px] text-indigo-500 uppercase' 
                                : 'top-1/2 -translate-y-1/2 text-slate-400'
                            }`}
                        >
                            Your Name
                        </label>
                        <input 
                            type="text" 
                            id="name"
                            value={formState.name}
                            onChange={e => setFormState({...formState, name: e.target.value})}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full h-16 sm:h-20 bg-transparent px-6 pt-6 pb-2 text-lg sm:text-xl font-medium text-slate-900 dark:text-white placeholder-transparent outline-none"
                            placeholder="Name"
                        />
                    </div>
                </div>

                {/* Input: Message */}
                <div className={`
                    group relative transition-all duration-300 rounded-[20px] p-1
                    ${focusedField === 'message' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-transparent'}
                `}>
                    <div className="relative bg-slate-50 dark:bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all group-hover:border-indigo-200 dark:group-hover:border-indigo-900">
                        <label 
                            htmlFor="message"
                            className={`absolute left-6 transition-all duration-200 pointer-events-none font-bold tracking-wide ${
                                focusedField === 'message' || formState.message 
                                ? 'top-4 text-[10px] text-indigo-500 uppercase' 
                                : 'top-6 text-slate-400'
                            }`}
                        >
                            Tell us everything
                        </label>
                        <textarea 
                            id="message"
                            rows={4}
                            value={formState.message}
                            onChange={e => setFormState({...formState, message: e.target.value})}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-transparent px-6 pt-8 pb-4 text-lg sm:text-xl font-medium text-slate-900 dark:text-white placeholder-transparent outline-none resize-none leading-relaxed"
                            placeholder="Message"
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                    <button 
                        disabled={status !== 'idle'}
                        className={`
                            w-full h-16 sm:h-20 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
                            ${status === 'sent' 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98]'
                            }
                            disabled:opacity-80 disabled:cursor-not-allowed
                        `}
                    >
                        {status === 'idle' && <>Send Message <ArrowRight className="bg-white/20 p-1 rounded-full" size={24} /></>}
                        {status === 'sending' && <Loader2 className="animate-spin" size={24} />}
                        {status === 'sent' && <>Message Sent <Check size={24} /></>}
                    </button>
                </div>
            </form>
        </div>
      </motion.div>
    </>
  );
};

// --- Professional Feedback Component ---
const FeedbackWidget = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRate = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Restored CARD Wrapper for Feedback */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800">
        
        <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.div
                        key="feedback-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <div className="mb-8 text-center">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Rate your experience</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                How likely are you to recommend us to a friend?
                            </p>
                        </div>

                        {/* Interactive Stars */}
                        <div className="flex items-center gap-3 mb-8" onMouseLeave={() => setHover(0)}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    key={star}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleRate(star)}
                                    onMouseEnter={() => setHover(star)}
                                    className="relative focus:outline-none p-1"
                                >
                                    <Star 
                                        size={36}
                                        className={`transition-all duration-300 filter ${
                                            star <= (hover || rating) 
                                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]' 
                                            : 'fill-transparent text-slate-300 dark:text-slate-700'
                                        }`}
                                        strokeWidth={star <= (hover || rating) ? 0 : 1.5}
                                    />
                                </motion.button>
                            ))}
                        </div>

                        {/* Conditional Expandable Area */}
                        <AnimatePresence>
                            {rating > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="w-full space-y-4"
                                >
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us a bit more... (optional)"
                                        rows={3}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none transition-all shadow-sm"
                                    />
                                    
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Submit Feedback'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Prompt hint if no stars selected yet */}
                        {rating === 0 && (
                             <div className="h-4" /> 
                        )}

                    </motion.div>
                ) : (
                    <motion.div
                        key="success-message"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-6 text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-500 shadow-inner">
                             <Check size={40} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Thank you!</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">
                            We appreciate your feedback. It helps us build a better product for everyone.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Hero Component ---
const Hero: React.FC<HeroProps> = ({ onSendMessage, onTrackVisit, socialLinks }) => {
  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  return (
    <div className="w-full bg-transparent">
      
      {/* Global Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none h-screen">
        <div className="absolute top-[40vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* --- SECTION 1: FULL SCREEN HERO (Clean View) --- */}
      <div className="relative z-10 w-full min-h-[85vh] flex flex-col items-center justify-center max-w-screen-xl mx-auto px-6 sm:px-6 lg:px-8 text-center pb-12 pt-10">
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6 sm:gap-8 w-full"
        >
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New Version 2.0
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={item} 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Start using <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
               AI prompts.
            </span>
          </motion.h1>

          {/* Minimal Description */}
          <motion.p 
            variants={item} 
            className="text-lg sm:text-2xl text-slate-500 dark:text-slate-400 max-w-lg sm:max-w-2xl font-medium leading-relaxed"
          >
            Streamline your creative workflow with our curated library of professional image generation prompts.
          </motion.p>

          {/* Minimal CTA Button - CONNECTED TO ANALYTICS */}
          <motion.div variants={item} className="pt-8 w-full sm:w-auto">
            <a 
              href="#/gallery" 
              onClick={() => {
                if(onTrackVisit) onTrackVisit();
              }}
              className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg shadow-slate-900/20 dark:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              {/* Button Pulse Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              
              <Zap size={16} className="fill-current" />
              <span>Start Exploring</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-widest opacity-70">
                No account required
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-600 hidden sm:flex flex-col items-center gap-2 pointer-events-none"
        >
            <span className="text-[10px] uppercase font-bold tracking-widest">Scroll</span>
            <ChevronDown size={20} />
        </motion.div>

      </div>

      {/* --- SECTION 2: INTERACTION HUB (Below the Fold) --- */}
      {/* Users must scroll to see this, keeping mobile view clean */}
      {/* Removed the background gradient (via-slate-50/50 etc) to match user request for no "white card like" bg */}
      <div className="relative z-10 w-full py-32 px-4">
         <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Contact Form */}
            <div id="contact" className="w-full scroll-mt-24">
                <ContactForm onSend={onSendMessage} />
            </div>

            {/* Divider */}
            <div className="w-24 h-px bg-slate-200 dark:bg-slate-800 mb-16"></div>

            {/* Feedback Widget */}
            <div id="feedback" className="w-full scroll-mt-24">
                <FeedbackWidget />
            </div>

         </div>
      </div>

    </div>
  );
};

export default Hero;