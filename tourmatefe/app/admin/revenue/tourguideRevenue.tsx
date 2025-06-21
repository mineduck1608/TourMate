"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./column";
import { DataTable } from "./data-table";
import {
  revenueApi,
  RevenueDto,
  RevenueFilterDto,
} from "@/app/api/revenue.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const PAGE_SIZE = 10;

export default function TourGuideRevenuePage() {
  // State filter
  const [filter, setFilter] = useState<Partial<RevenueFilterDto>>({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    paymentStatus: undefined,
    tourGuideId: undefined,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<RevenueDto[]>([]);

  // Query data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["revenue-list", filter, search],
    queryFn: async () => {
      const res = await revenueApi.getList(
        { ...filter, tourGuideName: search },
        undefined
      );
      return res;
    },
    keepPreviousData: true,
  });

  // Dummy summary data (replace with real API if needed)
  const totalUnpaid =
    data
      ?.filter((r) => !r.paymentStatus)
      .reduce((sum, r) => sum + r.totalAmount, 0) || 0;
  const totalUnpaidGuides =
    new Set(data?.filter((r) => !r.paymentStatus).map((r) => r.tourGuideId))
      .size || 0;
  const selectedAmount = selected.reduce((sum, r) => sum + r.totalAmount, 0);
  const bookingsInMonth = data?.length || 0;

  // Filter handlers
  const handleStatusChange = (val: string) =>
    setFilter((f) => ({
      ...f,
      paymentStatus: val === "" ? undefined : val === "paid",
    }));
  const handleDeleteFilter = () => {
    setFilter({
      pageNumber: 1,
      pageSize: PAGE_SIZE,
      month: filter.month,
      year: filter.year,
    });
    setSearch("");
  };

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex gap-2">
        <Button onClick={() => alert("Xem lịch sử thanh toán")}>
          Lịch sử thanh toán
        </Button>
        <Button
          disabled={selected.length === 0}
          onClick={() => alert("Thanh toán cho hướng dẫn viên")}
        >
          Thanh toán
        </Button>
      </div>

      {/* Summary boxes */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded shadow">
          <div className="text-xs text-gray-500">
            Tổng doanh thu chưa thanh toán
          </div>
          <div className="text-xl font-bold">
            {totalUnpaid.toLocaleString()} đ
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded shadow">
          <div className="text-xs text-gray-500">
            Số hướng dẫn viên chưa thanh toán
          </div>
          <div className="text-xl font-bold">{totalUnpaidGuides}</div>
        </div>
        <div className="p-4 bg-blue-50 rounded shadow">
          <div className="text-xs text-gray-500">Doanh thu đã chọn</div>
          <div className="text-xl font-bold">
            {selectedAmount.toLocaleString()} đ
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded shadow">
          <div className="text-xs text-gray-500">Số booking trong tháng</div>
          <div className="text-xl font-bold">{bookingsInMonth}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 items-end">
        <Input
          placeholder="Tìm tên hướng dẫn viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={
            filter.paymentStatus === undefined
              ? ""
              : filter.paymentStatus
              ? "paid"
              : "unpaid"
          }
          onValueChange={handleStatusChange}
        >
          <SelectItem value="">Tất cả trạng thái</SelectItem>
          <SelectItem value="paid">Đã thanh toán</SelectItem>
          <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
        </Select>
        <Button variant="outline" onClick={handleDeleteFilter}>
          Xóa lọc
        </Button>
      </div>

      {/* Summary unpaid revenue by tourguide */}
      <div className="bg-gray-50 p-3 rounded">
        <div className="font-semibold mb-2">
          Tổng hợp doanh thu chưa thanh toán theo hướng dẫn viên
        </div>
        <ul>
          {Array.from(
            new Set(
              data?.filter((r) => !r.paymentStatus).map((r) => r.tourGuideName)
            )
          ).map((name) => (
            <li key={name}>
              {name}:{" "}
              {data
                ?.filter((r) => r.tourGuideName === name && !r.paymentStatus)
                .reduce((sum, r) => sum + r.totalAmount, 0)
                .toLocaleString()}{" "}
              đ
            </li>
          ))}
        </ul>
      </div>

      {/* Data table */}
      <DataTable columns={columns} data={data || []} isLoading={isLoading} />
    </div>
  );
}
