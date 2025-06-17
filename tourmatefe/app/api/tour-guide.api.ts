import { convertToUpdateModel, TourGuide, TourGuideAdminUpdateModel, TourGuideIdAndName } from "@/types/tour-guide";
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

export const getTourGuideByAccountId = async (accountId: number): Promise<TourGuideIdAndName> => {
  const response = await http.get<TourGuideIdAndName>(`/tour-guide/from-account/${accountId}`);
  return response.data;
};

export const getByAccountId = async (accountId: number): Promise<TourGuide> => {
  const response = await http.get<TourGuide>(`/tour-guide/get-by-accountid/${accountId}`);
  return response.data;
};


export const getList = async (name: string, areaId: string | number | undefined, page: number | string, limit: number | string, signal?: AbortSignal) => {
  const num = Number(areaId)
  const res = await http.get<PagedResult<TourGuide>>('tour-guide/get-list', {
    params: {
      pageSize: limit,
      pageIndex: page,
      name: name,
      areaId: num > 0 ? num : undefined
    },
    signal
  });

  return res.data;
};

export const getTourGuide = async (id: number) => http.get<TourGuide>(`tour-guide/${id}`)


export const addTourGuide = async (data: TourGuide) => {
  const response = await http.post('/tour-guide', data);
  return response.data;
};

export const updateTourGuide = async (id: number, data: TourGuide) => {
  const response = await http.put(`/tour-guide/${id}`, data);
  return response.data;
};

export const updateTourGuideAdmin = async (id: number, data: TourGuideAdminUpdateModel) => {
  const response = await http.put(`/tour-guide/${id}`, data);
  return response.data;
};
export const updateTourGuideClient = async (data: TourGuide) => {
  const response = await http.put(`/tour-guide/update-from-client`, convertToUpdateModel(data));
  return response.data;
};
export const changePicture = async (id: number, fieldToChange: string, newValue: string) => {
  const response = await http.put(`/tour-guide/change-picture/${id}`, newValue, {
    params: { fieldToChange },
  });
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

export const getOtherTourGuides = async (tourGuideId: number | string, pageSize: number, signal?: AbortSignal) => {
  const res = await http.get<TourGuide>('tour-guide/other', {
    params: {
      pageSize: pageSize,
      tourGuideId: tourGuideId,
    },
    signal
  });
  return res.data;
};

export const getTourGuidesByArea = async (areaId: number | string, pageSize: number, signal?: AbortSignal) => {
  const res = await http.get<TourGuide>('tour-guide/getbyarea', {
    params: {
      pageSize: pageSize,
      areaId: areaId,
    },
    signal
  });
  return res.data;
};

export const changePassword = async (id: number, newPassword: string) => {
  try {
    const response = await http.put(`/tour-guide/change-password/${id}`, newPassword);
    return response.data;
  }
  catch (err) {
    throw err
  }
}
