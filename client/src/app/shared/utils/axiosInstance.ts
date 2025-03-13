import { logout } from "@/app/shared/store/reducers/auth";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import axios from "axios";
import { authServices } from "@/app/shared/services/auth/authServices";
import { customerService } from "@/app/shared/services/customers/customerService";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${cookiesStorage.getToken().accessToken}`,
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = cookiesStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    error.config._retry = false;
    const prevRequest = error.config;
    if (error?.response?.status === 403 && !prevRequest._retry) {
      prevRequest._retry = true;
      try {
        // get url
        const url = error.config.url.includes("users");
        if (url) {
          const response = await authServices.refreshToken({
            refreshToken: cookiesStorage.getToken().refreshToken,
          });
          cookiesStorage.setToken(response.data);
          prevRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        } else {
          const response = await customerService.refreshToken({
            refreshToken: cookiesStorage.getToken().refreshToken,
          });
          cookiesStorage.setToken(response);
          prevRequest.headers.Authorization = `Bearer ${response.accessToken}`;
        }
        return axiosInstance(prevRequest);
      } catch (error) {
        console.log(error);
        cookiesStorage.deleteToken();
      }
    } else {
      return Promise.reject(error);
    }
  },
);
