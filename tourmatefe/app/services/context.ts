import { Customer } from "@/types/customer"
import { createContext } from "react"

export type CustomerSiteContextProp = {
  id: number,
  accId: number,
  customer?: Customer
}
export const CustomerSiteContext = createContext<CustomerSiteContextProp | undefined>(undefined)