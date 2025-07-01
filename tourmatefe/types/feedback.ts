// Tour Feedback Types
export type Feedback = {
  feedbackId: number,
  customerId: number,
  tourGuideId: number,
  createdDate: string,
  content: string,
  rating: number,
  isDeleted: boolean,
  updatedAt: boolean,
  invoiceId: number
}

export type TourGuideFeedback = {
  feedbackId: number,
  customerAccountId: number,
  customerName: string,
  rating: number,
  content: string,
  createdAt: string,
  invoiceId: number
}

export interface TourFeedback {
  feedbackId: number
  customerId: number
  customerName: string
  tourGuideId: number
  tourGuideName: string
  tourName: string
  content: string
  rating: number
  createdDate: string
  updatedAt: string
  invoiceId?: number
  isDeleted: boolean
}

export interface CreateTourFeedback {
  customerId: number
  tourGuideId: number
  invoiceId?: number
  content: string
  rating: number
}

export interface UpdateTourFeedback {
  feedbackId: number
  customerId: number
  tourGuideId: number
  invoiceId?: number
  content: string
  rating: number
}



// Statistics Types
export interface FeedbackStats {
  totalFeedbacks: number
  averageRating: number
  ratingDistribution: RatingDistribution[]
}

export interface RatingDistribution {
  rating: number
  count: number
  percentage: number
}

export interface TopTourGuide {
  tourGuideId: number
  name: string
  averageRating: number
  totalReviews: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors: string[]
}

// Legacy types for backward compatibility
export interface CreateFeedback extends CreateTourFeedback { }
export interface UpdateFeedback extends UpdateTourFeedback { }
