"use server";
 
import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/database";
 
export async function getStats() {
  try {
    return await retryDatabaseOperation(async () => {
      const [portfolioCount, certificateCount, cvCount, featuredCount] = await Promise.all([
        prisma.portfolioItem.count(),
        prisma.certificate.count(),
        prisma.cV.count(),
        prisma.portfolioItem.count({ where: { featured: true } })
      ]);
 
      return {
        portfolioCount,
        certificateCount,
        cvCount,
        featuredCount,
      };
    });
  } catch (error) {
    console.error("Database connection error:", error);
    // Return default values when database is unreachable
    return {
      portfolioCount: 0,
      certificateCount: 0,
      cvCount: 0,
      featuredCount: 0,
      error: true,
    };
  }
}