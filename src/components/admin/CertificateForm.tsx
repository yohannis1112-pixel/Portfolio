"use client";
 
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
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
 
  const {
    register,
    handleSubmit,
    setValue,
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
 
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "image");
      setValue("imageUrl", result.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
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
      console.error("Save failed", error);
      alert("Save failed");
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
        <label className="block text-sm font-medium">Image Upload (Preview)</label>
        <Input type="file" onChange={handleFileUpload} disabled={uploading} />
        {uploading && <div className="mt-2 flex items-center text-sm"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</div>}
      </div>
 
      <div>
        <label className="block text-sm font-medium">Image URL</label>
        <Input {...register("imageUrl")} placeholder="https://..." />
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