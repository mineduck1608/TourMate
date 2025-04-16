import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Kích hoạt chế độ strict của React
  basePath: '/tourmatefe', // (Nếu bạn cần thiết lập base path, ví dụ: ứng dụng chạy ở /tourmatefe)
  images: {
    domains: ['example.com'], // Thêm các domain hợp lệ cho hình ảnh (nếu dùng Next.js Image)
  },
};

export default nextConfig;
