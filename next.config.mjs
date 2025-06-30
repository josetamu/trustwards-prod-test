/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  devIndicators: false,
}
 
export default nextConfig