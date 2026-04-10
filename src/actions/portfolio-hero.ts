"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPortfolioHero() {
  try {
    // @ts-ignore - Prisma client needs to be regenerated
    const hero = await prisma.portfolioHero.findFirst();
    if (!hero) {
      // Return default content if nothing in DB yet
      return {
        title: "Creative",
        highlight: "Professional",
        description: "Specializing in Photography, Video Editing, DaVinci Resolve, and Blender. Transforming visions into stunning visual experiences.",
      };
    }
    return hero;
  } catch (error) {
    console.error("Failed to fetch portfolio hero:", error);
    return null;
  }
}

export async function updatePortfolioHero(data: {
  title: string;
  highlight: string;
  description: string;
}) {
  try {
    // @ts-ignore - Prisma client needs to be regenerated
    const existingHero = await prisma.portfolioHero.findFirst();

    if (existingHero) {
      // @ts-ignore - Prisma client needs to be regenerated
      await prisma.portfolioHero.update({
        where: { id: existingHero.id },
        data,
      });
    } else {
      // @ts-ignore - Prisma client needs to be regenerated
      await prisma.portfolioHero.create({
        data,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true };
  } catch (error) {
    console.error("Failed to update portfolio hero:", error);
    throw new Error("Failed to update hero section");
  }
}
