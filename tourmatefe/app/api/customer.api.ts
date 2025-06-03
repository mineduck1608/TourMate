import { Customer, CustomerAdminUpdateModel } from "@/types/customer";
import http from "../utils/http";
import { PagedResult } from "@/types/pagedResult";


export const getCustomers = async (
  page: number | string,
  limit: number | string,
  signal?: AbortSignal,
  phone?: string
) => {
  const res = await http.get<PagedResult<Customer>>("customer", {
    params: {
      pageSize: limit,
      pageIndex: page,
      phone: phone,
    },
    signal,
  });

  return res.data;
};

export const addCustomer = async (data: Customer) => {
  const response = await http.post("/customer", data);
  return response.data;
};

export const updateCustomer = async (id: number, data: CustomerAdminUpdateModel) => {
  const response = await http.put(`/customer/${id}`, data);
  return response.data;
};

export const updateUserCustomer = async (id: number, data: Customer) => {
  const response = await http.put(`/customer/update/${id}`, data);
  return response.data;
};

export const lockCustomer = async (id: number) => {
  const response = await http.put(`/account/lock/${id}`);
  return response.data;
};

export const unlockCustomer = async (id: number) => {
  const response = await http.put(`/account/unlock/${id}`);
  return response.data;
};

export const getCustomerWithAcc = async (id: number) => {
  const response = await http.get<Customer>('customer/from-account', {
    params:{accountId: id}
  })
  return response.data
}

export const getCustomerByPhone = async (phone: string) => {
  const response = await http.get<Customer>(`customer/by-phone/${phone}`)
  return response.data
} 