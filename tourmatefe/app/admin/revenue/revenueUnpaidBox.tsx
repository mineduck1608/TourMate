import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllRevenue } from "@/app/api/revenue.api";
import { getTourGuides } from "@/app/api/tour-guide.api";
import { RevenueDto } from "@/types/revenue";
import { TourGuide } from "@/types/tour-guide";

const LIMIT = 1000;

export function RevenueUnpaidBox() {
  // Fetch all revenue data
  const { data, isLoading } = useQuery({
    queryKey: ["all-revenue-unpaid-box"],
    queryFn: () => getAllRevenue(1, LIMIT),
  });

  // Fetch all tour guides
  const { data: tourGuideData } = useQuery({
    queryKey: ["all-tour-guides"],
    queryFn: () => getTourGuides(1, LIMIT),
  });

  // Xử lý dữ liệu
  const unpaidList: Record<
    string,
    { unpaidBookings: number; unpaidAmount: number; tourGuideId: number }
  > = {};

  ((data?.result as RevenueDto[]) || []).forEach((item) => {
    if (!item.tourGuideName || item.paymentStatus !== false) return;
    if (!unpaidList[item.tourGuideName]) {
      unpaidList[item.tourGuideName] = {
        unpaidBookings: 0,
        unpaidAmount: 0,
        tourGuideId: item.tourGuideId,
      };
    }
    unpaidList[item.tourGuideName].unpaidBookings += 1;
    unpaidList[item.tourGuideName].unpaidAmount += item.totalAmount || 0;
  });

  const unpaidGuides = Object.entries(unpaidList).map(([name, value]) => ({
    name,
    unpaidBookings: value.unpaidBookings,
    unpaidAmount: value.unpaidAmount,
    tourGuideId: value.tourGuideId,
  }));

  const tourGuideMap: Record<number, string | undefined> = {};
  ((tourGuideData?.result as TourGuide[]) || []).forEach((guide) => {
    tourGuideMap[guide.tourGuideId] = guide.image;
  });

  return (
    <div className="bg-white rounded-xl p-6 mt-2 border">
      <div className="font-semibold text-lg mb-1">
        Tổng hợp hoa hồng chưa thanh toán theo Tour Guide
      </div>
      <div className="text-gray-500 mb-5 text-sm">
        Tổng quan các khoản thanh toán đang chờ của từng Tour Guide
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : unpaidGuides.length === 0 ? (
          <div className="text-gray-400">
            Không tìm thấy hoa hồng chưa thanh toán.
          </div>
        ) : (
          unpaidGuides.map((guide) => (
            <div
              key={guide.name}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-5 py-4"
            >
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold">
                  {tourGuideMap[guide.tourGuideId] ? (
                    <img
                      src={tourGuideMap[guide.tourGuideId]}
                      alt={guide.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>✦</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-base">{guide.name}</div>
                  <div className="text-gray-400 text-sm">
                    {guide.unpaidBookings} Lượt booking chưa thanh toán
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-red-500 font-bold text-lg">
                  {guide.unpaidAmount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  })}
                </div>
                <div className="text-gray-400 text-xs">
                  Tổng chưa thanh toán
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}