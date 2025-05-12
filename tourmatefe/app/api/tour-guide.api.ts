
import { TourGuide } from '@/types/tour-guide';
import http from '../utils/http'
import { PagedResult } from '@/types/pagedResult';

export const getTourGuides = async (page: number | string, limit: number | string, signal?: AbortSignal) => {
    const res = await http.get<PagedResult<TourGuide>>('tour-guides', {
      params: {
        pageSize: limit,
        pageIndex: page,
      },
      signal
    });
  
    return res.data; // chỉ trả về mảng News[]
  };

export const getTourGuide = (id: number | string) => http.get<TourGuide>(`tour-guides/${id}`)

export const addTourGuide = async (newsData: TourGuide) => {
  const response = await http.post('/tour-guides', newsData);
  return response.data;  // Assuming the API returns the created news item
};

export const updateTourGuide = async (id: number, newsData: TourGuide) => {
  const response = await http.put(`/tour-guides/${id}`, newsData);
  return response.data;  // Assuming the API returns the updated news item
};

export const deleteTourGuide = (id: number | string) => http.delete<object>(`tour-guides/${id}`)

