import { ActiveArea } from "./active-area"

export type TourGuide = {
    tourGuideId: number,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    accountId: number,
    address: string,
    image: string,
    phone: string,
    /**
     * 1 to 1 scaffolded as 1 to n
     */
    tourGuideDescs: TourGuideDesc[]
}

export type TourGuideDesc = {
    tourGuideDescId: number,
    tourGuideId: number,
    yearOfExperience?: number,
    description: string,
    areaId: number,
    company: string,
    area: ActiveArea
}