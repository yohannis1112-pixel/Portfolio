"use client";
 
import { CV } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
 
interface CVDownloadButtonProps {
  cv: CV | null;
}
 
export function CVDownloadButton({ cv }: CVDownloadButtonProps) {
  if (!cv) return null;
 
  // We use our internal proxy route to handle the download.
  // This avoids all Cloudinary "raw" resource limitations, 401 errors,
  // and guarantees the correct filename and file type (PDF/Word).
  const downloadUrl = `/api/cv/download/${cv.id}`;

  return (
    <Button asChild className="group">
      <a 
        href={downloadUrl} 
        download={cv.fileName} 
        target="_blank" 
        rel="noopener noreferrer"
        title={`Download ${cv.title || "CV"}`}
      >
        <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
        Download {cv.title || "CV"}
      </a>
    </Button>
  );
}