"use client";
 
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import { uploadCV } from "@/actions/cv";
import { Loader2, Upload } from "lucide-react";
 
interface CVUploaderProps {
  onSuccess: () => void;
}
 
export function CVUploader({ onSuccess }: CVUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Set default title if empty
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };
 
  const handleUpload = async () => {
    if (!file || !title) return;
  
    setLoading(true);
    try {
      // Get the original extension from the actual file name
      const extension = file.name.includes('.') ? file.name.split('.').pop() : 'pdf';
      // Use the title + original extension as the publicId to preserve the format
      const customPublicId = `${title}.${extension}`;
      
      const result = await uploadToCloudinary(file, "raw", customPublicId);
      await uploadCV({
        title: title,
        fileName: file.name,
        fileUrl: result.url,
        fileSize: Math.round(file.size / 1024), // KB
        mimeType: file.type || "application/octet-stream",
        isActive: true,
      });
      setFile(null);
      setTitle("");
      onSuccess();
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-accent/10">
      <h3 className="font-semibold flex items-center gap-2">
        <Upload className="h-4 w-4" /> Upload New CV (PDF or Word)
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium mb-1 block">Document Title</label>
          <Input 
            placeholder="e.g. English CV 2024" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2">
          <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file || !title || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Supports PDF and Microsoft Word formats. New uploads automatically become active.
      </p>
    </div>
  );
}