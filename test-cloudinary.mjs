import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const publicId = "model_3__1_.pdf";
  const url = cloudinary.utils.private_download_url("model_3__1_.pdf", "", { resource_type: "raw", type: "upload" });
  console.log("Private Download URL:", url);
  
  const r = await fetch(url);
  console.log("Status:", r.status);
}
run();
