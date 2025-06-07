import { Invoice } from "@/types/invoice";
import http from "../utils/http";

export const addInvoice = async (data: Invoice) => {
  const response = await http.post('/invoices', data);
  return response.data;
};

export const deleteInvoice = async (id: number | string) => await http.delete<object>(`invoices/${id}`)

export const denyInvoice = async (id: number | string) => await http.put<object>(`invoices/deny/${id}`)

export const getInvoiceById = async (id: number) => {
  const response = await http.get<Invoice>(`invoices/${id}`)
  return response.data
} 