"use client";
 
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { uploadDirectToCloudinary } from "@/lib/cloudinary-direct";
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ url: string; type: string } | null>(null);
  const [useUrl, setUseUrl] = useState(false);

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

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File is too large (${(file.size / 1024 / 1024).toFixed(0)}MB). Cloudinary free tier limit is 100MB.\n\nPlease either:\n1. Compress the video using HandBrake (free)\n2. Use the "Paste URL" option with a Google Drive or YouTube link`);
      e.target.value = "";
      return;
    }

    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    const isLargeImage = resourceType === "image" && file.size > 10 * 1024 * 1024;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(isLargeImage ? "Compressing image..." : "Uploading...");
    try {
      const result = await uploadDirectToCloudinary(file, resourceType, (progress) => {
        setUploadStatus("Uploading...");
        setUploadProgress(progress.percent);
      });
      setValue("mediaUrl", result.url);
      setValue("mediaType", result.resourceType === "video" ? "video" : "image");
      setUploadedFile({ url: result.url, type: result.resourceType });
    } catch (error) {
      alert("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadStatus("");
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadDirectToCloudinary(file, "image", (progress) => {
        setUploadProgress(progress.percent);
      });
      setValue("thumbnailUrl", result.url);
    } catch (error) {
      alert("Thumbnail upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
      alert("Save failed: " + (error instanceof Error ? error.message : "Unknown error"));
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
  
      {/* Media Upload Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Media</label>

        {/* Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setUseUrl(false)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              !useUrl ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUseUrl(true)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              useUrl ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-accent"
            }`}
          >
            Paste URL (for large videos)
          </button>
        </div>

        {useUrl ? (
          <div className="space-y-1">
            <Input
              placeholder="Paste direct video/image URL here..."
              defaultValue={initialData?.mediaUrl || ""}
              onChange={(e) => {
                setValue("mediaUrl", e.target.value);
                if (e.target.value) {
                  setUploadedFile({ url: e.target.value, type: mediaType });
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              For videos over 100MB: Upload to Google Drive → Share → Copy link, or use a direct Cloudinary URL.
            </p>
          </div>
        ) : (
          <>
            <Input
              type="file"
              accept={mediaType === "video" ? "video/*" : "image/*"}
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Max 100MB. For larger files use "Paste URL" option.
            </p>
            {uploading && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {uploadStatus || (uploadProgress < 100 ? "Uploading to Cloudinary..." : "Processing...")}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Do not close this page.</p>
              </div>
            )}
            {uploadedFile && !useUrl && (
              <div className="mt-3">
                <p className="text-sm text-green-600">✓ File uploaded successfully</p>
                {uploadedFile.type === "image" ? (
                  <img src={uploadedFile.url} alt="Preview" className="mt-2 h-32 rounded-lg object-cover border" />
                ) : (
                  <video src={uploadedFile.url} controls className="mt-2 h-32 rounded-lg border" />
                )}
              </div>
            )}
          </>
        )}
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
