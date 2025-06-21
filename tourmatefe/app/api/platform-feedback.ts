import { PlatformFeedback } from "@/types/platform-feedback";
import http from "../utils/http";

export const addPlatformFeedback = async (data: PlatformFeedback) => {
  const response = await http.post('/platform-feedback', data);
  return response.data;
};

// Platform Feedback APIs
export const getAllPlatformFeedbacks = async () => {
  const response = await http.get("/platform-feedback")
  return response.data
}

export const getPlatformFeedbackById = async (id: number) => {
  const response = await http.get(`/platform-feedback/${id}`)
  return response.data
}

export const getPlatformFeedbacksByRating = async (rating: number) => {
  const response = await http.get(`/platform-feedback/rating/${rating}`)
  return response.data
}

export const getPlatformFeedbackStats = async () => {
  const response = await http.get("/platform-feedback/stats")
  return response.data
}