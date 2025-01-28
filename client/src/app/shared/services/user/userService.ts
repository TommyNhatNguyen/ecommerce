import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const userService = {
  async getUserInfo() {
    const response = await axiosInstance.get("/users-info");
    return response.data;
  },
};
