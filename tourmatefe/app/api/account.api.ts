import { LoginPayload, LoginResponse } from "@/types/authenticate";
import http from "../utils/http";
import { Account } from "@/types/account";
import { Customer } from "@/types/customer";
import axios from "axios";

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
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "msg" in error.response.data
      ) {
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

export const RequestResetPassword = async (email: string) => {
  try {
    const response = await http.post(`/account/request-reset-password`, {
      email,
    });
    return response.data.msg;
  } catch (error) {
    let message = "Yêu cầu thất bại!";

    if (axios.isAxiosError(error)) {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "msg" in error.response.data
      ) {
        message = (error.response.data as { msg: string }).msg;
      }
    }
    throw new Error(message);
  }
};

export const ResetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await http.post(`/account/reset-password`, {
      token,
      newPassword,
    });
    return response.data.msg;
  } catch (error) {
    let message = "Yêu cầu thất bại!";

    if (axios.isAxiosError(error)) {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "msg" in error.response.data
      ) {
        message = (error.response.data as { msg: string }).msg;
      }
    }
    throw new Error(message);
  }
};

export const createCustomer = async (
  data: Pick<Account, "email" | "password"> &
    Pick<Customer, "fullName" | "phone" | "gender" | "dateOfBirth">
) => {
  try {
    const response = await http.post("/account/registercustomer", data);
    return response.data;
  } catch (error) {
    let message = "Đăng ký thất bại";

    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        if (
          typeof error.response.data === "object" &&
          "msg" in error.response.data
        ) {
          message = error.response.data.msg;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
      }
    }
    throw new Error(message);
  }
};

export const getUserByAccountAndRole = async (id: number, role: string) => {
  const response = await http.get<Account>(`account/getbyaccountandrole`, {
    params: {
      id: id,
      role: role,
    },
  });
  return response.data;
};

export const changePassword = async (
  accountId: number,
  currentPassword: string,
  newPassword: string
) => {
  const response = await http.put(`/account/changepassword`, null, {
    params: {
      accountId,
      currentPassword,
      newPassword,
    },
  });
  return response.data;
};

export const getAssociatedId = async (accId: number, role: 'Customer' | 'TourGuide') => {
  const response = await http.get<number>(`/account/get-associated-id`, {
    params: {
      accountId: accId,
      role
    },
  });
  return response.data;
}