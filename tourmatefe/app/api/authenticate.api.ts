import { LoginPayload, LoginResponse } from "@/types/authenticate";
import http from "../utils/http";

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
    } catch (error: any) {
        const message =
            error.response?.data?.msg || error.msg || "Đăng nhập thất bại";
        console.log(error)
        throw new Error(message);

    }
}