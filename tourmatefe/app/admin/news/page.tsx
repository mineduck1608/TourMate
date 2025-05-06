"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "../../utils/utils";
import { getNews } from "@/app/api/news.api";

const LIMIT = 10;

export default function Page() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;

  const { data } = useQuery({
    queryKey: ['news', page],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);  // Hủy yêu cầu sau 5 giây nếu không có phản hồi
      return getNews(page, LIMIT, controller.signal);
    },
    retry: 0,
    refetchOnWindowFocus: false, // Tắt refetch khi người dùng quay lại tab
  });

  return (
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
                  <BreadcrumbLink href="/admin/dashboard">
                    Quản lý
                  </BreadcrumbLink>
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
          <DataTable columns={columns} data={data?.result ?? []} totalResults={data?.totalResult ?? 0} totalPages={data?.totalPage ?? 0} page={page}/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
