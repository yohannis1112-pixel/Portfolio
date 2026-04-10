"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/actions/settings";
 
const navigation = [
  { name: "Portfolio", href: "/" },
  { name: "About", href: "/about" },
  { name: "Certificates", href: "/certificates" },
];
 
export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerIcon, setHeaderIcon] = useState<string | null>(null);
 
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSiteSettings();
        if (settings?.headerIcon) {
          setHeaderIcon(settings.headerIcon);
        }
      } catch (error) {
        console.error("Failed to load header icon:", error);
      }
    }
    loadSettings();
  }, []);
 
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tighter">
           <span className="text-primary">PORTFOLIO</span>
          </Link>
        </div>
 
        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
 
 {  /*     <div className="hidden md:block">
          <Link href="/admin">
            <Button variant="outline" size="sm">Admin</Button>
          </Link>
        </div>*/}
        <div className="hidden md:block">
            {headerIcon ? (
              <img src={headerIcon} alt="Admin" className="h-10 w-auto object-contain max-w-[150px]" />
            ) : (
              <User className="h-8 w-12 text-muted-foreground" />
            )}
        </div>
 
        {/* Mobile menu button */ }
        <div className="flex md:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
 
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
     {/*       <Link
              href="/admin"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>*/}
          </div>
        </div>
      )}
    </header>
  );
}