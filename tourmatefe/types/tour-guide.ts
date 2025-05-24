import { Account } from "./account"
import { ActiveArea } from "./active-area"
import { TourService } from "./tour-service"

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
    tourGuideDescs?: TourGuideDesc[],
    tourServices?: TourService[],
    account?: Account
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

export type TourGuideUpdateModel = {
    tourGuideId: number,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    accountId: number,
    address: string,
    image: string,
    phone: string,
    yearOfExperience?: number,
    description: string,
    areaId: number,
    company: string,
    email: string;
    password: string;
}

export function convertToUpdateModel(tourGuide: TourGuide) {
    const desc = tourGuide.tourGuideDescs?.[0]
    const result: TourGuideUpdateModel = {
        ...tourGuide,
        description: desc?.description ?? '',
        areaId: desc?.areaId ?? 0,
        company: desc?.company ?? '',
        email: tourGuide.account?.email ?? '',
        password: tourGuide.account?.password ?? ''
    }
    return result
}