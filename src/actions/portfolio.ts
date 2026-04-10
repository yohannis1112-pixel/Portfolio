"use server";
 
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
 
export async function getPortfolioItems() {
  try {
    return await prisma.portfolioItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);
    return [];
  }
}
 
export async function createPortfolioItem(data: any) {
  const item = await prisma.portfolioItem.create({
    data: {
      title: data.title,
      description: data.description || null,
      category: data.category,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      thumbnailUrl: data.thumbnailUrl || null,
      featured: data.featured || false,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return item;
}
 
export async function updatePortfolioItem(id: string, data: any) {
  const item = await prisma.portfolioItem.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      category: data.category,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      thumbnailUrl: data.thumbnailUrl || null,
      featured: data.featured || false,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return item;
}
 
export async function deletePortfolioItem(id: string) {
  const item = await prisma.portfolioItem.findUnique({ where: { id } });
  
  if (item?.mediaUrl) {
    // Optional: Delete from Cloudinary
    // Extract public_id from URL
    const publicId = item.mediaUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }
 
  await prisma.portfolioItem.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
}