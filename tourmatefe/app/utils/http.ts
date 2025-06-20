import { apiUrl } from '@/types/constants'
import axios, { AxiosInstance } from 'axios'
import { refreshToken as callRefreshToken } from "@/app/api/account.api";

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor
    this.instance.interceptors.request.use((config) => {
      const token = sessionStorage.getItem('accessToken')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // ❗️Chặn retry cho chính API refresh-token
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          sessionStorage.getItem('refreshToken') &&
          !originalRequest.url?.includes('/refresh-token') // 🔥 tránh lặp vô hạn
        ) {
          originalRequest._retry = true;
          try {
            const res = await callRefreshToken();
            sessionStorage.setItem('accessToken', res.accessToken);
            sessionStorage.setItem('refreshToken', res.refreshToken);

            originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            sessionStorage.clear();
            console.error("Refresh token failed:", refreshError);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    )
  }
}

const http = new Http().instance
export default http
