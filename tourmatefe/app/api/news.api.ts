import { News } from '@/types/news'
import http from '../utils/http'
import { PagedResult } from '@/types/pagedResult';

export const getNews = async (page: number | string, limit: number | string, category: string, signal?: AbortSignal) => {
  const res = await http.get<PagedResult<News>>('news', {
    params: {
      pageSize: limit,
      pageIndex: page,
      category: category
    },
    signal
  });

  return res.data; // chỉ trả về mảng News[]
};

export const getRecentNews = async (limit: number, exceptId: number, signal?: AbortSignal) => {
  const res = await http.get<News[]>('news/recent', {
    params: {
      count: limit,
      excludeId: exceptId
    },
    signal
  });

  return res.data; // chỉ trả về mảng News[]
};

export const getOneNews = (id: number | string) => http.get<News>(`news/${id}`)

export const addNews = async (newsData: News) => {
  const response = await http.post('/news', newsData);
  return response.data;  // Assuming the API returns the created news item
};

export const updateNews = async (id: number, newsData: News) => {
  const response = await http.put(`/news/${id}`, newsData);
  return response.data;  // Assuming the API returns the updated news item
};

export const deleteNews = (id: number | string) => http.delete<object>(`news/${id}`)

