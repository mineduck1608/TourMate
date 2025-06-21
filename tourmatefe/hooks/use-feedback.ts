import { useQuery } from "@tanstack/react-query"
import * as feedbackApi from "@/app/api/feedback.api"

// Tour Feedback Hooks
export const useTourFeedbacks = () => {
  return useQuery({
    queryKey: ["tour-feedbacks"],
    queryFn: feedbackApi.getAllTourFeedbacks,
  })
}

export const useTourFeedback = (id: number) => {
  return useQuery({
    queryKey: ["tour-feedback", id],
    queryFn: () => feedbackApi.getTourFeedbackById(id),
    enabled: !!id,
  })
}

export const useTourFeedbacksByTourGuide = (tourGuideId: number) => {
  return useQuery({
    queryKey: ["tour-feedbacks", "tour-guide", tourGuideId],
    queryFn: () => feedbackApi.getTourFeedbacksByTourGuide(tourGuideId),
    enabled: !!tourGuideId,
  })
}

// Statistics Hooks
export const useTourFeedbackStats = () => {
  return useQuery({
    queryKey: ["tour-feedback-stats"],
    queryFn: feedbackApi.getTourFeedbackStats,
  })
}

export const useTopTourGuides = (limit = 10) => {
  return useQuery({
    queryKey: ["top-tour-guides", limit],
    queryFn: () => feedbackApi.getTopTourGuides(limit),
  })
}
