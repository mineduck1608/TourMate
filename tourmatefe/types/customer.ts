import { Account } from "./account";

export type Customer = {
  customerId: number;
  fullName: string;
  accountId: number;
  address: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  image: string;
  account: Account;
};

export type CustomerAdminUpdateModel = {
    customerId: number,
    fullName: string,
    gender: string,
    dateOfBirth: string,
    accountId: number,
    phone: string,
    email: string,
    password?: string
}
