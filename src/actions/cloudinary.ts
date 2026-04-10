"use server";
 
import cloudinary from "@/lib/cloudinary";
 
export async function uploadToCloudinaryServer(formData: FormData) {
  const file = formData.get("file") as File;
  const resourceType = formData.get("resourceType") as "image" | "video" | "raw" || "auto";
  const customPublicId = formData.get("publicId") as string | null;

  if (!file) {
    throw new Error("No file provided");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize public_id if provided, otherwise Cloudinary generates a random one
  const uploadOptions: any = { 
    resource_type: resourceType,
  };

  if (customPublicId) {
    // Simplify: Just set the public_id. Cloudinary raw handles extensions automatically
    // if they are part of the public_id.
    const safePublicId = customPublicId.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    uploadOptions.public_id = safePublicId;
    // Explicitly set access_mode to public to prevent 401 errors
    uploadOptions.access_mode = 'public';
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            url: result?.secure_url,
            publicId: result?.public_id,
            resourceType: result?.resource_type,
            assetId: result?.asset_id,
          });
        }
      }
    ).end(buffer);
  });
}
