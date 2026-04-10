"use server";
 
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
 
export async function getSiteSettings() {
  try {
    // @ts-ignore - Prisma client needs to be regenerated
    if (!prisma.siteSettings) {
      console.warn("Prisma Client is not generated with SiteSettings model. Run 'npx prisma generate'.");
      return { headerIcon: null };
    }
    // @ts-ignore
    const settings = await prisma.siteSettings.findFirst();
    return settings || { headerIcon: null };
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return { headerIcon: null };
  }
}

export async function updateHeaderIcon(iconUrl: string) {
  try {
    // @ts-ignore - Prisma client needs to be regenerated
    if (!prisma.siteSettings) {
      throw new Error("Prisma Client is not generated with SiteSettings model. Please stop the dev server and run 'npx prisma generate'.");
    }
    // @ts-ignore
    const settings = await prisma.siteSettings.findFirst();
 
    if (settings) {
      // @ts-ignore
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { headerIcon: iconUrl },
      });
    } else {
      // @ts-ignore
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
