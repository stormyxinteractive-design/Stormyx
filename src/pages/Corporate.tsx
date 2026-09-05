import { useStore } from "../store";
import { translations } from "../translations";
import { Building2, Users2, Megaphone } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Corporate() {
  const { themeSettings, language } = useStore();
  const t = translations[language];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen"
    >
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-12"
      >
        {t.corporate}
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-white border-b border-gray-800 pb-2">{t.aboutUsTitle}</h2>
          <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">
            {themeSettings?.aboutText || "Stormyx Interactive is a premier AAA game development studio..."}
          </div>
        </motion.div>
        
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 p-6 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_5px_15px_-5px_var(--color-primary)] hover:border-[var(--color-primary)]/50 transition-all duration-300"
          >
            <Building2 className="w-8 h-8 text-[var(--color-primary)] mb-4" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">Headquarters</h3>
            <p className="text-gray-400 text-sm">New York, NY<br />United States</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black/50 p-6 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_5px_15px_-5px_var(--color-accent)] hover:border-[var(--color-accent)]/50 transition-all duration-300"
          >
            <Users2 className="w-8 h-8 text-[var(--color-accent)] mb-4" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">{t.careers}</h3>
            <p className="text-gray-400 text-sm mb-4">Join our team of passionate creators.</p>
            <Link to="/careers" className="text-[var(--color-primary)] font-bold uppercase text-sm hover:underline">{t.openPositions}</Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-black/50 p-6 rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_5px_15px_-5px_var(--color-tertiary)] hover:border-[var(--color-tertiary)]/50 transition-all duration-300"
          >
            <Megaphone className="w-8 h-8 text-[var(--color-tertiary)] mb-4" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">{t.pressMedia}</h3>
            <p className="text-gray-400 text-sm mb-4">For press inquiries and media resources.</p>
            <a href={`mailto:${themeSettings?.contactEmail}`} className="text-[var(--color-primary)] font-bold uppercase text-sm hover:underline">{themeSettings?.contactEmail || "pr@stormyx.com"}</a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
