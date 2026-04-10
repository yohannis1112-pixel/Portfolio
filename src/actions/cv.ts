"use server";
 
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unstable_cache } from "next/cache";
 
export async function getCVs() {
  return await prisma.cV.findMany({
    orderBy: {
      uploadedAt: "desc",
    },
  });
}
 
// Cache the active CV for 5 minutes to prevent excessive database calls
const getCachedActiveCV = unstable_cache(
  async () => {
    try {
      const cv = await prisma.cV.findFirst({
        where: {
          isActive: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      
      return cv;
    } catch (error) {
      console.error("[CV_SYSTEM] Error fetching active CV:", error);
      return null;
    }
  },
  ['active-cv'],
  {
    revalidate: 300, // 5 minutes
    tags: ['cv']
  }
);

export async function getActiveCV() {
  return getCachedActiveCV();
}
 
export async function uploadCV(data: any) {
  try {
    // If this CV is active, deactivate others first
    if (data.isActive) {
      await prisma.cV.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const cv = await prisma.cV.create({
      data,
    });
    
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/cv");
    return cv;
  } catch (error) {
    console.error("[CV_SYSTEM] Error uploading CV:", error);
    throw error;
  }
}
 
export async function toggleCVActive(id: string, isActive: boolean) {
  try {
    if (isActive) {
      await prisma.cV.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const cv = await prisma.cV.update({
      where: { id },
      data: { isActive },
    });
    
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/cv");
    return cv;
  } catch (error) {
    console.error("[CV_SYSTEM] Error toggling CV status:", error);
    throw error;
  }
}
 
export async function deleteCV(id: string) {
  await prisma.cV.delete({
    where: { id },
  });
  revalidatePath("/admin/cv");
}