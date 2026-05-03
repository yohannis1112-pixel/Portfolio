"use client";

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

const CHUNK_SIZE = 20 * 1024 * 1024;         // 20MB per chunk
const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024; // 100MB
const IMAGE_MAX_SIZE = 10 * 1024 * 1024;     // 10MB Cloudinary free limit
const IMAGE_COMPRESS_TARGET = 8 * 1024 * 1024; // Compress to 8MB

// Compress image in browser before uploading
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      let { width, height } = img;

      const MAX_DIMENSION = 3840; // Max 4K
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= IMAGE_COMPRESS_TARGET || quality <= 0.5) {
              resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            } else {
              tryCompress(quality - 0.1);
            }
          },
          "image/jpeg",
          quality
        );
      };

      tryCompress(0.92);
    };

    img.src = objectUrl;
  });
}

export async function uploadDirectToCloudinary(
  file: File,
  resourceType: "image" | "video" | "raw" = "image",
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET environment variables"
    );
  }

  let fileToUpload = file;

  // Auto-compress images over 10MB
  if (resourceType === "image" && file.size > IMAGE_MAX_SIZE) {
    fileToUpload = await compressImage(file);
  }

  // Chunked upload for large videos
  if (fileToUpload.size > LARGE_FILE_THRESHOLD) {
    return uploadChunked(fileToUpload, resourceType, onProgress);
  }

  return uploadSingle(fileToUpload, resourceType, onProgress);
}

function uploadSingle(
  file: File,
  resourceType: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET!);
    formData.append("folder", "portfolio");

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
    const xhr = new XMLHttpRequest();
    xhr.timeout = 0;

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({ loaded: e.loaded, total: e.total, percent: Math.round((e.loaded / e.total) * 100) });
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id, resourceType: data.resource_type });
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error?.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload was cancelled.")));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

async function uploadChunked(
  file: File,
  resourceType: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let uploadedBytes = 0;
  let publicId: string | undefined;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("upload_preset", UPLOAD_PRESET!);
    formData.append("folder", "portfolio");
    if (publicId) formData.append("public_id", publicId);

    const result = await new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 0;

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress({
            loaded: uploadedBytes + e.loaded,
            total: file.size,
            percent: Math.round(((uploadedBytes + e.loaded) / file.size) * 100),
          });
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 206) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error?.error?.message || `Chunk upload failed: ${xhr.status}`));
          } catch {
            reject(new Error(`Chunk upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error during chunk upload.")));

      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Range", `bytes ${start}-${end - 1}/${file.size}`);
      xhr.setRequestHeader("X-Unique-Upload-Id", `${file.name}-${file.size}-${file.lastModified}`);
      xhr.send(formData);
    });

    uploadedBytes = end;
    if (result.public_id) publicId = result.public_id;

    if (chunkIndex === totalChunks - 1) {
      return { url: result.secure_url, publicId: result.public_id, resourceType: result.resource_type };
    }
  }

  throw new Error("Chunked upload failed - no final result received.");
}
