/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  devIndicators: false,
  experimental: {
    serverComponentsExternalPackages: ['playwright']
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure html2canvas is properly bundled for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
}
 
export default nextConfig