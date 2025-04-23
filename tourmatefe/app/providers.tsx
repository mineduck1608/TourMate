"use client"; // Đánh dấu đây là client component

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


// Bạn có thể cấu hình QueryClient tùy theo nhu cầu (ví dụ: thêm default options)
export default function Providers({ children }: { children: React.ReactNode }) {
  // Sử dụng useState để đảm bảo rằng QueryClient chỉ được khởi tạo một lần trên client
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
