import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Check, Send, MessageSquare, Loader2 } from 'lucide-react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';

const motion = framerMotion as any;

// --- Types for Props ---
interface HeroProps {
  onSendMessage: (msg: { name: string; message: string }) => void;
  onTrackVisit?: () => void;
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

// --- Ultra Professional Contact Form ---
const ContactForm: React.FC<{ onSend: (data: { name: string; message: string }) => void }> = ({ onSend }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.message.trim()) return;
    
    setStatus('sending');
    // Simulate network delay for better UX
    setTimeout(() => {
      onSend(formState);
      setStatus('sent');
      
      // Show popup after brief delay
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
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg mx-auto mb-24 px-4"
      >
        <div className="relative group">
          {/* Abstract Decorative Background Blur */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] opacity-20 blur-xl group-hover:opacity-30 transition duration-1000"></div>
          
          <div className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 sm:p-10 shadow-2xl">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-10">
                  <div>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Get in touch.</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">We'd love to hear from you.</p>
                  </div>
                  <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                      <MessageSquare size={22} strokeWidth={1.5} />
                  </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Floating Label Input: Name */}
                  <div className="relative">
                      <input 
                          type="text" 
                          id="name"
                          value={formState.name}
                          onChange={e => setFormState({...formState, name: e.target.value})}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="peer w-full bg-slate-50 dark:bg-slate-950/50 border-0 rounded-xl px-5 pt-6 pb-2 text-slate-900 dark:text-white font-medium placeholder-transparent focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
                          placeholder="Name"
                      />
                      <label 
                          htmlFor="name"
                          className={`absolute left-5 transition-all duration-200 pointer-events-none text-slate-400 font-medium ${
                              focusedField === 'name' || formState.name 
                              ? 'top-2 text-[10px] uppercase tracking-wider text-indigo-500' 
                              : 'top-4 text-sm'
                          }`}
                      >
                          Your Name
                      </label>
                  </div>

                  {/* Floating Label Input: Message */}
                  <div className="relative">
                      <textarea 
                          id="message"
                          rows={3}
                          value={formState.message}
                          onChange={e => setFormState({...formState, message: e.target.value})}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          className="peer w-full bg-slate-50 dark:bg-slate-950/50 border-0 rounded-xl px-5 pt-6 pb-2 text-slate-900 dark:text-white font-medium placeholder-transparent focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none resize-none"
                          placeholder="Message"
                      />
                      <label 
                          htmlFor="message"
                          className={`absolute left-5 transition-all duration-200 pointer-events-none text-slate-400 font-medium ${
                              focusedField === 'message' || formState.message 
                              ? 'top-2 text-[10px] uppercase tracking-wider text-indigo-500' 
                              : 'top-4 text-sm'
                          }`}
                      >
                          How can we help?
                      </label>
                  </div>

                  {/* Action Button */}
                  <button 
                      disabled={status !== 'idle'}
                      className={`
                          w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300
                          ${status === 'sent' 
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]' 
                              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1'
                          }
                          disabled:opacity-80 disabled:cursor-not-allowed
                      `}
                  >
                      {status === 'idle' && <>Send Message <ArrowRight size={18} /></>}
                      {status === 'sending' && <Loader2 className="animate-spin" />}
                      {status === 'sent' && <>Message Sent <Check size={18} /></>}
                  </button>
              </form>
          </div>
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
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border-0 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none transition-all"
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
const Hero: React.FC<HeroProps> = ({ onSendMessage, onTrackVisit }) => {
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
      <div className="relative z-10 w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-8 w-full"
        >
          {/* Main Headline */}
          <motion.h1 
            variants={item} 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Start using AI prompts.
          </motion.h1>

          {/* Minimal Description */}
          <motion.p 
            variants={item} 
            className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed"
          >
            Streamline your creative workflow with our curated library of professional image generation prompts.
          </motion.p>

          {/* Minimal CTA Button - CONNECTED TO ANALYTICS */}
          <motion.div variants={item} className="pt-6">
            <Link 
              to="/gallery" 
              onClick={() => {
                // TRACKING CLICK HERE
                if(onTrackVisit) onTrackVisit();
              }}
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-xl shadow-slate-200 dark:shadow-none hover:scale-105"
            >
              Try Now
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator REMOVED */}

      </div>

      {/* --- SECTION 2: INTERACTION HUB (Below the Fold) --- */}
      {/* Users must scroll to see this, keeping mobile view clean */}
      <div className="relative z-10 w-full py-32 px-4 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-white/5">
         <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Contact Form */}
            <ContactForm onSend={onSendMessage} />

            {/* Divider */}
            <div className="w-24 h-px bg-slate-200 dark:bg-slate-800 mb-16"></div>

            {/* Feedback Widget */}
            <FeedbackWidget />

         </div>
      </div>

    </div>
  );
};

export default Hero;