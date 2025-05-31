import { Customer } from "./customer";
import { Role } from "./role";
import { TourGuide } from "./tour-guide";

export type Account = {
  accountId: number;
  email: string;
  password: string;
  createdDate: string;
  roleId: number;
  status: boolean;
  role?: Role,
  customers?: Customer[]
  tourGuides?: TourGuide[]
}