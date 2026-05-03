/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.youtube.com", "drive.google.com"],
  },
  // Enable standalone output for Docker
  output: 'standalone',
};
 
export default nextConfig;
