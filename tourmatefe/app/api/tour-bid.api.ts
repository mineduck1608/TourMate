import { TourBid } from "@/types/tour-bid";
import http from "../utils/http";
import { PagedResult } from "@/types/pagedResult";

export const getTourBids = async (page: number | string, limit: number | string, signal?: AbortSignal) => {
  const res = await http.get<PagedResult<TourBid>>('tour-bids', {
    params: {
      pageSize: limit,
      pageIndex: page,
    },
    signal
  });

  return res.data;
};