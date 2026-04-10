import { MainLayout } from "@/components/layout/MainLayout";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import { getCertificates } from "@/actions/certificate";

export const dynamic = 'force-dynamic';
 
export default async function CertificatesPage() {
  const certificates = await getCertificates();
 
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Certifications & Credentials</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A collection of my professional achievements and recognized expertise in the industry.
          </p>
        </div>
 
        <CertificateGrid certificates={certificates} />
        
        {certificates.length === 0 && (
          <div className="text-center py-20 bg-accent/5 rounded-lg">
            <p className="text-muted-foreground">No certificates added yet.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}