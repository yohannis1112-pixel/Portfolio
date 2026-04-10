"use client";
 
import { PortfolioItem } from "@prisma/client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
 
interface PortfolioLightboxProps {
  item: PortfolioItem;
  onClose: () => void;
}
 
export function PortfolioLightbox({ item, onClose }: PortfolioLightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
 
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 pointer-events-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-4 text-white hover:bg-white/10 z-[110]"
      >
        <X className="h-8 w-8" />
      </Button>
 
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="relative max-h-[80vh] w-full max-w-5xl">
          {item.mediaType === "video" ? (
            <video
              src={item.mediaUrl}
              controls
              autoPlay
              className="mx-auto max-h-[80vh] rounded-lg shadow-2xl"
            />
          ) : (
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="mx-auto max-h-[80vh] rounded-lg shadow-2xl object-contain"
            />
          )}
        </div>
        
        <div className="text-center text-white max-w-2xl">
          <h3 className="text-2xl font-bold">{item.title}</h3>
          {item.description && <p className="mt-2 text-white/70">{item.description}</p>}
          <span className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">
            {item.category}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}