import { Payment } from "@/types/payment";
import http from "../utils/http";

// Define or extend PaymentResponse to include paymentUrl
export interface PaymentResponse {
  paymentUrl: string;
  // add other properties if needed
}

export const getCreatePaymentUrl = async (
  amount: number,
  orderId: string,
  orderType: string,
  signal?: AbortSignal
): Promise<string> => {
  const res = await http.get<PaymentResponse>('payment/create', {
    params: { amount, orderId, orderType },
    signal,
  });
  return res.data.paymentUrl;
};

export const fetchPaymentById = async (id: number) => {
  const response = await http.get<Payment>(`payment/${id}`)
  return response.data
} 