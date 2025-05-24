export type LoginResponse = {
    accessToken: string, 
    refreshToken: string
}


export type LoginPayload = {
  email: string;
  password: string;
}