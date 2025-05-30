"use client";

import { useQueryString } from "@/app/utils/utils";
import Banner from "@/components/Banner";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { getTourService } from "../api/tour-service.api";
import { getTourGuide } from "../api/tour-guide.api";
import OtherServices from "./otherService";
import OtherAreas from "./otherArea";
import HotAreas from "./hotArea";
import OtherTourGuides from "./otherTourGuide";



export function TourServiceDetail() {
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

  const tourGuidId = data?.data?.tourGuideId;

  const {
    data: tourGuideData,
    error: tourGuideError,
    isLoading: isTourGuideLoading,
  } = useQuery({
    queryKey: ["tour-guide-info", tourGuidId],
    queryFn: () => getTourGuide(tourGuidId as number),
    enabled: !!tourGuidId,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 24 * 3600 * 1000,
  });

  if (isLoading) {
    return <div>Loading tour service...</div>;
  }

  if (error) {
    return <div>Error loading tour service!</div>;
  }

  if (isTourGuideLoading) {
    return <div>Loading tour guide...</div>;
  }

  if (tourGuideError) {
    return <div>Error loading tour guide!</div>;
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

      <div className="flex flex-col md:flex-row justify-between gap-5 py-10 px-4 md:px-15 min-h-screen">
  {/* LEFT CONTENT */}
  <div className="w-full md:w-[68%] overflow-y-auto pr-0 md:pr-4">
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
    <div className="flex flex-col sm:flex-row justify-between gap-4 px-4 py-5 bg-[#F2F8FB] rounded-lg mt-5">
      <a
        href="https://www.example.com"
        className="flex-1 px-6 py-3 bg-[#DBE4F7] text-black rounded text-center hover:bg-gray-300 transition-colors duration-300 font-semibold text-lg"
      >
        Giá cả: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.data?.price || 0)}
      </a>
      <a
        href="https://www.example.com"
        className="flex-1 px-6 py-3 bg-[#DBE4F7] text-black rounded text-center hover:bg-gray-300 transition-colors duration-300 font-semibold text-lg"
      >
        Đặt lịch
      </a>
    </div>
  </div>

  {/* RIGHT CONTENT */}
  <div className="w-full md:w-[30%] p-2 flex flex-col gap-15 mt-10 md:mt-0">
    {/* Div 1 */}
    <div className="bg-[#F2F8FB] p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold text-center">THÔNG TIN</h2>
      <p className="text-center text-lg">{data?.data.serviceName}</p>
      <p className="text-center">{data?.data?.tourDesc}</p>
    </div>

    {/* Div 2 - Tour guide info */}
    <div className="relative bg-[#F2F8FB] p-6 pt-20 rounded-lg space-y-4">
      <div className="absolute left-1/2 -top-10 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
        <img
          src={tourGuideData?.data?.image || "/default-avatar.png"}
          alt={tourGuideData?.data?.fullName || "Tour Guide"}
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-2xl text-gray-600 font-bold text-center">
        {tourGuideData?.data?.fullName || "Tên không có"}
      </h2>
      <p className="text-center">GIỚI THIỆU</p>
      <p
        className="text-sm text-gray-600 line-clamp-10"
        dangerouslySetInnerHTML={{
          __html: tourGuideData?.data?.tourGuideDescs?.[0].description || "Không có mô tả",
        }}
      />
      <a
        href="https://www.example.com"
        className="block px-4 py-2 mx-auto w-fit bg-[#DBE4F7] text-black rounded text-center hover:bg-gray-300 transition-colors duration-300 text-sm"
      >
        CHI TIẾT
      </a>
    </div>
  </div>
</div>



      <div className="px-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <OtherServices tourGuideId={tourGuidId as number} serviceId={tourServiceId} />
      </div>
      <div className="px-15 py-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <OtherAreas />
      </div>
      <div className="px-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <OtherTourGuides tourGuideId={tourGuidId as number} />
      </div>
      <div className="px-15 py-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <HotAreas />
      </div>
    </div>
  );
};
