/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "media.licdn.com",
      "apod.nasa.gov",
    ],
  },
};

export default nextConfig;
