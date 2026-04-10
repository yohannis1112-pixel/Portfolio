import { uploadToCloudinaryServer } from "@/actions/cloudinary";
 
export async function uploadToCloudinary(file: File, resourceType?: "image" | "video" | "raw", publicId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (resourceType) {
    formData.append("resourceType", resourceType);
  }
  if (publicId) {
    formData.append("publicId", publicId);
  }

  try {
    const result = await uploadToCloudinaryServer(formData);
    return result as any;
  } catch (error: any) {
    console.error("Cloudinary Client Upload Error:", error);
    throw new Error(error.message || "Cloudinary upload failed");
  }
}
