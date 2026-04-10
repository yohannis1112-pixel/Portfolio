import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import "@/lib/suppress-warnings-improved";
 
const inter = Inter({ subsets: ["latin"] });
 
export const metadata: Metadata = {
  title: "Yohannis Asefa | Creative Portfolio",
  description: "Professional portfolio of Yohannis Asefa - Photographer, Video Editor, DaVinci Resolve, Blender & Photoshop artist.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}