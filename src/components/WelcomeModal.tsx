import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { useStore } from "../store";
import { translations, LanguageCode } from "../translations";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useStore();
  const t = translations[language as LanguageCode];

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("stormyx_welcome");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Small delay to let the page load
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("stormyx_welcome", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[var(--color-secondary)] border border-gray-700 w-full max-w-lg rounded-2xl p-8 relative shadow-2xl overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-[var(--color-primary)]/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[var(--color-accent)]/20 rounded-full blur-[80px]"></div>

            <button 
              onClick={handleClose} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center mt-4">
              <div className="w-16 h-16 bg-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center border border-[var(--color-primary)]/30 mb-6">
                <Sparkles className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4 leading-tight">
                {(t as any).welcomeTitle || "Welcome to Stormyx Interactive!"}
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                {(t as any).welcomeDesc || "Get ready to explore our catalog and discover the latest in next-generation gaming."}
              </p>
              <button 
                onClick={handleClose}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold px-8 py-3 rounded-full uppercase tracking-widest transition-all w-full shadow-[0_0_20px_var(--color-primary)] hover:shadow-[0_0_30px_var(--color-primary)]"
              >
                {(t as any).welcomeBtn || "Explore Now"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
