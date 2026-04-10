"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { updatePortfolioHero } from "@/actions/portfolio-hero";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  highlight: z.string().min(1, "Highlight is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof schema>;

interface PortfolioHeroFormProps {
  initialData: {
    title: string;
    highlight: string;
    description: string;
  } | null;
}

export function PortfolioHeroForm({ initialData }: PortfolioHeroFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: "Creative",
      highlight: "Professional",
      description: "Specializing in Photography, Video Editing, DaVinci Resolve, and Blender. Transforming visions into stunning visual experiences.",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updatePortfolioHero(data);
      alert("Hero section updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update hero section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title Prefix</label>
              <Input {...register("title")} placeholder="e.g., Creative" />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Highlight Word</label>
              <Input {...register("highlight")} placeholder="e.g., Professional" />
              {errors.highlight && <p className="text-sm text-red-500 mt-1">{errors.highlight.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea 
              {...register("description")} 
              placeholder="Enter a brief description of your work..."
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
