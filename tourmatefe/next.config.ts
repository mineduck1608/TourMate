// next.config.js (hoặc next.config.ts nếu bạn dùng TypeScript)
import type { NextConfig } from 'next';
import withFlowbiteReact from 'flowbite-react/plugin/nextjs';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'i.pravatar.cc',
      'img.freepik.com', // thêm domain freepik
      'bestlocationhotels.com',
    ],
  },
};

export default withFlowbiteReact(nextConfig);
