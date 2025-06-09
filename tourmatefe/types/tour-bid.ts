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

export function statusToCode(s: string){
  s = s.trim().toLowerCase()
  switch(s){
    case 'hoạt động': return 1;
    case 'chấm dứt': return 2;
  }
  return -1
}

export function codeToStatus(s: number){
  switch(s){
    case 1: return 'Hoạt động';
    case 2: return 'Chấm dứt';
  }
  return ''
}