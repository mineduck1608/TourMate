import { Account } from "./account";

export type TourGuide = {
    tourGuideId: number;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    accountId: number;
    address: string;
    image: string;
    phone: string;
    account: Account;
    };