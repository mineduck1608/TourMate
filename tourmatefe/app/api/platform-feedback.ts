import { PlatformFeedback } from "@/types/platform-feedback";
import http from "../utils/http";

export const addPlatformFeedback = async (data: PlatformFeedback) => {
  const response = await http.post('/platform-feedback', data);
  return response.data;
};