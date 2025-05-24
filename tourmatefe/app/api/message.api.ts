import { ApiResponse } from "@/types/message";
import http from "../utils/http";

export const fetchMessages = async (conversationId: number, page: unknown, pageSize: number) => {
  const res = await http.get<ApiResponse>(`/conversation/${conversationId}/messages`, {
    params: { page, pageSize },
  });
  return res.data;
};

export const sendMessageApi = async (conversationId: number, text: string, senderId: number) => {
  return await http.post(`/conversation/${conversationId}/send`, { text, senderId });
};