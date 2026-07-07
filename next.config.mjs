/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    // En développement, on peut proxy directement vers le backend
    // pour éviter les soucis CORS locaux si besoin. En production,
    // NEXT_PUBLIC_API_URL pointe directement vers l'API.
    return [];
  },
};

export default nextConfig;
