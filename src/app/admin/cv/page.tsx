"use client";
 
import { useEffect, useState } from "react";
import { getCVs, deleteCV, toggleCVActive } from "@/actions/cv";
import { CV } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, FileText, CheckCircle, Download } from "lucide-react";
import { CVUploader } from "@/components/admin/CVUploader";
import { cn } from "@/lib/utils";
 
export default function AdminCVPage() {
  const [items, setItems] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
 
  const loadItems = async () => {
    setLoading(true);
    const data = await getCVs();
    setItems(data);
    setLoading(false);
  };
 
  useEffect(() => {
    loadItems();
  }, []);
 
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this CV?")) {
      await deleteCV(id);
      loadItems();
    }
  };
 
  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleCVActive(id, isActive);
    loadItems();
  };
 
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CV Management</h1>
        <p className="text-muted-foreground">Upload and manage your CV files.</p>
      </div>
 
      <CVUploader onSuccess={loadItems} />
 
      <div className="space-y-4">
        <h3 className="font-semibold">Uploaded CVs</h3>
        {items.map((item) => (
          <Card key={item.id} className={cn(item.isActive && "border-primary ring-1 ring-primary")}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {item.title}
                    {item.isActive && (
                      <span className="flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase font-bold">
                        <CheckCircle className="h-2 w-2" /> Active
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    File: {item.fileName} • {new Date(item.uploadedAt).toLocaleDateString()} • {item.fileSize} KB
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!item.isActive && (
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(item.id, true)}>
                    Set Active
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={`/api/cv/download/${item.id}`} download={item.fileName} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
            No CVs uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}