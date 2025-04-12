import { LoginDTO, RefreshTokenDTO } from "@/app/shared/interfaces/auth/auth.dto";
import { TokenModel } from "@/app/shared/models/auth/auth.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const authServices = {
  login: async (
    data: LoginDTO,
  ): Promise<{ data: TokenModel; message: string }> => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data;
  },
  refreshToken: async (
    data: RefreshTokenDTO,
  ): Promise<{ data: TokenModel; message: string }> => {
    const response = await axiosInstance.post("/users/refresh-token", data);
    return response.data;
  },
};
