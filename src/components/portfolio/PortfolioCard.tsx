"use client";
 
import Image from "next/image";
import { PortfolioItem } from "@prisma/client";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
  priority?: boolean;
}
 
export function PortfolioCard({ item, onClick, priority = false }: PortfolioCardProps) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-accent"
      onClick={() => onClick(item)}
    >
      <div className="aspect-square relative">
        <Image
          src={item.thumbnailUrl || item.mediaUrl}
          alt={item.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          {item.mediaType === "video" && (
            <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="text-white font-semibold truncate">{item.title}</h3>
        <p className="text-white/70 text-xs uppercase tracking-wider">{item.category}</p>
      </div>
    </div>
  );
}