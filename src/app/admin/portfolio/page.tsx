"use client";
 
import { useEffect, useState, useCallback } from "react";
import { getPortfolioItems, deletePortfolioItem } from "@/actions/portfolio";
import { getPortfolioHero } from "@/actions/portfolio-hero";
import { PortfolioItem } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { PortfolioHeroForm } from "@/components/admin/PortfolioHeroForm";
import Image from "next/image";
 
export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [heroData, setHeroData] = useState<{ title: string; highlight: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | undefined>();
 
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [portfolioData, heroContent] = await Promise.all([
        getPortfolioItems(),
        getPortfolioHero()
      ]);
      setItems(portfolioData);
      setHeroData(heroContent);
    } catch (error) {
      console.error("Failed to load portfolio data:", error);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadData();
  }, [loadData]);
 
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deletePortfolioItem(id);
      loadData();
    }
  };
 
  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
 
  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };
 
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Management</h1>
          <p className="text-muted-foreground">Manage your hero section and portfolio items.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

      {/* Hero Section Editor */}
      <section>
        <PortfolioHeroForm initialData={heroData} />
      </section>

      {/* Portfolio Items Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Portfolio Items</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                <Image
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-background/80 backdrop-blur-sm text-[10px] px-2 py-1 rounded uppercase font-bold">
                    {item.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold truncate flex-1">{item.title}</h3>
                  {item.featured && <span className="text-yellow-500 text-xs font-bold ml-2">FEATURED</span>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(item)}>
                    <Pencil className="mr-2 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
 
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
      >
        <PortfolioForm
          initialData={editingItem}
          onSuccess={() => {
            setIsModalOpen(false);
            loadData();
          }}
        />
      </Modal>
    </div>
  );
}
