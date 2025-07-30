import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'www.allaboutbirds.org',
        port: '',
      },
      // Agrega más dominios según necesites
      {
        protocol: 'https',
        hostname: '*', // ⚠️ Solo para desarrollo, en producción especifica dominios exactos
        port: '',
      },
    ],
  },
};

export default nextConfig;
