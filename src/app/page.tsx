import { MainLayout } from "@/components/layout/MainLayout";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getPortfolioItems } from "@/actions/portfolio";
import { getPortfolioHero } from "@/actions/portfolio-hero";
 
export default async function Home() {
  try {
    const [items, hero] = await Promise.all([
      getPortfolioItems(),
      getPortfolioHero()
    ]);
 
    return (
      <MainLayout>
        <section className="relative overflow-hidden bg-background pt-16 pb-10 md:pt-24 md:pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              {hero?.title || "Creative"} <span className="text-primary">{hero?.highlight || "Professional"}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {hero?.description || "Specializing in Photography, Video Editing, DaVinci Resolve, and Blender. Transforming visions into stunning visual experiences."}
            </p>
          </div>
        </section>
 
        <section className="container mx-auto px-4 pb-12 pt-2">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Portfolio</h2>
          </div>
          {items.length > 0 ? (
            <PortfolioGrid items={items} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No portfolio items available.</p>
            </div>
          )}
        </section>
      </MainLayout>
    );
  } catch (error) {
    throw new Error("Failed to load portfolio data");
  }
}