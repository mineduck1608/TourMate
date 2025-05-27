
import { TourService } from '@/types/tour-service';
import http from '../utils/http'
import { PagedResult } from '@/types/pagedResult';

export const getTourServices = async (page: number | string, limit: number | string, signal?: AbortSignal) => {
  const res = await http.get<PagedResult<TourService>>('tour-services', {
    params: {
      pageSize: limit,
      pageIndex: page,
    },
    signal
  });

  return res.data; // chỉ trả về mảng News[]
};

export const getTourService = (id: number | string) => http.get<TourService>(`tour-services/${id}`)

export const addTourService = async (newsData: TourService) => {
  const response = await http.post('/tour-services', newsData);
  return response.data;  // Assuming the API returns the created news item
};

export const updateTourService = async (id: number, newsData: TourService) => {
  const response = await http.put(`/tour-services/${id}`, newsData);
  return response.data;  // Assuming the API returns the updated news item
};

export const deleteTourService = (id: number | string) => http.delete<object>(`tour-services/${id}`)

export const getTourServicesOf = async (tourGuideId: number | string, page: number | string, limit: number | string, signal?: AbortSignal) => {
  const res = await http.get<PagedResult<TourService>>('tour-services/services-of', {
    params: {
      pageSize: limit,
      pageIndex: page,
      tourGuideId: tourGuideId
    },
    signal
  });
  return res.data;
};

export const getOtherTourServicesOf = async (tourGuideId: number | string, serviceId: number, pageSize: number, signal?: AbortSignal) => {
  const res = await http.get<TourService>('tour-services/other-services-of', {
    params: {
      pageSize: pageSize,
      tourGuideId: tourGuideId,
      serviceId: serviceId
    },
    signal
  });
  return res.data;
};