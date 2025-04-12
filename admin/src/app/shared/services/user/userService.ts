import { ListResponseModel } from "./../../models/others/list-response.model.d";
import { ICreateUserDTO, IUserConditionDTO } from "@/app/shared/interfaces/user/user.dto";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { User } from "@/app/shared/models/user/user.model";
import { axiosInstance } from "@/app/shared/utils/axiosInstance";

export const userService = {
  async getUserInfo(
    query: IUserConditionDTO,
  ): Promise<{ data: User; message: string }> {
    const response = await axiosInstance.get("/users-info", { params: query });
    return response.data;
  },
  async getUserList(
    query: IUserConditionDTO,
  ): Promise<ListResponseModel<User>> {
    const response = await axiosInstance.get("/users", { params: query });
    return response.data;
  },
  async deleteUser(id: string): Promise<boolean> {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
  async updateUserStatus(id: string, status: ModelStatus): Promise<User> {
    const response = await axiosInstance.put(`/users/${id}`, { status });
    return response.data;
  },
  async updateUserRole(id: string, role_id: string): Promise<User> {
    const response = await axiosInstance.put(`/users/${id}`, { role_id });
    return response.data;
  },
  async createUser(data: ICreateUserDTO): Promise<User> {
    const response = await axiosInstance.post(`/users`, data);
    return response.data;
  },
};
