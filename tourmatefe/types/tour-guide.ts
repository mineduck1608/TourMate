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
    account: Account
    tourGuideDescs?: TourGuideDesc[],
    tourServices?: TourService[],
    account: Account
    email: string,
    password: string,
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