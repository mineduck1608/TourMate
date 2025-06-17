import { StringFormat } from "firebase/storage"
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