export type MyJwtPayload = {
  AccountId: number;
  FullName: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  [key: string]: unknown;
};
