import { Account } from "./account"
import { ActiveArea } from "./active-area"

export type TourBid = {
    tourBidId: number,
    accountId: number,
    createdAt: string,
    updatedAt?: string,
    isDeleted: boolean,
    placeRequested: number,
    status: string,
    content: string,
    maxPrice?: number,
    account?: Account,
    placeRequestedNavigation?: ActiveArea,
}