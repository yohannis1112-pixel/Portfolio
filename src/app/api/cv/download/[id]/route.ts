import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cv = await prisma.cV.findUnique({
      where: { id: params.id },
    });

    if (!cv || !cv.fileUrl) {
      return new NextResponse("CV not found", { status: 404 });
    }

    console.log(`[DOWNLOAD_PROXY] Generating authenticated download for: ${cv.fileName}`);

    // Robust Public ID extraction
    let publicId = "";
    let deliveryType: "upload" | "private" | "authenticated" = "upload";

    const rawMatch = cv.fileUrl.match(/\/raw\/(upload|private|authenticated)\/v\d+\/(.+)$/);
    if (rawMatch) {
      deliveryType = rawMatch[1] as any;
      publicId = rawMatch[2].split('?')[0];
    } else {
      const urlParts = cv.fileUrl.split('/');
      publicId = urlParts[urlParts.length - 1].split('?')[0];
    }

    // Use Cloudinary's native secure private download generator. 
    // This perfectly bypasses Strict Delivery restrictions for raw files!
    // The format argument is empty because raw files include their extension in the publicId.
    const downloadUrl = cloudinary.utils.private_download_url(
      publicId, 
      "", 
      { 
        resource_type: "raw", 
        type: deliveryType,
        attachment: true
      }
    );

    console.log(`[DOWNLOAD_PROXY] Fetching authorized Cloudinary URL`);
    
    // Fetch the secure download URL from Cloudinary on the server side
    // We strictly disable Next.js caching using 'no-store' to avoid the 2MB cache limit error and massive delays
    const response = await fetch(downloadUrl, { cache: "no-store" });
    
    if (!response.ok) {
      console.error(`[DOWNLOAD_PROXY] Cloudinary fetch failed with status ${response.status}`);
      return new NextResponse(`Failed to fetch file from storage: ${response.statusText}`, { status: response.status });
    }

    // Determine correct MIME type
    const extension = cv.fileName.includes('.') ? cv.fileName.split('.').pop()!.toLowerCase() : 'pdf';
    
    let mimeType = "application/octet-stream";
    if (extension === 'pdf') mimeType = "application/pdf";
    else if (extension === 'docx') mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (extension === 'doc') mimeType = "application/msword";

    // Format the file name cleanly using the specified CV Title and the original extension
    const titleClean = cv.title.replace(/[^a-z0-9_-]/gi, '_');
    const safeFileName = `${titleClean}.${extension}`;

    console.log(`[DOWNLOAD_PROXY] Streaming file: ${safeFileName}`);

    // Instantly stream the ReadableStream back to the browser for 0-latency downloads
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

  } catch (error: any) {
    console.error("SERVER_ERROR: Download Proxy failed:", error.message);
    return new NextResponse(`Failed to download file: ${error.message}`, { status: 500 });
  }
}
