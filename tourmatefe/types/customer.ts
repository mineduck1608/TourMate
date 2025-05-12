import { Account } from "./account";

export type CreateCustomer = {
    customerId: number;
    fullName: string;
    accountId: number;
    gender: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    password: string;
    createdAt: string;
    roleId: number;
    status: boolean;
};

export type Customer = {
    customerId: number;
    fullName: string;
    accountId: number;
    gender: string;
    dateOfBirth: string;
    phone: string;
    Account: Account;
}

