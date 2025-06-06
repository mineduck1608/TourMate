import { TourBid, TourBidListResult } from "@/types/tour-bid"
import { createContext } from "react"
export type BidTaskModalType = { edit: boolean, changeStatus: boolean, delete: boolean, create: boolean,  }
export type BidTaskSignalType = { edit: boolean, create: boolean, delete: boolean, likeOrUnlike: boolean }
export type BidTaskContextProp = {
    target: TourBid | TourBidListResult,
    setTarget: (t: TourBid | TourBidListResult) => void
    modalOpen: BidTaskModalType,
    setModalOpen: (b: BidTaskModalType) => void,
    signal: BidTaskSignalType,
    setSignal: (s: BidTaskSignalType) => void,
    
}
export const BidTaskContext = createContext<BidTaskContextProp | undefined>(undefined)
export const base: TourBid = {
    tourBidId: 0,
    accountId: 0,
    createdAt: "",
    isDeleted: false,
    placeRequested: 0,
    status: "",
    content: ""
}
export const baseModal: BidTaskModalType = {
    edit: false,
    changeStatus: false,
    delete: false,
    create: false,
}