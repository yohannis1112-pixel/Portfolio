"use client";
 
import { useEffect, useState } from "react";
import { getCertificates, deleteCertificate } from "@/actions/certificate";
import { Certificate } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { CertificateForm } from "@/components/admin/CertificateForm";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
 
export default function AdminCertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificate | undefined>();
 
  const loadItems = async () => {
    setLoading(true);
    const data = await getCertificates();
    setItems(data);
    setLoading(false);
  };
 
  useEffect(() => {
    loadItems();
  }, []);
 
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      await deleteCertificate(id);
      loadItems();
    }
  };
 
  const handleEdit = (item: Certificate) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
 
  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };
 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground">Manage your credentials and certifications.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Certificate
        </Button>
      </div>
 
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6 flex gap-4">
              <div className="h-20 w-20 relative flex-none rounded border overflow-hidden bg-muted">
                {item.imageUrl ? (
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill 
                    sizes="80px"
                    className="object-cover" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full"><Award className="h-8 w-8 text-muted-foreground" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.issuer}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(item.issueDate)}</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
 
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Certificate" : "Add Certificate"}
      >
        <CertificateForm
          initialData={editingItem}
          onSuccess={() => {
            setIsModalOpen(false);
            loadItems();
          }}
        />
      </Modal>
    </div>
  );
}