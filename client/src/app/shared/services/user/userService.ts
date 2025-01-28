import { IUserConditionDTO } from "@/app/shared/interfaces/user/user.dto";
import { User } from "@/app/shared/models/user/user.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const userService = {
  async getUserInfo(query: IUserConditionDTO) : Promise<{data: User, message: string}> {
    const response = await axiosInstance.get("/users-info", { params: query });
    return response.data;
  },
};
