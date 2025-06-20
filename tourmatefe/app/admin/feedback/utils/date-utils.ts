// Utility function để lấy date từ feedback object
export const getFeedbackDate = (feedback: any): string => {
  return feedback.createdDate || feedback.createdAt || new Date().toISOString()
}

// Format date string thành định dạng hiển thị
export const formatFeedbackDate = (feedback: any): string => {
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
export const isRecentFeedback = (feedback: any, days: number = 7): boolean => {
  const feedbackDate = new Date(getFeedbackDate(feedback))
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - feedbackDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days
}

// Sort feedbacks by date (newest first)
export const sortFeedbacksByDate = (feedbacks: any[]): any[] => {
  return feedbacks.sort((a, b) => {
    const dateA = new Date(getFeedbackDate(a))
    const dateB = new Date(getFeedbackDate(b))
    return dateB.getTime() - dateA.getTime()
  })
}
