import { Account } from "./account";

export type Customer = {
  customerId: number;
  fullName: string;
  accountId: number;
  gender: string;
  dateOfBirth: string;
  phone: string;
  image: string;
  account: Account;
};

