"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAboutContent() {
  try {
    const about = await prisma.about.findUnique({
      where: { id: 'default' },
    });
    return about;
  } catch (error) {
    console.error("Error fetching about content:", error);
    return null;
  }
}

export async function updateAboutContent(data: {
  title: string;
  description: string;
  expertise: string[];
  imageUrl?: string | null;
}) {
  try {
    const about = await prisma.about.upsert({
      where: { id: 'default' },
      update: {
        title: data.title,
        description: data.description,
        expertise: data.expertise,
        imageUrl: data.imageUrl,
      },
      create: {
        id: 'default',
        title: data.title,
        description: data.description,
        expertise: data.expertise,
        imageUrl: data.imageUrl,
      },
    });

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true, data: about };
  } catch (error) {
    console.error("Error updating about content:", error);
    return { success: false, error: "Failed to update about content" };
  }
}
