"use client";

// pages/admin/news/page.js
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

// Dynamic import cho NewsPage để tắt SSR
const NewsPage = dynamic(() => import('@/app/admin/news/newsPage'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin/dashboard">Quản lý</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Tin tức</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="w-[95%] mx-auto rounded-md border p-5 mb-10">
            {/* Hiển thị bảng dữ liệu khi có dữ liệu */}
            <NewsPage />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
