"use client";

import { StatsCard } from "@/components/admin/StatsCard";
import { getStats } from "@/actions/stats";
import { Image, Award, FileText, Star, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
 
export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getStats().then(data => {
      if ('error' in data && data.error) {
        setHasError(true);
      }
      setStats(data);
    }).catch(() => {
      setHasError(true);
    });
  }, []);

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your portfolio management panel.</p>
      </div>

      {hasError && (
        <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">Database Connection Issue</p>
              <p className="text-sm">Your Neon database may be sleeping. This is normal for free tier.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
            className="bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Portfolio Items" 
          value={stats.portfolioCount} 
          icon={Image} 
        />
        <StatsCard 
          title="Certificates" 
          value={stats.certificateCount} 
          icon={Award} 
        />
        <StatsCard 
          title="Featured Items" 
          value={stats.featuredCount} 
          icon={Star} 
        />
        <StatsCard 
          title="CV Versions" 
          value={stats.cvCount} 
          icon={FileText} 
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold mb-4">Database Status</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-sm">
                {hasError ? 'Database connection unstable' : 'Database connected'}
              </span>
            </div>
            {hasError && (
              <p className="text-xs text-muted-foreground">
                Neon free tier databases sleep after inactivity. Try refreshing in a few seconds.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}