import { Header } from "./Header";
import { Footer } from "./Footer";
import { AutoRefresh } from "./AutoRefresh";
 
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AutoRefresh />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}