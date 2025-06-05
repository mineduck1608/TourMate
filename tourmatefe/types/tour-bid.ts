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
export interface TourBidListResult {
  tourBidId: number;
  accountId: number;
  customerName: string;
  createdAt: string; // or Date if you'll convert it
  placeRequested: number;
  placeRequestedName: string;
  status: string;
  content: string;
  maxPrice?: number;
  likeCount: number;
  isLiked: boolean;
  customerImg: string
}