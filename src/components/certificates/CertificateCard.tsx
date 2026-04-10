"use client";

import Image from "next/image";
import { Certificate } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
 
interface CertificateCardProps {
  certificate: Certificate;
  onClick: (certificate: Certificate) => void;
}
 
export function CertificateCard({ certificate, onClick }: CertificateCardProps) {
  return (
    <Card 
      className="group overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={() => onClick(certificate)}
    >
      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
        {certificate.imageUrl ? (
          <Image
            src={certificate.imageUrl}
            alt={certificate.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
          <div className="bg-white/90 text-black px-4 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300 text-sm">
            View Certificate
          </div>
        </div>
      </div>
      <CardHeader className="p-4 flex-none">
        <CardTitle className="text-lg leading-tight">{certificate.title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{certificate.issuer}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-xs text-muted-foreground">
          Issued: {formatDate(certificate.issueDate)}
        </p>
      </CardContent>
      {certificate.credentialUrl && (
        <CardFooter className="p-4 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full relative z-10" 
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
              View Credential <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
 
// Helper to handle "asChild" functionality without complex logic
function asChild(props: any) {
  return props;
}