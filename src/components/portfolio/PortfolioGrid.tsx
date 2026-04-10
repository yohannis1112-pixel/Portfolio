"use client";
 
import { useState } from "react";
import { PortfolioItem } from "@prisma/client";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioLightbox } from "./PortfolioLightbox";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
 
interface PortfolioGridProps {
  items: PortfolioItem[];
}
 
export function PortfolioGrid({ items }: PortfolioGridProps) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
 
  const normalizeCategory = (cat: string) => {
    let normalized = cat.trim().toLowerCase();
    if (normalized === "videos") return "video";
    if (normalized === "photos") return "photo";
    return normalized;
  };

  const normalizedItems = items.map(item => ({
    ...item,
    normalizedCategory: normalizeCategory(item.category)
  }));

  const categories = ["all", ...new Set(normalizedItems.map((item) => item.normalizedCategory))];
 
  const filteredItems =
    filter === "all"
      ? normalizedItems
      : normalizedItems.filter((item) => item.normalizedCategory === filter);
 
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const isActive = filter === category;
          return (
            <Button
              key={category}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(category)}
              className={cn(
                "capitalize transition-all duration-300",
                isActive 
                  ? "font-bold shadow-md shadow-primary/20 ring-2 ring-primary ring-offset-2 scale-105" 
                  : "font-medium opacity-70 hover:opacity-100 hover:bg-transparent"
              )}
            >
              {category}
            </Button>
          );
        })}
      </div>
 
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item, index) => (
          <PortfolioCard
            key={item.id}
            item={item}
            onClick={(item) => setSelectedItem(item)}
            priority={index < 4} // Add priority to first 4 images for LCP optimization
          />
        ))}
      </div>
 
      {selectedItem && (
        <PortfolioLightbox
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}