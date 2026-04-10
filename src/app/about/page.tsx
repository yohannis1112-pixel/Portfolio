import { MainLayout } from "@/components/layout/MainLayout";
import { getActiveCV } from "@/actions/cv";
import { getAboutContent } from "@/actions/about";
import { CVDownloadButton } from "@/components/shared/CVDownloadButton";
import Image from "next/image";
 
// Remove force-dynamic to enable caching
export const revalidate = 300; // Revalidate every 5 minutes
 
export default async function AboutPage() {
  const activeCV = await getActiveCV();
  const about = await getAboutContent();
 
  const skills = about?.expertise || [
    "Photography", "Video Editing", "DaVinci Resolve", 
    "Adobe Photoshop", "Blender 3D", "After Effects",
    "Color Grading", "Visual Effects", "Digital Composition"
  ];
 
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-lg">
            {about?.imageUrl ? (
              <Image 
                src={about.imageUrl} 
                alt={about.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/10 to-secondary/10">
                <span className="text-6xl font-bold text-primary/20">JD</span>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">{about?.title || "About Me"}</h1>
            <div className="space-y-4">
              {about?.description.split('\n').map((para, i) => (
                para.trim() && (
                  <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                )
              )) || (
                <>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    I am a dedicated creative professional with over 8 years of experience in visual storytelling. 
                    My journey began behind the lens, capturing moments, and evolved into mastering the digital arts.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Whether it's the precise color grading in DaVinci Resolve, intricate 3D modeling in Blender, 
                    or high-end photo retouching in Photoshop, I bring a meticulous eye for detail to every project.
                  </p>
                </>
              )}
            </div>
            
            <div className="pt-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                Expertise
                <div className="h-px flex-1 bg-border/60 ml-2" />
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill}
                    className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
 
            <div className="pt-6">
              <CVDownloadButton cv={activeCV} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}