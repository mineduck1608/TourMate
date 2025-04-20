import type { NextConfig } from 'next';
import withFlowbiteReact from 'flowbite-react/plugin/nextjs';
import path from 'path';

const nextConfig: NextConfig = {
  // Các tùy chọn cấu hình khác của Next.js
  webpack: (config) => {
    // Cấu hình alias cho Vercel
    config.resolve.alias['@'] = path.resolve(__dirname);

    // Gọi lại cấu hình Webpack ban đầu
    return config;
  },
};

export default withFlowbiteReact(nextConfig);
