"use client";

import { Suspense } from "react";
import { useQueryString } from "@/app/utils/utils";
import Banner from "@/components/Banner";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { getTourService } from "../api/tour-service.api";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";



const TourServiceDetail = () => {
  const queryString: { id?: string } = useQueryString();
  const tourServiceId = Number(queryString.id) || 1;

  const { data, error, isLoading } = useQuery({
    queryKey: ["tour-service-detail", tourServiceId],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return getTourService(tourServiceId);
    },
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 24 * 3600 * 1000,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data!</div>;
  }

  return (
    <div className="flex flex-wrap">
      {/* Left content section */}
      <Banner
        imageUrl={
          data?.data?.image ||
          "https://img.freepik.com/premium-photo/vietnam-flag-vintage-wood-wall_118047-4319.jpg?w=1380"
        }
        title={data?.data?.serviceName || "No title available"}
        subtitle={data?.data?.title || "No title available"}
      />
      <div
        className="w-full max-w-md mx-auto text-center mt-15"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <h1 className="italic text-4xl font-normal text-[#3e72b9]">Thông tin chuyến đi</h1>
        <p className="text-xs font-normal text-gray-400 tracking-wide uppercase mt-1">LỊCH TRÌNH VÀ ĐỊA ĐIỂM</p>
      </div>

      <div className="flex justify-between gap-5 py-15 px-15">
        {/* LEFT CONTENT */}
        <div className="w-[68%]">
          <h1 className="mb-5 text-xl font-semibold">{data?.data?.title}</h1>
          <div
            className="w-full quill-content text-justify"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                (data?.data?.content || "").replace(
                  /(https?:\/\/[^\s"<>]+(?:png|jpg|jpeg|gif|bmp|svg))/gi,
                  (match) => {
                    return `<img src="${match}" alt="Image" style="width: 100%; height: auto; margin-bottom: 10px;" />`;
                  }
                )
              ),
            }}
          />
        </div>

        {/* SIDEBAR */}
        <div className="w-[30%] p-2 *:mb-10">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-center">THÔNG TIN</h2>
            <p>{data?.data?.tourDesc}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MegaMenu />
      <TourServiceDetail />
      <Footer />
    </Suspense>
  );
}
