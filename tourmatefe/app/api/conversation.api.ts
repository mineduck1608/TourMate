import { ConversationListResult } from "@/types/conversation";
import http from "../utils/http";

export const fetchConversations = async (
  page: unknown ,
  pageSize: number,
  userId: number,
  searchTerm: string = ""
) => {
  const res = await http.get<ConversationListResult>("/conversation", {
    params: {
      page,
      pageSize,
      userId,
      searchTerm: searchTerm.trim(),
    },
  });
  console.log(res.data)
  return res.data;
};

export const fetchMarkRead = async (id: number, userId: number) => {

  const response = await http.post(`/messages/${id}/mark-read`, {
    params: {
      userId,
    },
  });
  return response.data;
};