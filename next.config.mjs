/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    optimizeCss: true,
  },
  // Enable standalone output for Docker
  output: 'standalone',
  // Reduce CSS preload warnings in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};
 
export default nextConfig;