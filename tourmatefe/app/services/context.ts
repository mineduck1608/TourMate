import { createContext } from "react"

export type CustomerSiteContextProp = {
  id: number,
  accId: number
}
export const CustomerSiteContext = createContext<CustomerSiteContextProp | undefined>(undefined)