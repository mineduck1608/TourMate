import { TourGuide } from "@/types/tour-guide";
import http from "../utils/http";
import { PagedResult } from "@/types/pagedResult";

export const getTourGuides = async (page: number | string, limit: number | string, signal?: AbortSignal, phone?: string) => {
    const res = await http.get<PagedResult<TourGuide>>('tour-guide', {
      params: {
        pageSize: limit,
        pageIndex: page,
        phone: phone,
      },
      signal
    });
  
    return res.data;
  };

export const getTourGuide = async (id: number | string) => http.get<TourGuide>(`tour-guide/${id}`)


  export const addTourGuide = async (data: TourGuide) => {
    const response = await http.post('/tour-guide', data);
    return response.data;
  };

  export const updateTourGuide = async (id: number, data: TourGuide) => {
    const response = await http.put(`/tour-guide/${id}`, data);
    return response.data;
  };
  
  export const lockTourGuide = async (id: number) => {
    const response = await http.put(`/account/lock/${id}`);
    return response.data;
  };

  export const unlockTourGuide = async (id: number) => {
    const response = await http.put(`/account/unlock/${id}`);
    return response.data;
  };
