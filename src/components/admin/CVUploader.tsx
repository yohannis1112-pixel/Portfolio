"use client";
 
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadDirectToCloudinary } from "@/lib/cloudinary-direct";
import { uploadCV } from "@/actions/cv";
import { Loader2, Upload } from "lucide-react";
 
interface CVUploaderProps {
  onSuccess: () => void;
}
 
export function CVUploader({ onSuccess }: CVUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };
 
  const handleUpload = async () => {
    if (!file || !title) return;
  
    setLoading(true);
    setUploadProgress(0);
    try {
      const result = await uploadDirectToCloudinary(file, "raw", (progress) => {
        setUploadProgress(progress.percent);
      });

      await uploadCV({
        title,
        fileName: file.name,
        fileUrl: result.url,
        fileSize: Math.round(file.size / 1024),
        mimeType: file.type || "application/octet-stream",
        isActive: true,
      });

      setFile(null);
      setTitle("");
      setUploadProgress(0);
      onSuccess();
    } catch (error) {
      alert("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
      setUploadProgress(0);
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
        {loading && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Uploading directly to Cloudinary...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Supports PDF and Microsoft Word formats. Uploads directly to Cloudinary - no file size limit issues.
      </p>
    </div>
  );
}