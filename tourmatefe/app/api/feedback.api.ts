import type { CreateFeedback, UpdateFeedback } from "@/types/feedback"
import http from "../utils/http"

export const addTourFeedback = async (data: CreateFeedback) => {
  const response = await http.post("/feedback", data)
  return response.data
}

export const updateTourFeedback = async (data: UpdateFeedback) => {
  const response = await http.put(`/feedback/${data.feedbackId}`, data)
  return response.data
}

export const deleteTourFeedback = async (feedbackId: number) => {
  const response = await http.delete(`/feedback/${feedbackId}`)
  return response.data
}

export const getTourFeedbackByInvoice = async (invoiceId: number) => {
  const response = await http.get(`/feedback/invoice/${invoiceId}`)
  return response.data
}

// Thêm API function để lấy feedback của tour guide cho public view
export const getTourGuideFeedbacks = async (tourGuideId: number, page = 1, pageSize = 10) => {
  const params = new URLSearchParams({
    tourGuideId: tourGuideId.toString(),
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  const response = await http.get(`/feedback/tour-guide/public?${params}`)
  return response.data
}
