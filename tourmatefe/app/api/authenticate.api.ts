import { LoginPayload, LoginResponse } from "@/types/authenticate";
import http from "../utils/http";

import axios, { AxiosError } from "axios";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await http.post<LoginResponse>("/account/login", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;

    if (data && data.accessToken && data.refreshToken) {
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
    }

    return data;
  } catch (error) {
    let message = "Đăng nhập thất bại";

    if (axios.isAxiosError(error)) {
      if (error.response?.data && typeof error.response.data === "object" && "msg" in error.response.data) {
        message = (error.response.data as { msg: string }).msg;
      } else if (error.message) {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    console.log(error);
    throw new Error(message);
  }
}
