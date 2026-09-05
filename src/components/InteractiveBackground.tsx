import { useState, useEffect } from "react";
import { motion, useSpring } from "motion/react";

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(true);

  // Smooth springs for the cursor-following orb
  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsDesktop(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX - 150); // Offset to center the 300px orb
      springY.set(e.clientY - 150);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDesktop, springX, springY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--color-secondary)]">
      {/* Cinematic Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      
      {/* Ambient Glow */}
      <div className="absolute inset-0 z-0 opacity-40">
        {/* Static Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-primary)] mix-blend-screen blur-[120px] animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-accent)] mix-blend-screen blur-[120px] opacity-70" style={{ animation: "pulse 8s infinite alternate" }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-[var(--color-tertiary)] mix-blend-screen blur-[120px]" style={{ animation: "pulse 10s infinite alternate" }}></div>
      
      {/* Mouse Tracking Orb */}
      {isDesktop && (
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-[var(--color-primary)] mix-blend-screen blur-[100px] opacity-60"
          style={{
            x: springX,
            y: springY,
          }}
        />
      )}
      </div>
    </div>
  );
}
