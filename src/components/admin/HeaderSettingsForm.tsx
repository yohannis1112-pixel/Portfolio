"use client";
 
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import { updateHeaderIcon } from "@/actions/settings";
import { Loader2, Settings, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
 
interface HeaderSettingsFormProps {
  initialIcon: string | null;
}
 
export function HeaderSettingsForm({ initialIcon }: HeaderSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [iconUrl, setIconUrl] = useState<string | null>(initialIcon);
 
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
 
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "image");
      setIconUrl(result.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
 
  const handleSave = async () => {
    if (!iconUrl) {
      alert("Please upload an icon first.");
      return;
    }
    setLoading(true);
    try {
      await updateHeaderIcon(iconUrl);
      alert("Header icon updated successfully!");
    } catch (error: any) {
      console.error("Update failed", error);
      alert(`Failed to update header icon: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" /> Header Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">Header Navigation Icon</label>
          <div className="flex items-center gap-6">
            <div className="flex h-20 min-w-20 items-center justify-center rounded border bg-muted p-2">
              {iconUrl ? (
                <img src={iconUrl} alt="Header Icon Preview" className="h-12 w-auto object-contain max-w-[120px]" />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              <p className="text-xs text-muted-foreground">Recommended size: 32x32px or 64x64px. SVG or PNG.</p>
            </div>
          </div>
        </div>
 
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={loading || uploading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
