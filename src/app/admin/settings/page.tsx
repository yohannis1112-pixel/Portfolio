"use client";
 
import { useEffect, useState, useCallback } from "react";
import { getSiteSettings } from "@/actions/settings";
import { HeaderSettingsForm } from "@/components/admin/HeaderSettingsForm";
 
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<{ headerIcon: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
 
  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
 
  if (loading) return <div>Loading settings...</div>;
 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-muted-foreground">Manage your site-wide configurations and header icon.</p>
        </div>
      </div>
 
      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <HeaderSettingsForm initialIcon={settings?.headerIcon || null} />
      </div>
    </div>
  );
}
