import { getTourBids } from "@/app/api/tour-bid.api";
import { TourBid } from "@/types/tour-bid";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useState } from "react";
function Bid({ tourBid }: { tourBid: TourBid }) {
  return (
    <div className="shadow-lg p-5 rounded-lg">
      <div className="flex h-min">
        <Image
          src={tourBid.account?.customers?.[0].image ?? "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"}
          className="w-[75px] rounded-full h-[75px]"
          alt={"profile"}
        />
        <div className="ml-4 w-full">
          <h3 className="font-bold text-xl">
            {tourBid.account?.customers?.[0].fullName}
          </h3>
          <p>{dayjs(tourBid.createdAt).format("DD/MM/YYYY")}</p>
        </div>
      </div>
      <div className="my-5">{tourBid.content}</div>
      <div className="border-2" />
      <div className="mt-5">
        <h3 className="font-semibold text-lg">Bảng đấu giá</h3>
      </div>
    </div>
  );
}
function BidList() {
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const tourBids = useQuery({
    queryKey: ["tour-bids", pageSize, page],
    queryFn: () => getTourBids(page, pageSize),
    staleTime: 24 * 3600 * 1000,
  });
  const data = tourBids.data?.result ?? [];
  const maxPage = tourBids.data?.totalPage ?? 0;
  function handlePageChange(n: number) {
    setPage((p) => p + n);
  }
  return (
    <div>
      <div className="*:my-5">
        {data.map((v, i) => (
          <Bid tourBid={v} key={i} />
        ))}
      </div>
      <div className="flex justify-center items-center mt-10 space-x-6">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={page === 1}
          className="px-6 py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
        >
          Trang trước
        </button>
        <span className="text-lg text-gray-700 font-semibold">
          Trang {page} / {maxPage}
        </span>
        <button
          onClick={() => handlePageChange(1)}
          disabled={page === maxPage || maxPage === 0}
          className="px-6 py-3 border rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition duration-200"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default BidList;
