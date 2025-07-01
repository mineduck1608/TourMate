import { createContext } from "react"

export type SimplifiedAreaContextProps = {
    areas: Record<number, string>
}

export const SimplifiedAreaContext = createContext<SimplifiedAreaContextProps | undefined>(undefined)