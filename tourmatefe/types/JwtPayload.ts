import { roleJwt } from "./constants";

// Define a custom type for your JWT payload
export type MyJwtPayload = {
  AccountId: number;
  [roleJwt]: string;
  FullName: string;
  // add other properties if needed
  [key: string]: unknown;
};