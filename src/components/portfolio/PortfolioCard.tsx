"use client";
 
import Image from "next/image";
import { PortfolioItem } from "@prisma/client";
import { Play } from "lucide-react";

// ─── URL Detection ────────────────────────────────────────────────────────────

export function getVideoType(url: string): "youtube" | "drive" | "direct" | null {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("drive.google.com")) return "drive";
  if (url.match(/\.(mp4|webm|ogg|mov)(\?|$)/i)) return "direct";
  return null;
}

export function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getDriveId(url: string): string | null {
  const match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function getEmbedUrl(url: string): string {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&vq=hd1080`;
  }
  const driveId = getDriveId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }
  return url;
}

export function getThumbnailUrl(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) {
    // maxresdefault = highest quality YouTube thumbnail
    return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  }
  const driveId = getDriveId(url);
  if (driveId) {
    // sz=w800 gives higher quality Drive thumbnail
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;
  }
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
  priority?: boolean;
}

export function PortfolioCard({ item, onClick, priority = false }: PortfolioCardProps) {
  const videoType = getVideoType(item.mediaUrl);
  const autoThumb = getThumbnailUrl(item.mediaUrl);
  const thumbnailSrc = item.thumbnailUrl || autoThumb || item.mediaUrl;
  const isExternalThumb = !item.thumbnailUrl && (videoType === "youtube" || videoType === "drive");

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-accent"
      onClick={() => onClick(item)}
    >
      <div className="aspect-square relative">
        {isExternalThumb ? (
          <img
            src={thumbnailSrc}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <Image
            src={thumbnailSrc}
            alt={item.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
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
