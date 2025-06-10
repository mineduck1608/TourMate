import { PagedResult } from "@/types/pagedResult";
import http from "../utils/http";
import { TourBidComment, TourBidCommentCreateModel, TourBidCommentListResult } from "@/types/tour-bid-comment";

export const getTourBidCommentsFrom = async (tourBidId: number, page: number | string, limit: number | string, signal?: AbortSignal) => {
  const res = await http.get<PagedResult<TourBidCommentListResult>>('comments/from/' + tourBidId, {
    params: {
      pageSize: limit,
      pageIndex: page,
    },
    signal
  });

  return res.data;
};

export const addTourBidComment = async (tourBidComment: TourBidCommentCreateModel) => {
  const res = await http.post('comments', tourBidComment);
  return res.data;
}

export const updateTourBidComment = async (tourBidComment: TourBidComment | TourBidCommentListResult) => {
  const res = await http.put('comments', tourBidComment);
  return res.data;
}

export const deleteTourBidComment = async (id: number) => {
  const res = await http.delete('comments/' + id);
  return res.data;
}