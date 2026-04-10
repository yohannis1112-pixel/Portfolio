"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ImageIcon, Award, FileText, LogOut, Home, User, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "About", href: "/admin/about", icon: User },
  { name: "CV", href: "/admin/cv", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [session, status, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen bg-accent/5">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-background hidden md:block">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            ADMIN<span className="text-primary">PANEL</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Home className="h-4 w-4" />
              View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <header className="h-16 border-b bg-background flex items-center justify-between px-8 md:hidden">
          <Link href="/" className="font-bold">ADMIN PANEL</Link>
          <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
