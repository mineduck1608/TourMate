import { TourService } from "@/types/tour-service"
import { createContext } from "react"

export type ServiceEditContextProp = {
    modalOpen: { edit: boolean, delete: boolean },
    setModalOpen: (b: { edit: boolean, delete: boolean }) => void,
    target: TourService,
    setTarget: (t: TourService) => void,
    signal: { edit: boolean, delete: boolean },
    setSignal: (s: { edit: boolean, delete: boolean }) => void
}

export const ServiceEditContext = createContext<ServiceEditContextProp | undefined>(undefined)