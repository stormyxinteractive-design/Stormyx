import { useStore } from "../store";
import { translations } from "../translations";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Newswire() {
  const { news, language } = useStore();
  const t = translations[language];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-12 lg:px-8"
      >
        {t.newswire}
      </motion.h1>
      
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 lg:px-8">
          {news.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={item.id}
            >
              <Link to={`/news/${item.id}`} className="group block cursor-pointer">
                <div className="aspect-[16/9] overflow-hidden rounded-xl mb-4 relative bg-black border border-white/5 shadow-[0_0_0_0_var(--color-primary)] transition-all duration-300 group-hover:shadow-[0_0_20px_var(--color-primary)] group-hover:border-[var(--color-primary)]/50">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gray-900" />
                  )}
                  <div className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                    News
                  </div>
                </div>
                <h3 className="text-xl font-bold uppercase leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mt-2 font-mono">{item.date}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p>No news available.</p>
        </div>
      )}
    </div>
  );
}
