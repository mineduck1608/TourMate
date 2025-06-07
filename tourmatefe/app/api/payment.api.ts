import { Payment } from "@/types/payment";
import http from "../utils/http";

export interface PaymentResponse {
  checkoutUrl: string;
  // thêm các thuộc tính khác nếu cần
}

// Gọi API tạo link thanh toán dùng embedded method (POST + query params)
export const createEmbeddedPaymentLink = async (
  amount: number,
  type: string,
  signal?: AbortSignal
): Promise<string> => {
  const queryParams = new URLSearchParams({
    amount: amount.toString(),
    type,
  }).toString();

  const response = await http.post<PaymentResponse>(
    `payos/create-embedded-payment-link?${queryParams}`,
    null, // POST nhưng không có body
    {
      headers: {
        'Content-Type': 'application/json',
      },  
      signal,
    }
  );

  return response.data.checkoutUrl;
};

// Các hàm hiện có bạn đã viết:
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
  return res.data.checkoutUrl;
};

export const fetchPaymentById = async (id: number) => {
  const response = await http.get<Payment>(`payment/${id}`);
  return response.data;
};

export const addPayment = async (data: Payment) => {
  const response = await http.post('/payment', data);
  return response.data;
};
