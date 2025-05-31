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

