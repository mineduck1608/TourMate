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
