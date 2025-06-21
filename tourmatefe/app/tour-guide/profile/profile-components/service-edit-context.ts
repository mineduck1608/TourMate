import { TourService } from "@/types/tour-service"
import { createContext } from "react"

export type ServiceEditContextProp = {
    modalOpen: { edit: boolean, delete: boolean, create: boolean },
    setModalOpen: (b: { edit: boolean, delete: boolean, create: boolean }) => void,
    target: TourService,
    setTarget: (t: TourService) => void,
    signal: { edit: boolean, delete: boolean, create: boolean },
    setSignal: (s: { edit: boolean, delete: boolean, create: boolean }) => void
}

export const ServiceEditContext = createContext<ServiceEditContextProp | undefined>(undefined)