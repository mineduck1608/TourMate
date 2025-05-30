"use client";

import { Suspense } from "react";
import { getActiveArea } from "@/app/api/active-area.api";
import { useQueryString } from "@/app/utils/utils";
import Banner from "@/components/Banner";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import OtherArea from "./otherActiveArea";
import TourGuidesInArea from "./tourGuideInArea";



const AreaDetail = () => {
  const queryString: { id?: string } = useQueryString();
  const areaId = Number(queryString.id) || 1;

  const { data, error, isLoading } = useQuery({
    queryKey: ["active-area-detail", areaId],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return getActiveArea(areaId);
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
          data?.bannerImg ||
          "https://img.freepik.com/premium-photo/vietnam-flag-vintage-wood-wall_118047-4319.jpg?w=1380"
        }
        title={data?.areaTitle || "No title available"}
        subtitle={data?.areaSubtitle || "No title available"}
      />
      <div className="flex justify-between gap-5 py-15 px-15">
        {/* LEFT CONTENT */}
        <div className="w-[68%]">
          <h1 className="mb-5 text-xl font-semibold">{data?.areaTitle}</h1>
          <div
            className="w-full quill-content text-justify"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                (data?.areaContent || "").replace(
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
          <TourGuidesInArea />
        </div>
      </div>
      <div className="px-15 pb-15 w-full min-w-full max-w-md mx-auto text-center">
        <hr className="border-gray-200 sm:w-full mx-auto mb-10" />
        <OtherArea activeAreaId={areaId} size={2}/>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AreaDetail />
    </Suspense>
  );
}
