"use client";
 
import { Certificate } from "@prisma/client";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { formatDate } from "@/lib/utils";
 
interface CertificateLightboxProps {
  certificate: Certificate;
  onClose: () => void;
}
 
export function CertificateLightbox({ certificate, onClose }: CertificateLightboxProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
 
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-4 top-4 text-white hover:bg-white/10"
      >
        <X className="h-8 w-8" />
      </Button>
 
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 overflow-y-auto">
        <div className="relative max-h-[80vh] w-full max-w-5xl flex items-center justify-center">
          {certificate.imageUrl ? (
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="mx-auto max-h-[80vh] rounded-lg shadow-2xl object-contain border border-white/10"
            />
          ) : (
            <div className="flex h-[400px] w-full items-center justify-center bg-white/5 rounded-lg text-white/50">
              No Image Preview
            </div>
          )}
        </div>
        
        <div className="text-center text-white max-w-2xl px-4 pb-10">
          <h3 className="text-3xl font-bold">{certificate.title}</h3>
          <p className="mt-2 text-xl text-primary font-medium">{certificate.issuer}</p>
          <p className="mt-2 text-white/60">
            Issued: {formatDate(certificate.issueDate)}
          </p>
          
          {certificate.credentialUrl && (
            <div className="mt-8">
              <Button asChild variant="default" size="lg">
                <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                  View Credential <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
