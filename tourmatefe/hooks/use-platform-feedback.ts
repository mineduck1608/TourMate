import { useQuery } from "@tanstack/react-query"
import * as platformFeedbackApi from "@/app/api/platform-feedback"


// Platform Feedback Hooks
export const usePlatformFeedbacks = () => {
  return useQuery({
    queryKey: ["platform-feedbacks"],
    queryFn: platformFeedbackApi.getAllPlatformFeedbacks,
  })
}

export const usePlatformFeedbackStats = () => {
  return useQuery({
    queryKey: ["platform-feedback-stats"],
    queryFn: platformFeedbackApi.getPlatformFeedbackStats,
  })
}