"use client";
 
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import { createPortfolioItem, updatePortfolioItem } from "@/actions/portfolio";
import { Loader2 } from "lucide-react";
import { PortfolioItem } from "@prisma/client";
 
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(["image", "video"]),
  thumbnailUrl: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});
 
type FormData = z.infer<typeof schema>;
 
interface PortfolioFormProps {
  initialData?: PortfolioItem;
  onSuccess: () => void;
}
 
export function PortfolioForm({ initialData, onSuccess }: PortfolioFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; type: string } | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

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
      description: initialData.description || undefined,
      category: initialData.category,
      mediaUrl: initialData.mediaUrl,
      mediaType: initialData.mediaType as "image" | "video",
      thumbnailUrl: initialData.thumbnailUrl || undefined,
      featured: initialData.featured,
      order: initialData.order,
    } : {
      mediaType: "image",
      featured: false,
      order: 0,
    },
  });

  const mediaType = watch("mediaType");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const resourceType = file.type.startsWith("video/") ? "video" : "image";
      const result = await uploadToCloudinary(file, resourceType);
      if (result && result.url) {
        setValue("mediaUrl", result.url);
        setValue("mediaType", result.resourceType === "video" ? "video" : "image");
        setUploadedFile({ url: result.url, type: result.resourceType });
      } else {
        throw new Error("Upload returned no URL");
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "image");
      setValue("thumbnailUrl", result.url);
      setThumbnailFile(null);
    } catch (error) {
      console.error("Thumbnail upload failed", error);
      alert("Thumbnail upload failed");
    } finally {
      setUploading(false);
    }
  };
 
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (initialData) {
        await updatePortfolioItem(initialData.id, data);
      } else {
        await createPortfolioItem(data);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input {...register("title")} placeholder="Item title" />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>
  
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Textarea {...register("description")} placeholder="Description (optional)" />
      </div>
  
      <div>
        <label className="block text-sm font-medium">Category</label>
        <Input {...register("category")} placeholder="e.g. Photo, Video, 3D" />
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>
  
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Media Type</label>
          <select
            {...register("mediaType")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Order</label>
          <Input type="number" {...register("order", { valueAsNumber: true })} />
        </div>
      </div>
  
      <div>
        <label className="block text-sm font-medium">Media Upload</label>
        <Input 
          type="file" 
          accept={mediaType === "video" ? "video/*" : "image/*"}
          onChange={handleFileUpload} 
          disabled={uploading} 
        />
        {uploading && (
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading to Cloudinary...
          </div>
        )}
        {uploadedFile && (
          <div className="mt-3">
            <p className="text-sm text-green-600 flex items-center gap-2">
              ✓ File uploaded successfully
            </p>
            {uploadedFile.type === "image" ? (
              <img src={uploadedFile.url} alt="Preview" className="mt-2 h-32 rounded-lg object-cover border" />
            ) : (
              <video src={uploadedFile.url} controls className="mt-2 h-32 rounded-lg object-cover border" />
            )}
          </div>
        )}
        {errors.mediaUrl && <p className="text-sm text-red-500 mt-1">{errors.mediaUrl?.message}</p>}
      </div>
      
      {mediaType === "video" && (
        <div>
          <label className="block text-sm font-medium">Thumbnail Upload (optional)</label>
          <Input 
            type="file" 
            accept="image/*"
            onChange={handleThumbnailUpload} 
            disabled={uploading} 
          />
          {uploading && (
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading thumbnail...
            </div>
          )}
        </div>
      )}
  
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("featured")} id="featured" />
        <label htmlFor="featured" className="text-sm font-medium">Featured Item</label>
      </div>
  
      <Button type="submit" className="w-full" disabled={loading || uploading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initialData ? "Update Item" : "Create Item"}
      </Button>
    </form>
  );
}