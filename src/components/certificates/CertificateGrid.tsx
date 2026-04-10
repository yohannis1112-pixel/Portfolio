"use client";
 
import { useState } from "react";
import { Certificate } from "@prisma/client";
import { CertificateCard } from "./CertificateCard";
import { CertificateLightbox } from "./CertificateLightbox";
 
interface CertificateGridProps {
  certificates: Certificate[];
}
 
export function CertificateGrid({ certificates }: CertificateGridProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
 
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate) => (
          <CertificateCard 
            key={certificate.id} 
            certificate={certificate} 
            onClick={(cert) => setSelectedCertificate(cert)}
          />
        ))}
      </div>
 
      {selectedCertificate && (
        <CertificateLightbox 
          certificate={selectedCertificate} 
          onClose={() => setSelectedCertificate(null)} 
        />
      )}
    </>
  );
}