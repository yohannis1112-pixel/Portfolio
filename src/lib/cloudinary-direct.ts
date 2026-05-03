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

// 100MB threshold - files above this use chunked upload
const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB chunks
const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024; // 100MB

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

  // Use chunked upload for large files
  if (file.size > LARGE_FILE_THRESHOLD) {
    return uploadChunked(file, resourceType, onProgress);
  }

  return uploadSingle(file, resourceType, onProgress);
}

// Regular single upload for files under 100MB
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

    // No timeout for uploads - let it complete
    xhr.timeout = 0;

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
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error?.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload. Check your internet connection.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload was cancelled.")));
    xhr.addEventListener("timeout", () => reject(new Error("Upload timed out.")));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

// Chunked upload for files over 100MB
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

    // Pass publicId on subsequent chunks to continue the same upload
    if (publicId) {
      formData.append("public_id", publicId);
    }

    const result = await new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 0;

      // Content-Range header tells Cloudinary this is a chunk
      const contentRange = `bytes ${start}-${end - 1}/${file.size}`;

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const chunkUploaded = uploadedBytes + e.loaded;
          onProgress({
            loaded: chunkUploaded,
            total: file.size,
            percent: Math.round((chunkUploaded / file.size) * 100),
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
      xhr.addEventListener("abort", () => reject(new Error("Chunk upload was cancelled.")));

      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Range", contentRange);
      xhr.setRequestHeader("X-Unique-Upload-Id", `${file.name}-${file.size}-${file.lastModified}`);
      xhr.send(formData);
    });

    uploadedBytes = end;

    // Save publicId from first chunk response
    if (result.public_id) {
      publicId = result.public_id;
    }

    // Last chunk returns the final result
    if (chunkIndex === totalChunks - 1) {
      return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
      };
    }
  }

  throw new Error("Chunked upload failed - no final result received.");
}
