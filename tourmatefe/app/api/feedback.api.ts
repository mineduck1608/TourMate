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
export const getTourGuideFeedbacksPaged = async (tourGuideId: number, page = 1, pageSize = 10) => {
  const params = new URLSearchParams({
    tourGuideId: tourGuideId.toString(),
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  const response = await http.get(`/feedback/tour-guide/public?${params}`)
  return response.data
}

// Tour Feedback APIs
export const getAllTourFeedbacks = async () => {
  const response = await http.get("/feedback/tour")
  return response.data
}

export const getTourFeedbackById = async (id: number) => {
  const response = await http.get(`/feedback/tour/${id}`)
  return response.data
}

export const getTourFeedbacksByTourGuide = async (tourGuideId: number) => {
  const response = await http.get(`/feedback/tour/tour-guide/${tourGuideId}`)
  return response.data
}

export const getTourFeedbacksByRating = async (rating: number) => {
  const response = await http.get(`/feedback/tour/rating/${rating}`)
  return response.data
}


// Statistics APIs
export const getTourFeedbackStats = async () => {
  const response = await http.get("/feedback/tour/stats")
  return response.data
}


export const getTopTourGuides = async (limit = 10) => {
  const response = await http.get(`/feedback/tour/top-guides?limit=${limit}`)
  return response.data
}


export const getTourGuideFeedbacks = async (tourGuideId: number, page = 1, pageSize = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  const response = await http.get(`/feedback/tour/tour-guide/${tourGuideId}?${params}`)
  return response.data
}