import { TourGuide } from "@/types/tour-guide"
import { createContext } from "react"

export type TourGuideSiteContextProps = {
  id: number,
  accId: number,
  tourGuide?: TourGuide
}
export const TourGuideSiteContext = createContext<TourGuideSiteContextProps | undefined>(undefined)