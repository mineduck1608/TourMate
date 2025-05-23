import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // đường dẫn có thể thay đổi tùy vị trí file providers.tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // import the CSS for the Toastify component
import '@/styles/globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TourMate",
  description: "Reach the world your way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Charm:wght@400;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
         <link rel="icon" href="@/public/Logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Bao bọc toàn bộ cây component bằng Providers để có thể sử dụng React Query */}
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
