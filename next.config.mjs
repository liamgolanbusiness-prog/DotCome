/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Use /DotCome base path only when building for GitHub Pages
  basePath: process.env.GITHUB_ACTIONS ? "/DotCome" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/DotCome/" : "",
  reactStrictMode: true,
  transpilePackages: ["three"],
  images: {
    unoptimized: true, // required for static export
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
