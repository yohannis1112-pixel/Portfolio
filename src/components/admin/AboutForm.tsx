"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { updateAboutContent } from "@/actions/about";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import { Loader2, X, Plus, Image as ImageIcon } from "lucide-react";
import { About } from "@prisma/client";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  expertise: z.array(z.string()).min(1, "At least one expertise is required"),
  imageUrl: z.string().nullable().optional(),
});

type FormData = z.infer<typeof schema>;

interface AboutFormProps {
  initialData: About | null;
}

export function AboutForm({ initialData }: AboutFormProps) {
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: "About Me",
      description: "",
      expertise: [],
      imageUrl: null,
    },
  });

  const expertise = watch("expertise") || [];
  const imageUrl = watch("imageUrl");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "image");
      setValue("imageUrl", result.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !expertise.includes(newSkill.trim())) {
      setValue("expertise", [...expertise, newSkill.trim()], { shouldDirty: true });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue(
      "expertise",
      expertise.filter((skill) => skill !== skillToRemove),
      { shouldDirty: true }
    );
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await updateAboutContent(data);
      if (result.success) {
        alert("About content updated successfully!");
      } else {
        alert(result.error || "Update failed");
      }
    } catch (error) {
      console.error("Save failed", error);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Title</label>
          <Input {...register("title")} placeholder="Page Title (e.g., About Me)" />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <Textarea 
            {...register("description")} 
            placeholder="Tell your story..." 
            className="min-h-[200px]"
          />
          {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Expertise / Skills</label>
          <div className="flex gap-2 mb-3">
            <Input 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button type="button" onClick={addSkill} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg bg-muted/30">
            {expertise.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            )}
            {expertise.map((skill) => (
              <span 
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {skill}
                <button 
                  type="button" 
                  onClick={() => removeSkill(skill)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          {errors.expertise && <p className="text-sm text-destructive mt-1">{errors.expertise.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Profile Image</label>
          <div className="space-y-4">
            {imageUrl ? (
              <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border bg-muted">
                <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setValue("imageUrl", null)}
                  className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full max-w-md aspect-square border-2 border-dashed rounded-lg bg-muted/50">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No image uploaded</p>
                </div>
              </div>
            )}
            <div>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading}
                className="max-w-md"
              />
              {uploading && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading to Cloudinary...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
