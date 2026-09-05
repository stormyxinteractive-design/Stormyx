import { useStore } from "../store";
import { translations } from "../translations";
import { Play } from "lucide-react";
import { useState } from "react";
import VideoModal from "../components/VideoModal";

export default function Videos() {
  const { videos, language } = useStore();
  const t = translations[language];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState("");

  const getThumbnail = (video: any) => {
    if (video.thumbnail) return video.thumbnail;
    const url = video.embedLink || "";
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000";
  };


  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto min-h-screen">
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-12">{t.videos}</h1>
      
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map(video => (
            <div key={video.id} className="group">
              <button onClick={() => { setActiveVideo(video.embedLink); setIsModalOpen(true); }} className="block w-full text-left relative aspect-video overflow-hidden rounded-xl bg-black border border-gray-800 mb-4">
                <img src={getThumbnail(video)} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur group-hover:bg-[var(--color-primary)] transition-colors border border-white/20">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </button>
              <h3 className="text-xl font-bold uppercase">{video.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p>No videos available.</p>
        </div>
      )}
      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoUrl={activeVideo} />
    </div>
  );
}
