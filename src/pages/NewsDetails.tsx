import { useState } from "react";
import Lightbox from "../components/Lightbox";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../store";
import { translations } from "../translations";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function NewsDetails() {
  const { id } = useParams();
  const { news, language } = useStore();
  const t = translations[language];

  const newsItem = news.find(n => n.id === id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!newsItem) {
    return (
      <div className="pt-32 pb-16 px-4 text-center min-h-screen">
        <h1 className="text-4xl font-bold uppercase mb-6">News not found</h1>
        <Link to="/news" className="text-[var(--color-primary)] hover:underline uppercase font-bold tracking-widest">
          Return to Newswire
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <Link to="/news" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 uppercase font-bold text-sm tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Back to Newswire
      </Link>
      
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4 leading-tight">
            {newsItem.title}
          </h1>
          <p className="text-[var(--color-primary)] font-mono font-bold tracking-wider">
            {newsItem.date}
          </p>
        </header>

        {newsItem.image && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
            <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} src={newsItem.image} alt={newsItem.title} onClick={() => setLightboxImage(newsItem.image || null)} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500" />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none prose-a:text-[var(--color-primary)]">
          <ReactMarkdown>{newsItem.content}</ReactMarkdown>
        </div>
      </motion.article>
    </div>
  );
}
