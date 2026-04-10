"use server";
 
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
 
export async function getCertificates() {
  return await prisma.certificate.findMany({
    orderBy: {
      issueDate: "desc",
    },
  });
}
 
export async function createCertificate(data: any) {
  const certificate = await prisma.certificate.create({
    data,
  });
  revalidatePath("/certificates");
  revalidatePath("/admin/certificates");
  return certificate;
}
 
export async function updateCertificate(id: string, data: any) {
  const certificate = await prisma.certificate.update({
    where: { id },
    data,
  });
  revalidatePath("/certificates");
  revalidatePath("/admin/certificates");
  return certificate;
}
 
export async function deleteCertificate(id: string) {
  await prisma.certificate.delete({
    where: { id },
  });
  revalidatePath("/certificates");
  revalidatePath("/admin/certificates");
}