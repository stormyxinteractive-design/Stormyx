import React from "react";
import { Monitor, Smartphone, Gamepad2 } from "lucide-react";

export function PlatformIcon({ platform, className = "w-4 h-4" }: { platform: string, className?: string }) {
  const p = platform.toLowerCase();
  
  if (p === "pc") return <Monitor className={className} />;
  if (p === "android" || p === "ios") return <Smartphone className={className} />;
  if (p === "playstation" || p === "xbox") return <Gamepad2 className={className} />;
  
  return <Gamepad2 className={className} />;
}
