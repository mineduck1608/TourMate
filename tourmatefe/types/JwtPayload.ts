// Define a custom type for your JWT payload
export type MyJwtPayload = {
  AccountId?: number;
  Role?: string;
  FullName: string;
  // add other properties if needed
  [key: string]: any;
};