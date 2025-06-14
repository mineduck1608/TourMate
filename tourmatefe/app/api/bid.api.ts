import http from "../utils/http";
import { PagedResult } from "@/types/pagedResult";
import { Bid, BidListResult } from "@/types/bid";

export const getBidsOfTourBid = async (tourBid: number | string, page: number | string, limit: number | string, signal?: AbortSignal) => {
    const res = await http.get<PagedResult<BidListResult>>('bids/tour/' + tourBid, {
        params: {
            pageSize: limit,
            pageIndex: page,
        },
        signal
    });

    return res.data;
};

export const addBid = async (data: Bid, signal?: AbortSignal) => {
    const res = await http.post('bids', data, {
        signal
    });

    return res.data;
};

export const updateBid = async (data: Bid, signal?: AbortSignal) => {
    const res = await http.put('bids', data, {
        signal
    });

    return res.data;
};

export const deleteBid = async (id: number, signal?: AbortSignal) => {
    const res = await http.delete('bids/' + id, {
        signal
    });

    return res.data;
};

export const acceptBid = async (id: number) => {
    const res = await http.post('bids/accept/' + id)
    return res.data
}