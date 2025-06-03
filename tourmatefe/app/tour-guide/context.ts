import { createContext } from "react"

export type TourGuideSiteContextProps = {
  id: number
}
export const TourGuideSiteContext = createContext<TourGuideSiteContextProps | undefined>(undefined)