import { Invoice } from "@/types/invoice";
import http from "../utils/http";

export const addInvoice = async (data: Invoice) => {
  const response = await http.post('/invoices', data);
  return response.data;
};