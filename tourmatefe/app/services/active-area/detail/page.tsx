"use client";

import { getActiveArea } from "@/app/api/active-area.api";
import { useQueryString } from "@/app/utils/utils";
import Banner from "@/components/Banner";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from 'dompurify';

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
          imageUrl={data?.data?.bannerImg || "https://img.freepik.com/premium-photo/vietnam-flag-vintage-wood-wall_118047-4319.jpg?w=1380"}
          title={data?.data?.areaTitle || "No title available"}
          subtitle={data?.data?.areaSubtitle || "No title available"}
        />
      <div className="w-full lg:w-3/4 text-2xl font-bold p-10">
          <h1>{data?.data?.areaTitle}</h1>
          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.data?.areaContent || "") }} />
        </div>
      {/* Right sidebar */}
      <div className="w-full lg:w-1/4 p-10">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Related Content</h2>
          <ul>
            <li><a href="#" className="text-blue-500">Link 1</a></li>
            <li><a href="#" className="text-blue-500">Link 2</a></li>
            <li><a href="#" className="text-blue-500">Link 3</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AreaDetail;
