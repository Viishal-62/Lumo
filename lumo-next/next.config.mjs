/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["puppeteer", "mongoose", "googleapis"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
