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
    tourGuideDescs?: TourGuideDesc[],
    tourServices?: TourService[],
    account: Account,
    bannerImage: string
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
}

export type TourGuideAdminUpdateModel = {
    tourGuideId: number,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    accountId: number,
    phone: string,
    email: string,
    password?: string
}

export function convertToUpdateModel(tourGuide: TourGuide) {
    const desc = tourGuide.tourGuideDescs?.[0]
    const result: TourGuideUpdateModel = {
        ...tourGuide,
        description: desc?.description ?? '',
        areaId: desc?.areaId ?? 0,
        company: desc?.company ?? '',
        yearOfExperience: desc?.yearOfExperience
    }
    console.log();
    console.log(result);

    return result
}