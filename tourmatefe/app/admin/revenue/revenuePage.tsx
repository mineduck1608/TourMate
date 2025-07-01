import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RevenueHeader from "./revenueHeaderPage";
import { SummaryBoxes } from "./revenueStatBoxes";
import { RevenueUnpaidBox } from "./revenueUnpaidBox";
import { FilterBox } from "./revenueFilterBox";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { useQueryString } from "../../utils/utils";
import { PagedResult } from "@/types/pagedResult";
import { RevenueDto } from "@/types/revenue";
import { TourGuide } from "@/types/tour-guide";
import { getAllRevenue } from "@/app/api/revenue.api";
import { getTourGuides } from "@/app/api/tour-guide.api";

const LIMIT = 10;

export default function RevenuePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;

  const {
    data: revenuesData,
    isLoading: isLoadingRevenues,
    error: errorRevenues,
  } = useQuery<PagedResult<RevenueDto>>({
    queryKey: ["revenues", page],
    queryFn: async () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const result = await getAllRevenue(page, LIMIT, controller.signal);
      console.log("Revenues data:", result);
      return result;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const {
    data: tourGuidesData,
    isLoading: isLoadingTourGuides,
    error: errorTourGuides,
  } = useQuery<PagedResult<TourGuide>>({
    queryKey: ["tour-guides", page],
    queryFn: async () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const result = await getTourGuides(1, 1000, controller.signal);
      console.log("Tour guides data:", result);
      return result;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const mappedRevenues = React.useMemo(() => {
    if (!revenuesData?.result || !tourGuidesData?.result) return [];
    const guideMap = Object.fromEntries(
      tourGuidesData.result.map((g) => [g.tourGuideId, g])
    );
    return revenuesData.result.map((rev) => {
      const guide = guideMap[rev.tourGuideId];
      return {
        ...rev,
        fullName: guide?.fullName || "",
        phone: guide?.phone || "",
        email: guide?.account?.email || "",
      };
    });
  }, [revenuesData, tourGuidesData]);

  const filteredRevenues = React.useMemo(() => {
    return mappedRevenues.filter((item) => {
      // Lọc theo tên
      const matchName = search
        ? item.fullName?.toLowerCase().includes(search.toLowerCase())
        : true;
      // Lọc theo trạng thái thanh toán
      const matchStatus =
        status === ""
          ? true
          : status === "Paid"
          ? item.paymentStatus === true
          : item.paymentStatus === false;
      return matchName && matchStatus;
    });
  }, [mappedRevenues, search, status]);

  if (isLoadingRevenues || isLoadingTourGuides) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (errorRevenues || errorTourGuides) {
    return (
      <div className="text-red-500 text-center p-4">Lỗi khi tải dữ liệu</div>
    );
  }

  return (
    <div>
      <RevenueHeader
        onShowHistory={() => alert("Xem Lịch Sử Thanh Toán")}
        onPaySelected={() => alert("Thanh toán doanh thu đã chọn")}
        payDisabled={true}
      />
      <SummaryBoxes />
      <RevenueUnpaidBox />
      <FilterBox
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={status}
        onStatusChange={setStatus}
        onClear={() => {
          setSearch("");
          setStatus("");
        }}
      />
      <DataTable
        columns={columns}
        data={filteredRevenues}
        totalResults={filteredRevenues.length}
        totalPages={revenuesData?.totalPage || 0}
        page={page}
      />
    </div>
  );
}
