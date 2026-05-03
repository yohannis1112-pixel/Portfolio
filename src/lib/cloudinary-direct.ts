"use client";

// Direct browser → Cloudinary upload - bypasses server completely
// This prevents large files from crashing the server

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export async function uploadDirectToCloudinary(
  file: File,
  resourceType: "image" | "video" | "raw" = "auto" as any,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET environment variables"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "portfolio");

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          resourceType: data.resource_type,
        });
      } else {
        const error = JSON.parse(xhr.responseText);
        reject(new Error(error?.error?.message || `Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was cancelled"));
    });

    xhr.open("POST", url);
    xhr.send(formData);
  });
}