import { useStore } from "../store";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { translations } from "../translations";

export default function StorePage() {
  const { products, loading, language } = useStore();
  const t = translations[language];
  
  const clothing = products.filter(p => p.category === "clothing");
  const accessories = products.filter(p => p.category === "accessories");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 min-h-screen bg-transparent"
    >
      <div className="max-w-[1920px] mx-auto">
        {loading ? (
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="aspect-square bg-gray-800 animate-pulse rounded-xl"></div>
             ))}
           </div>
        ) : (
          <div className="space-y-16">
            {clothing.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Vestuário</h2>
                  <button className="text-sm font-bold hover:underline">Ver tudo →</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {clothing.map((product, i) => (
                     <motion.a 
                        href={product.buyLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={product.id} 
                        className="group flex flex-col cursor-pointer bg-[#0a0a0a] rounded overflow-hidden hover:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_var(--color-primary)]"
                     >
                        <div className="aspect-square bg-[#f0f0f0] overflow-hidden p-6 flex items-center justify-center">
                          <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} src={product.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl" />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-medium text-white mb-4 line-clamp-2 leading-snug">{product.name}</h3>
                          <div className="mt-auto">
                            <span className="font-bold text-lg">€ {product.price.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                     </motion.a>
                  ))}
                </div>
              </section>
            )}

            {accessories.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Acessórios</h2>
                  <button className="text-sm font-bold hover:underline">Ver tudo →</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {accessories.map((product, i) => (
                     <motion.a 
                        href={product.buyLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={product.id} 
                        className="group flex flex-col cursor-pointer bg-[#0a0a0a] rounded overflow-hidden hover:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_var(--color-primary)]"
                     >
                        <div className="aspect-square bg-[#f0f0f0] overflow-hidden p-6 flex items-center justify-center">
                          <img onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" }} src={product.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl" />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-medium text-white mb-4 line-clamp-2 leading-snug">{product.name}</h3>
                          <div className="mt-auto">
                            <span className="font-bold text-lg">€ {product.price.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                     </motion.a>
                  ))}
                </div>
              </section>
            )}
            
            {products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhum produto disponível no momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
