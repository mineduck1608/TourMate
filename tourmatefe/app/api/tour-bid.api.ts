import { TourBid, TourBidListResult } from "@/types/tour-bid";
import http from "../utils/http";
import { PagedResult } from "@/types/pagedResult";

export const getTourBids = async (accountIdFrom: number, page: number | string, limit: number | string, signal?: AbortSignal, content?: string) => {
  const res = await http.get<PagedResult<TourBidListResult>>('tour-bids', {
    params: {
      pageSize: limit,
      pageIndex: page,
      content,
      accountIdFrom
    },
    signal
  });

  return res.data;
};

export const addTourBid = async (tourBid: TourBid | TourBidListResult) => {
  const response = await http.post('/tour-bids', {
    accountId: tourBid.accountId,
    content: tourBid.content,
    placeRequested: tourBid.placeRequested,
    maxPrice: tourBid.maxPrice
  });
  return response.data;  // Assuming the API returns the created news item
}


export const updateTourBid = async (tourBid: TourBid | TourBidListResult) => {
  const response = await http.put('/tour-bids', tourBid);
  return response.data;  // Assuming the API returns the created news item
}

export const deleteTourBid = async (id: number) => {
  const response = await http.delete('/tour-bids/' + id);
  return response.data;  // Assuming the API returns the created news item
}

export const likeOrUnlike = async (accountId: number, tourBidId: number) => {
  const response = await http.post('/tour-bids/like-or-unlike', {}, {
    params: {
      accountId: accountId,
      tourBidId: tourBidId
    }
  });
  return response.data;
}