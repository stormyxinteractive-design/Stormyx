import { useStore } from "../store";
import { translations } from "../translations";
import { Download as DownloadIcon } from "lucide-react";

export default function Downloads() {
  const { downloads, language } = useStore();
  const t = translations[language];

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4">
          {t.downloads}
        </h1>
        <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto"></div>
      </div>

      {downloads.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <p className="text-xl uppercase font-bold tracking-widest">Nenhum download disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {downloads.map((dl) => (
            <div key={dl.id} className="bg-black/50 border border-white/5 p-6 rounded-xl hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:shadow-[0_0_15px_var(--color-primary)] group">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-white mb-2">{dl.name}</h2>
              <p className="text-gray-400 mb-6 min-h-[48px]">{dl.description}</p>
              <a
                href={dl.link}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-white font-bold uppercase tracking-widest py-4 rounded transition-colors"
              >
                <DownloadIcon className="w-5 h-5" />
                Download Direto
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
