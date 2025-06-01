import { Account } from "./account"
import { ActiveArea } from "./active-area"
import { Bid } from "./bid"

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
    bids?: Bid[]
}