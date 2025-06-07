import { Applications, RejectCVRequest } from "@/types/applications";
import http from "../utils/http";
import { PagedResult } from "@/types/pagedResult";

export const createCVApplication = async (data: Partial<Applications>) => {
  const response = await http.post("/cv-applications", data);
  return response.data;
};

export const getCVApplications = async (
  page: number | string,
  limit: number | string,
  signal?: AbortSignal
) => {
  const res = await http.get<PagedResult<Applications>>("cv-applications", {
    params: {
      pageSize: limit,
      pageIndex: page,
    },
    signal,
  });

  return res.data;
};

export const updateCVApplication = async (
  id: number,
  data: Partial<Applications>
) => {
  const response = await http.put(`/cv-applications/${id}`, data);
  return response.data;
};

export const rejectCVApplication = async (data: RejectCVRequest) => {
  const response = await http.post("/account/reject", data);
  return response.data;
};
