import { logout } from "@/app/shared/store/reducers/auth";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import axios from "axios";
import { authServices } from "@/app/shared/services/auth/authServices";
import { customerService } from "@/app/shared/services/customers/customerService";

let retry = false;

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
    retry = false;
    return response;
  },
  async (error) => {
    const prevRequest = error.config;
    if (error?.response?.status === 401 && !retry) {
      retry = true
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
        cookiesStorage.deleteToken();
        console.log(error);
      }
    } else {
      return Promise.reject(error);
    }
  },
);
