import { Customer } from "@/types/customer";
import http from "../utils/http";
import { PagedResult } from "@/types/pagedResult";

export const getCustomers = async (page: number | string, limit: number | string, signal?: AbortSignal) => {
    const res = await http.get<PagedResult<Customer>>('customer', {
      params: {
        pageSize: limit,
        pageIndex: page,
        email: '',
        phone: ''
      },
      signal
    });
  
    return res.data;
  };


  export const addCustomer = async (data: Customer) => {
    const response = await http.post('/customer', data);
    return response.data;
  };

  export const updateCustomer = async (id: number, data: Customer) => {
    const response = await http.put(`/customer/${id}`, data);
    return response.data;
  };
  
  export const lockCustomer = async (id: number) => {
    const response = await http.put(`/customer/lock/${id}`);
    return response.data;
  };

  export const unlockCustomer = async (id: number) => {
    const response = await http.put(`/customer/unlock/${id}`);
    return response.data;
  };