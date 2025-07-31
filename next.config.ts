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
      {
        protocol: 'https',
        hostname: 'd1flfk77wl2xk4.cloudfront.net',
        port: '',
      },
      // Dominios comunes de CDN
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
      },
    ],
    // Configuración adicional para desarrollo
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Configuración para mejor rendimiento en producción
  poweredByHeader: false,
  compress: true,
  // Optimización para Vercel
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
};

export default nextConfig;
