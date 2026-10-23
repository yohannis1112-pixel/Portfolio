"use server";
 
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
 
export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings || { headerIcon: null };
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return { headerIcon: null };
  }
}

export async function updateHeaderIcon(iconUrl: string) {
  try {
    const settings = await prisma.siteSettings.findFirst();

    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { headerIcon: iconUrl },
      });
    } else {
      await prisma.siteSettings.create({
        data: { headerIcon: iconUrl },
      });
    }
 
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("DETAILED_ERROR_UPDATE_HEADER_ICON:", error);
    throw new Error(`Failed to update header icon: ${error.message}`);
  }
}
