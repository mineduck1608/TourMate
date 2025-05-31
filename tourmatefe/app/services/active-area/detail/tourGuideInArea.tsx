'use client';
import { getActiveArea } from '@/app/api/active-area.api';
import { getTourGuidesByArea } from '@/app/api/tour-guide.api';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // hook lấy query param trong Next.js 13 app router
import React from 'react';

export default function TourGuidesInArea() {
  const searchParams = useSearchParams();
  const areaIdParam = searchParams.get('id');
  const areaId = areaIdParam ? Number(areaIdParam) : 1;

  const { data, isLoading, error } = useQuery({
    queryKey: ['tour-guides', areaId],
    queryFn: () => getTourGuidesByArea(areaId, 2), // API trả về mảng TourGuide[]
    staleTime: 24 * 3600 * 1000, // cache 1 ngày
  });

  const areaQuery = useQuery({
    queryKey: ['active-area', areaId],
    queryFn: () => getActiveArea(areaId),
    staleTime: 24 * 3600 * 1000, // cache 1 ngày
  });

  if (isLoading) {
    return <p className="text-center py-4">Đang tải dữ liệu...</p>;
  }

  if (error || !Array.isArray(data) || data.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#f9fbfc] px-4 py-10 text-center">
      <h2 className="text-2xl font-semibold text-[#3e72b9] mb-2">
        Rất tiếc!
      </h2>
      <p className="text-gray-600 text-base max-w-md">
        Hiện tại chưa có hướng dẫn viên nào được ghi nhận trong khu vực này. Vui lòng quay lại sau hoặc chọn khu vực khác để tiếp tục khám phá.
      </p>
    </div>
  );
}

  return (
    <motion.div
      className="bg-[#f9fbfc] min-h-screen py-8 px-4 max-w-4xl mx-auto"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <h1 className="text-3xl italic text-[#3e72b9] font-normal mb-8 text-center">
        Hướng dẫn viên tại<br /> {areaQuery.data?.areaName || "Khu vực chưa xác định"}
      </h1>

      <AnimatePresence mode="wait">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {data.map((guide) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={guide.image}
                  alt={guide.fullName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{guide.fullName}</h2>
                  <p className="text-sm text-gray-600">{guide.tourGuideDescs?.[0]?.company}</p>
                </div>
              </div>

              <p className="italic text-gray-700 mb-4" dangerouslySetInnerHTML={{
                __html: guide?.tourGuideDescs?.[0].description || "Không có mô tả",
              }} />

              <Link
                href={`/services/tour-guide/${guide.tourGuideId}`}
                className="block w-max mt-6 py-2 px-4 bg-[#e5eaf3] text-gray-800 font-medium rounded-md hover:bg-[#dce4f0] transition mx-auto"
              >
                Đặt chuyến đi ngay
              </Link>

            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}
