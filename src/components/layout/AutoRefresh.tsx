"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Silently refresh the server components every 10 seconds 
    // to instantly pull down new admin edits without blowing away client state
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
