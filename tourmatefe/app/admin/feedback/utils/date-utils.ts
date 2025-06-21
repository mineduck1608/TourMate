import type { TourFeedback } from "@/types/feedback"
import { PlatformFeedbackDto } from "@/types/platform-feedback"

// Utility function để lấy date từ feedback object với proper typing
export const getFeedbackDate = (feedback: TourFeedback | PlatformFeedbackDto): string => {
  if ("createdDate" in feedback) {
    return feedback.createdDate
  }
  if ("createdAt" in feedback) {
    return feedback.createdAt
  }
  return new Date().toISOString()
}

// Format date string thành định dạng hiển thị
export const formatFeedbackDate = (feedback: TourFeedback | PlatformFeedbackDto): string => {
  const dateString = getFeedbackDate(feedback)
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Check if feedback is within last N days
export const isRecentFeedback = (feedback: TourFeedback | PlatformFeedbackDto, days = 7): boolean => {
  const feedbackDate = new Date(getFeedbackDate(feedback))
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - feedbackDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days
}

// Sort feedbacks by date (newest first) với proper typing
export const sortFeedbacksByDate = (
  feedbacks: (TourFeedback | PlatformFeedbackDto)[],
): (TourFeedback | PlatformFeedbackDto)[] => {
  return feedbacks.sort((a, b) => {
    const dateA = new Date(getFeedbackDate(a))
    const dateB = new Date(getFeedbackDate(b))
    return dateB.getTime() - dateA.getTime()
  })
}
