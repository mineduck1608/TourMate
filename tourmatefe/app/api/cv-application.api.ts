import { Applications } from '@/types/applications';
import http from '../utils/http';
import { PagedResult } from "@/types/pagedResult";

export const createCVApplication = async (data: Partial<Applications>) => {
  const response = await http.post("/cv-applications", data);
  return response.data;
};

export const getCVApplications = async (
  page: number | string,
  limit: number | string,
  signal?: AbortSignal,
  phone?: string
) => {
  const response = await http.get<PagedResult<Applications>>(
    "/cv-applications",
    {
      params: {
        pageSize: limit,
        pageIndex: page,
        phone: phone,
      },
      signal,
    }
  );
  return response.data;
};

export const updateCVApplication = async (
  id: number,
  data: Partial<Applications>
) => {
  const response = await http.put(`/cv-applications/${id}`, data);
  return response.data;
};