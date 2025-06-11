import { TourBid } from "@/types/tour-bid"
import { createContext } from "react"

export type BidCreateContextProps = {
    formData: TourBid,
    setFormData: (tourBid: TourBid) => void,
    fireCreateSignal: boolean,
    setFireCreateSignal: (b: boolean) => void
}

export const BidCreateContext = createContext<BidCreateContextProps | undefined>(undefined)