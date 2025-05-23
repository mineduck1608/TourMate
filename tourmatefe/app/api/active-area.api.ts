import { ActiveArea } from '@/types/active-area';
import http from '../utils/http'
import { PagedResult } from '@/types/pagedResult';

export const getActiveAreas = async (page: number | string, limit: number | string, signal?: AbortSignal) => {
    const res = await http.get<PagedResult<ActiveArea>>('active-area', {
      params: {
        pageSize: limit,
        pageIndex: page
      },
      signal
    });
  
    return res.data;
  };

  export const getFilteredActiveAreas = async (page: number | string, limit: number | string, search: string, region: string, signal?: AbortSignal) => {
    const res = await http.get<PagedResult<ActiveArea>>('active-area/filtered-area', {
      params: {
        pageSize: limit,
        pageIndex: page,
        search: search,
        region: region
      },
      signal
    });
  
    return res.data;
  };


export const getActiveArea = async (id: number | string) => http.get<ActiveArea>(`active-area/${id}`)

export const addActiveArea = async (data: ActiveArea) => {
  const response = await http.post('/active-area', data);
  return response.data;
};

export const updateActiveArea = async (id: number, data: ActiveArea) => {
  const response = await http.put(`/active-area/${id}`, data);
  return response.data;
};

export const deleteActiveArea = (id: number | string) => http.delete<object>(`active-area/${id}`)

