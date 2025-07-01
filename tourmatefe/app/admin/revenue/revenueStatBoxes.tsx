import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllRevenue } from "@/app/api/revenue.api";
import { RevenueDto } from "@/types/revenue";

const colorMap = {
  red: "text-red-500",
  orange: "text-orange-500",
  blue: "text-blue-500",
  green: "text-green-500",
};

const borderMap = {
  red: "border-red-100",
  orange: "border-orange-100",
  blue: "border-blue-100",
  green: "border-green-100",
};

const LIMIT = 1000;

export function SummaryBoxes() {
  // Fetch payments (đã sửa lại dùng getAllRevenue)
  const { data: revenueData, isLoading: isPaymentLoading } = useQuery({
    queryKey: ["all-payments"],
    queryFn: () => getAllRevenue(1, LIMIT),
  });

  // Tính toán dữ liệu
  const unpaidRevenues =
    (revenueData?.result as RevenueDto[] | undefined)?.filter(
      (p) => p.paymentStatus === false
    ) || [];
  const totalUnpaidRevenue = unpaidRevenues.reduce(
    (sum, p) => sum + (p.totalAmount || 0),
    0
  );
  const totalUnpaidGuides = new Set(unpaidRevenues.map((p) => p.tourGuideId))
    .size;

  // Bookings this month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const bookingsThisMonth =
    ((revenueData?.result as RevenueDto[] | undefined) || []).filter((s) => {
      if (!s.createdAt) return false;
      const d = new Date(s.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length || 0;

  // Loading state
  if (isPaymentLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-xl px-6 py-5 animate-pulse h-28"
          />
        ))}
      </div>
    );
  }

  const boxes = [
    {
      title: "Tiền Hoa Hồng Chưa Thanh Toán",
      value: `$${totalUnpaidRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
      subtitle: "Các Giao Dịch Đang Chờ",
      color: "red",
      rightIcon: <span className="text-red-400 text-lg">$</span>,
    },
    {
      title: "Các Tour Guide Chưa Được Trả Tiền",
      value: totalUnpaidGuides,
      subtitle: "Tour Guide đang chờ thanh toán",
      color: "orange",
      rightIcon: (
        <span
          className="text-orange-400 text-lg"
          style={{ transform: "rotate(-90deg)", display: "inline-block" }}
        >
          ⇨
        </span>
      ),
    },
    {
      title: "Tiền Hoa Hồng Đang Được Chọn",
      value: "$0.00",
      subtitle: "0 đã được chọn",
      color: "blue",
      rightIcon: <span className="text-blue-400 text-lg">📈</span>,
    },
    {
      title: "Lượng Booking Tháng Này",
      value: bookingsThisMonth,
      subtitle: "Lượt đặt trong tháng này",
      color: "green",
      rightIcon: <span className="text-green-400 text-lg">📅</span>,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {boxes.map((box, idx) => (
        <div
          key={idx}
          className={`bg-white border ${
            borderMap[box.color as keyof typeof borderMap]
          } rounded-xl px-6 py-5 flex flex-col justify-between shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-700">{box.title}</div>
            {box.rightIcon}
          </div>
          <div
            className={`mt-2 text-2xl font-bold ${
              colorMap[box.color as keyof typeof colorMap]
            }`}
          >
            {box.value}
          </div>
          <div className="text-sm text-gray-400 mt-1">{box.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
