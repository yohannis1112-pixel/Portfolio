import { getAboutContent } from "@/actions/about";
import { AboutForm } from "@/components/admin/AboutForm";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminAboutPage() {
  const about = await getAboutContent();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Manage About Page</h1>
      </div>

      <AboutForm initialData={about} />
    </div>
  );
}
