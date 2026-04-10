"use server";
 
import cloudinary from "@/lib/cloudinary";
 
export async function uploadToCloudinaryServer(formData: FormData) {
  const file = formData.get("file") as File;
  const resourceType = formData.get("resourceType") as "image" | "video" | "raw" || "auto";
  const customPublicId = formData.get("publicId") as string | null;

  if (!file) {
    throw new Error("No file provided");
  }

  // Verify Cloudinary is configured
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not configured");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadOptions: any = {
    resource_type: resourceType,
    access_mode: 'public',
  };

  if (customPublicId) {
    uploadOptions.public_id = customPublicId.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
            assetId: result.asset_id,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
}
