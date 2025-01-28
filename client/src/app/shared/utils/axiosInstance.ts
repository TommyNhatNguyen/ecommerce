import { logout } from "@/app/shared/store/reducers/auth";
import { useAppDispatch } from "@/app/shared/hooks/useRedux";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import axios from "axios";
import { authServices } from "@/app/shared/services/auth/authServices";

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
    const dispatch = useAppDispatch();
    error.config._retry = false;
    const prevRequest = error.config;
    console.log(prevRequest);
    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !prevRequest._retry
    ) {
      prevRequest._retry = true;
      try {
        const response = await authServices.refreshToken({
          username: "tommy",
          refreshToken: cookiesStorage.getToken().refreshToken,
        });
        cookiesStorage.setToken(response.data);
        prevRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axiosInstance(prevRequest);
      } catch (error) {
        console.log(error);
        dispatch(logout());
      }
    } else {
      dispatch(logout());
      return Promise.reject(error);
    }
  },
);
