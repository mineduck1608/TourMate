import http from "../utils/http";
import { PagedResult } from "@/types/pagedResult";
import { Bid } from "@/types/bid";

export const getBidsOfTourBid = async (tourBid: number | string, page: number | string, limit: number | string, signal?: AbortSignal) => {
    const res = await http.get<PagedResult<Bid>>('bids/tour/' + tourBid, {
        params: {
            pageSize: limit,
            pageIndex: page,
        },
        signal
    });

    return res.data;
};