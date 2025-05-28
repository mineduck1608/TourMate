import { getBidsOfTourBid } from "@/app/api/bid.api";
import { getTourBids } from "@/app/api/tour-bid.api";
import { formatNumber } from "@/types/other";
import { TourBid } from "@/types/tour-bid";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
function TourBidRender({ tourBid }: { tourBid: TourBid }) {
  const [pageSize,] = useState(10)
  const bidData = useQuery({
    queryKey: ['bids-of', tourBid.tourBidId, 1, pageSize],
    queryFn: () => getBidsOfTourBid(tourBid.tourBidId, 1, pageSize)
  })
  const bids = bidData.data?.result ?? []
  return (
    <div className="shadow-lg p-5 rounded-lg">
      <div className="flex h-min">
        <img
          src={tourBid.account?.customers?.[0].image}
          className="w-[75px] rounded-full h-[75px]"
          alt={"profile"}
        />
        <div className="ml-4 w-full">
          <h3 className="font-bold text-xl">
            {tourBid.account?.customers?.[0].fullName}
          </h3>
          <p>{dayjs(tourBid.createdAt).format("DD/MM/YYYY")}</p>
          <p className=""><FaMapMarkerAlt className="inline" />{tourBid.placeRequestedNavigation?.areaName}</p>
        </div>
      </div>
      <div className="my-5">{tourBid.content}</div>
      <div className="border-2" />
      <div className="mt-5">
        <h3 className="font-semibold text-lg">Bảng đấu giá</h3>
        <div className="">
          {
            bids.map((v) => (
              <div key={v.bidId} className="bg-[#F8FAFC] flex p-3 my-2 rounded-sm items-center justify-between">
                <div className="flex items-center">
                  <img src={v.tourGuide?.image ?? 'a'} alt="pfp" className="w-[75px] h-[75px] rounded-full" />
                  <p className="ml-2 font-semibold">{v.tourGuide?.fullName}</p>

                </div>
                <p className="font-semibold text-blue-700">{formatNumber(v.amount)} VND</p>
              </div>
            ))
          }
        </div>
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
          <TourBidRender tourBid={v} key={i} />
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
