"use client";
 
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadDirectToCloudinary } from "@/lib/cloudinary-direct";
import { createCertificate, updateCertificate } from "@/actions/certificate";
import { Loader2 } from "lucide-react";
import { Certificate } from "@prisma/client";
 
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().optional(),
  imageUrl: z.string().min(1, "Image upload is required"),
  credentialUrl: z.string().optional(),
});
 
type FormData = z.infer<typeof schema>;
 
interface CertificateFormProps {
  initialData?: Certificate;
  onSuccess: () => void;
}
 
export function CertificateForm({ initialData, onSuccess }: CertificateFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
 
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      title: initialData.title,
      issuer: initialData.issuer,
      issueDate: initialData.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : undefined,
      imageUrl: initialData.imageUrl,
      credentialUrl: initialData.credentialUrl || "",
    } : {},
  });

  const currentImageUrl = watch("imageUrl");
 
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadDirectToCloudinary(file, "image", (progress) => {
        setUploadProgress(progress.percent);
      });
      setValue("imageUrl", result.url);
      setUploadedImage(result.url);
    } catch (error) {
      alert("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
 
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        credentialUrl: data.credentialUrl || null,
      };
      if (initialData) {
        await updateCertificate(initialData.id, formattedData);
      } else {
        await createCertificate(formattedData);
      }
      onSuccess();
    } catch (error) {
      alert("Save failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input {...register("title")} placeholder="Certificate title" />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>
 
      <div>
        <label className="block text-sm font-medium">Issuer</label>
        <Input {...register("issuer")} placeholder="e.g. Adobe, Coursera" />
        {errors.issuer && <p className="text-sm text-red-500">{errors.issuer.message}</p>}
      </div>
 
      <div>
        <label className="block text-sm font-medium">Issue Date</label>
        <Input type="date" {...register("issueDate")} />
      </div>
 
      <div>
        <label className="block text-sm font-medium">Image Upload</label>
        <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
        {uploading && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
        {uploadedImage && (
          <div className="mt-3">
            <p className="text-sm text-green-600">✓ Image uploaded</p>
            <img src={uploadedImage} alt="New upload" className="mt-2 h-32 rounded-lg object-cover border" />
          </div>
        )}
        {!uploadedImage && currentImageUrl && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">Current image:</p>
            <img src={currentImageUrl} alt="Current" className="mt-2 h-32 rounded-lg object-cover border" />
          </div>
        )}
        {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
      </div>
 
      <div>
        <label className="block text-sm font-medium">Certificate Link (URL)</label>
        <Input {...register("credentialUrl")} placeholder="https://..." />
      </div>
 
      <Button type="submit" className="w-full" disabled={loading || uploading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? "Update Certificate" : "Create Certificate"}
      </Button>
    </form>
  );
}