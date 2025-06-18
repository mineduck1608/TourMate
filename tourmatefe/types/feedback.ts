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

export type CreateFeedback = {
  customerId: number
  tourGuideId: number
  content: string
  rating: number
  invoiceId: number
}

export type UpdateFeedback = {
  feedbackId: number
  content: string
  rating: number
}
