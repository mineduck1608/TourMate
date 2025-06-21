import { Account } from "./account"
import { Payment } from "./payment"

export type PlatformFeedback = {
    feedbackId: number,
    accountId: number,
    paymentId: number,
    rating: number,
    content?: string,
    createdAt: string,
    account?: Account
    payment?: Payment
}

export interface CreatePlatformFeedback {
  accountId: number
  paymentId: number
  rating: number
  content?: string
}

export type PlatformFeedbackDto = {
    feedbackId: number,
    accountId: number,
    accountName: string,
    rating: number,
    content?: string,
    createdAt: string,
    paymentId: number
}