import { Role } from "./role";

export type Account = {
  accountId: number;
  email: string;
  password: string;
  createdDate: string;
  roleId: number;
  status: boolean;
  role: Role
}