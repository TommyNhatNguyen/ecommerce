import { LOCAL_STORAGE } from "@/app/constants/localStorage";
import { TokenModel } from "@/app/shared/models/auth/auth.model";
import Cookies from "js-cookie";

export const cookiesStorage = {
  setToken: (data: TokenModel) => {
    Cookies.set(LOCAL_STORAGE.TOKEN, JSON.stringify(data));
  },
  getToken: (): any => {
    return JSON.parse(Cookies.get(LOCAL_STORAGE.TOKEN) || "{}");
  },
  deleteToken: (): void => {
    Cookies.remove(LOCAL_STORAGE.TOKEN);
  },
};

export const localStorageService = {
  setData: (key: string, data: any): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  getData: (key: string): any => {
    return JSON.parse(localStorage.getItem(key) || "{}");
  },
  deleteData: (key: string): void => {
    localStorage.removeItem(key);
  },
};
