import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

export default function Lightbox({ isOpen, onClose, imageUrl, altText }: LightboxProps) {
  
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="absolute top-6 right-6 flex gap-4 z-50">
            <button onClick={(e) => { e.stopPropagation(); handleZoomIn(); }} className="text-white hover:text-[var(--color-primary)] transition-colors bg-black/50 p-2 rounded-full border border-white/10">
              <ZoomIn className="w-6 h-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleZoomOut(); }} className="text-white hover:text-[var(--color-primary)] transition-colors bg-black/50 p-2 rounded-full border border-white/10">
              <ZoomOut className="w-6 h-6" />
            </button>
            <button onClick={onClose} className="text-white hover:text-red-500 transition-colors bg-black/50 p-2 rounded-full border border-white/10">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div 
            className="w-full h-full p-4 md:p-12 flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} 
              src={imageUrl} 
              alt={altText} 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: scale, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-full max-h-full object-contain rounded cursor-grab active:cursor-grabbing shadow-2xl"
              drag
              dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
              onDoubleClick={() => setScale(scale > 1 ? 1 : 2)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
